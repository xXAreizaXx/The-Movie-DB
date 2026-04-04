import { useTheme } from '@core/theme';
import type { RootStackScreenProps } from '@infrastructure/navigation/types';
import { Text, View } from 'react-native';

type Props = RootStackScreenProps<'MovieDetail'>;

export const MovieDetailScreen = ({ route }: Props) => {
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
      <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '700' }}>
        {route.params.title}
      </Text>
    </View>
  );
};
