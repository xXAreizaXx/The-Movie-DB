import { useTheme } from '@core/theme';
import { MovieDetailScreen } from '@features/movies/presentation/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={({ route }) => ({
          title: route.params.title,
          headerBackButtonDisplayMode: 'minimal',
        })}
      />
    </Stack.Navigator>
  );
};
