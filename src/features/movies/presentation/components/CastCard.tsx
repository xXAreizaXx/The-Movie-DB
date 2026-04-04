import { useTheme } from '@core/theme';
import { Ionicons } from '@expo/vector-icons';
import type { CastMember } from '@features/movies/domain/entities';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

interface CastCardProps {
  member: CastMember;
}

const CARD_SIZE = 80;

export const CastCard = ({ member }: CastCardProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: colors.secondary }]}>
        {member.profileUrl ? (
          <Image
            source={{ uri: member.profileUrl }}
            style={styles.avatarImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <Ionicons name="person" size={28} color={colors.textSecondary} />
        )}
      </View>
      <Text
        style={[styles.name, { color: colors.textPrimary }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {member.name}
      </Text>
      <Text
        style={[styles.character, { color: colors.textSecondary }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {member.character}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_SIZE,
    alignItems: 'center',
  },

  avatar: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: CARD_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  name: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },

  character: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
