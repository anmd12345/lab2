import { Animated, TouchableOpacity, Text } from 'react-native';
import { useRef } from 'react';

const CalcButton = ({ label, onPress, style, textStyle, styles }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress(); // Gọi hàm xử lý sau animation
    });
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
        <Text style={[styles.buttonText, textStyle]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
