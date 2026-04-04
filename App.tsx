import './global.css';

import { useTheme } from '@core/theme';
import { RootNavigator } from '@infrastructure/navigation';
import { QueryProvider } from '@infrastructure/providers';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { OfflineBanner } from '@shared/components';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const { colors, isDark } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    dark: isDark,
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryProvider>
          <NavigationContainer theme={navTheme}>
            <RootNavigator />
            <OfflineBanner />
            <StatusBar style={isDark ? 'light' : 'dark'} />
          </NavigationContainer>
        </QueryProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
