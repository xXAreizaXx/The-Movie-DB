import { useTheme } from '@core/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Movie } from '@features/movies/domain/entities';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const CARD_WIDTH = 140;
const CARD_HEIGHT = 210;

export const MovieCard = ({ movie, onPress }: MovieCardProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(movie)}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={[styles.posterContainer, { backgroundColor: colors.surface }]}>
        {movie.posterUrl ? (
          <Image
            source={{ uri: movie.posterUrl }}
            style={styles.poster}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View style={[styles.placeholder, { backgroundColor: colors.secondary }]}>
            <Ionicons name="film-outline" size={40} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#FBBF24" />
          <Text style={styles.ratingText}>{movie.voteAverage.toFixed(1)}</Text>
        </View>
      </View>
      <Text
        style={[styles.title, { color: colors.textPrimary }]}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {movie.title}
      </Text>
      <Text style={[styles.year, { color: colors.textSecondary }]}>
        {movie.releaseDate ? movie.releaseDate.substring(0, 4) : '—'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginRight: 12,
  },

  posterContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },

  poster: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },

  ratingText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },

  title: {
    fontSize: 13,
    fontWeight: '600',
    width: '100%',
    maxWidth: CARD_WIDTH,
    flexShrink: 1,
  },

  year: {
    fontSize: 11,
    marginTop: 2,
  },
});
