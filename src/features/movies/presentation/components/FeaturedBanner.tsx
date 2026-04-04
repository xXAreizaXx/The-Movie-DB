import { useTheme } from '@core/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Movie } from '@features/movies/domain/entities';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';

interface FeaturedBannerProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 100;

export const FeaturedBanner = ({ movie, onPress }: FeaturedBannerProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onPress(movie)}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.9 : 1 }]}
    >
      {movie.backdropUrl ? (
        <Image
          source={{ uri: movie.backdropUrl }}
          style={styles.backdrop}
          contentFit="cover"
          transition={400}
        />
      ) : (
        <View style={[styles.backdrop, { backgroundColor: colors.secondary }]} />
      )}
      <LinearGradient colors={['transparent', colors.background]} style={styles.gradient} />
      <View style={styles.info}>
        <View style={styles.badge}>
          <Ionicons name="flame" size={12} color="#FBBF24" />
          <Text style={styles.badgeText}>Tendencia</Text>
        </View>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="star" size={12} color="#FBBF24" />
          <Text style={styles.rating}>{movie.voteAverage.toFixed(1)}</Text>
          <Text style={[styles.year, { color: colors.textSecondary }]}>
            {movie.releaseDate ? movie.releaseDate.substring(0, 4) : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    marginBottom: 20,
  },
  backdrop: {
    width: '100%',
    height: 500,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BANNER_HEIGHT * 0.6,
  },
  info: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 6,
  },
  badgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '700',
  },
  year: {
    fontSize: 13,
    marginLeft: 8,
  },
});
