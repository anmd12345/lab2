export const themes = {
  light: {
    background: '#fff',
    text: '#000',
    buttonBackground: '#e0e0e0',
    buttonText: '#000',
  },
  dark: {
    background: '#000',
    text: '#fff',
    buttonBackground: '#333',
    buttonText: '#fff',
  },
  blue: {
    background: '#e6f0ff',
    text: '#003366',
    buttonBackground: '#99ccff',
    buttonText: '#003366',
  },
};

export type ThemeType  = keyof typeof themes;