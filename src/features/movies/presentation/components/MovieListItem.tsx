import { useTheme } from '@core/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Movie } from '@features/movies/domain/entities';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface MovieListItemProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

export const MovieListItem = ({ movie, onPress }: MovieListItemProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(movie)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {/* Backdrop hint */}
      {movie.backdropUrl ? (
        <View style={styles.backdropWrap}>
          <Image
            source={{ uri: movie.backdropUrl }}
            style={styles.backdropImg}
            contentFit="cover"
            transition={250}
          />
          <View style={[styles.backdropOverlay, { backgroundColor: colors.surface }]} />
        </View>
      ) : null}

      <View style={[styles.row, !movie.backdropUrl && styles.rowNoBackdrop]}>
        {/* Poster */}
        <View style={[styles.posterWrap, { backgroundColor: colors.secondary }]}>
          {movie.posterUrl ? (
            <Image
              source={{ uri: movie.posterUrl }}
              style={styles.posterImg}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Ionicons name="film-outline" size={28} color={colors.textSecondary} />
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text
            style={[styles.title, { color: colors.textPrimary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {movie.title}
          </Text>

          <View style={styles.metaRow}>
            <Ionicons name="star" size={11} color="#FBBF24" />
            <Text style={styles.ratingText}>{movie.voteAverage.toFixed(1)}</Text>
            <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {movie.releaseDate ? movie.releaseDate.substring(0, 4) : '—'}
            </Text>
          </View>

          {movie.overview ? (
            <Text
              style={[styles.overview, { color: colors.textSecondary }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {movie.overview}
            </Text>
          ) : null}
        </View>

        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.textSecondary}
          style={styles.chevron}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },

  backdropWrap: {
    height: 70,
    width: '100%',
  },

  backdropImg: {
    width: '100%',
    height: '100%',
  },

  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.55,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: -20,
  },

  rowNoBackdrop: {
    marginTop: 0,
  },

  posterWrap: {
    width: 70,
    height: 105,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  posterImg: {
    width: '100%',
    height: '100%',
  },

  info: {
    flex: 1,
    marginLeft: 12,
    gap: 3,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '700',
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },

  metaText: {
    fontSize: 12,
  },

  overview: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  chevron: {
    marginLeft: 6,
  },
});
