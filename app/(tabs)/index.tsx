import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { evaluate } from "mathjs";
import { themes, ThemeType } from '../../themes/CustomTheme';
import { Audio } from 'expo-av';
import { Animated } from 'react-native';
import { useRef } from 'react';

const CalcButton = ({ label, onPress, theme }: any) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: theme.buttonBackground }]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, { color: theme.buttonText }]}>{label}</Text>
  </TouchableOpacity>
);

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [themeType, setThemeType] = useState<ThemeType>('light');
  const [history, setHistory] = useState<{ key: string; value: string }[]>([]);
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/click.mp3')
    );
    await sound.playAsync();
  };
  const theme = themes[themeType];

  const handlePress = async (value: string) => {
    await playSound();
    if (value === 'C') {
      setExpression('');
      setResult('');
    } else if (value === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
    } else if (value === '=') {
      try {
        if (!expression.trim()) {
          Alert.alert('Error', 'Please enter an expression!');
          return;
        }
        const evalResult = evaluate(expression);
        const resStr = evalResult.toString();
        setResult(resStr);
        setHistory([{ key: Date.now().toString(), value: `${expression} = ${resStr}` }, ...history]);
      } catch {
        setResult('Error');
      }
    } else {
      setExpression(prev => prev + value);
    }
  };

  const handleDeleteHistoryItem = (key: string) => {
    setHistory(history.filter(item => item.key !== key));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const switchTheme = () => {
    const themeList: ThemeType[] = ['light', 'dark', 'blue'];
    const currentIndex = themeList.indexOf(themeType);
    setThemeType(themeList[(currentIndex + 1) % themeList.length]);
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['DEL', 'C']
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={switchTheme}>
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>
              Đổi giao diện: {themeType.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.expression, { color: theme.text }]}>{expression}</Text>
        <Text style={[styles.result, { color: theme.text }]}>{result}</Text>

        <View style={styles.buttonGrid}>
          {buttons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((btn, i) => (
                <CalcButton
                  key={i}
                  label={btn}
                  onPress={() => handlePress(btn)}
                  theme={theme}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={{ marginTop: 10, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
            <Text style={[{ fontWeight: 'bold', fontSize: 18 }, { color: theme.text }]}>Lịch sử tính toán</Text>
            {history.length > 0 && (
              <TouchableOpacity onPress={handleClearHistory}>
                <Text style={{ color: 'red' }}>Xóa lịch sử tính toán</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={history}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={[
                  { textAlign: 'center', marginTop: 20, fontStyle: 'italic', color: theme.text },
                ]}
              >
                Chưa có lịch sử tính toán
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.historyItem}>
                <Text style={[{ flex: 1 }, { color: theme.text }]}>{item.value}</Text>
                <TouchableOpacity onPress={() => handleDeleteHistoryItem(item.key)}>
                  <Text style={{ color: 'red' }}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-end",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 10,
  },
  expression: {
    fontSize: 30,
    textAlign: "right",
    marginBottom: 10,
  },
  result: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 20,
  },
  buttonGrid: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    margin: 5,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
  },
  historyItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    justifyContent: 'space-between'
  }
});
