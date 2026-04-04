import { useColorScheme } from 'react-native';
import { ThemeMap, type ThemeColors, type ColorScheme } from './colors';

interface ThemeResult {
  colors: ThemeColors;
  isDark: boolean;
  scheme: ColorScheme;
}

export const useTheme = (): ThemeResult => {
  const systemScheme = useColorScheme();
  const scheme: ColorScheme = systemScheme === 'light' ? 'light' : 'dark';

  return {
    colors: ThemeMap[scheme],
    isDark: scheme === 'dark',
    scheme,
  };
};
