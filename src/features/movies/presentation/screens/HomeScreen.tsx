import { useTheme } from '@core/theme';
import type { MainTabScreenProps } from '@infrastructure/navigation/types';
import { Text, View } from 'react-native';

type Props = MainTabScreenProps<'Home'>;

export const HomeScreen = (_props: Props) => {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700' }}>Inicio</Text>
    </View>
  );
};
