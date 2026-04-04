import { useTheme } from '@core/theme';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackScreenProps } from '@infrastructure/navigation/types';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CastCard } from '../components';
import { useMovieDetail } from '../hooks';

type Props = RootStackScreenProps<'MovieDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BACKDROP_HEIGHT = 260;

const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

const formatMoney = (amount: number): string => {
  if (!amount) return '—';
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
  return `$${amount.toLocaleString()}`;
};

export const MovieDetailScreen = ({ route }: Props) => {
  const { colors } = useTheme();
  const { movieId } = route.params;
  const { data: movie, isLoading, isError } = useMovieDetail(movieId);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (isError || !movie) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          No se pudo cargar la info
        </Text>
      </View>
    );
  }

  const director = movie.crew.find((c) => c.job === 'Director');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Backdrop */}
      <View style={styles.backdropContainer}>
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
      </View>

      {/* Info principal */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          {movie.posterUrl && (
            <Image
              source={{ uri: movie.posterUrl }}
              style={[styles.poster, { backgroundColor: colors.surface }]}
              contentFit="cover"
              transition={300}
            />
          )}
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{movie.title}</Text>
            {movie.tagline && (
              <Text style={[styles.tagline, { color: colors.textSecondary }]}>{movie.tagline}</Text>
            )}
            <View style={styles.metaRow}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={styles.rating}>{movie.voteAverage.toFixed(1)}</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                ({movie.voteCount.toLocaleString()})
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {formatRuntime(movie.runtime)}
              </Text>
              <Text style={[styles.metaDot, { color: colors.textSecondary }]}>·</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {movie.releaseDate ? movie.releaseDate.substring(0, 4) : '—'}
              </Text>
            </View>
            {director && (
              <View style={styles.metaRow}>
                <Ionicons name="videocam-outline" size={14} color={colors.textSecondary} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {director.name}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Genres */}
        {movie.genres.length > 0 && (
          <View style={styles.genresRow}>
            {movie.genres.map((g) => (
              <View key={g.id} style={[styles.genreBadge, { backgroundColor: colors.surface }]}>
                <Text style={[styles.genreText, { color: colors.textPrimary }]}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Sinopsis */}
        {movie.overview ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Sinopsis</Text>
            <Text style={[styles.overview, { color: colors.textSecondary }]}>{movie.overview}</Text>
          </View>
        ) : null}

        {/* Reparto */}
        {movie.cast.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Reparto</Text>
            <FlatList
              data={movie.cast.slice(0, 20)}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <CastCard member={item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castList}
              ItemSeparatorComponent={CastSeparator}
            />
          </View>
        )}

        {/* Info adicional */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Info</Text>
          <View style={styles.infoGrid}>
            <InfoItem label="Estado" value={movie.status} colors={colors} />
            <InfoItem label="Idioma" value={movie.originalLanguage.toUpperCase()} colors={colors} />
            <InfoItem label="Presupuesto" value={formatMoney(movie.budget)} colors={colors} />
            <InfoItem label="Recaudado" value={formatMoney(movie.revenue)} colors={colors} />
          </View>
        </View>

        {/* Productoras */}
        {movie.productionCompanies.length > 0 && (
          <View style={[styles.section, { paddingBottom: 40 }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Productoras</Text>
            <Text style={[styles.companies, { color: colors.textSecondary }]}>
              {movie.productionCompanies.map((c) => c.name).join(', ')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  colors: { textPrimary: string; textSecondary: string };
}

const CastSeparator = () => <View style={{ width: 14 }} />;

const InfoItem = ({ label, value, colors }: InfoItemProps) => (
  <View style={styles.infoItem}>
    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  errorText: {
    fontSize: 15,
  },

  backdropContainer: {
    width: SCREEN_WIDTH,
    height: BACKDROP_HEIGHT,
  },

  backdrop: {
    width: '100%',
    height: '100%',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: BACKDROP_HEIGHT * 0.5,
  },

  content: {
    marginTop: -40,
    paddingHorizontal: 16,
  },

  headerRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },

  poster: {
    width: 110,
    height: 165,
    borderRadius: 10,
  },

  headerInfo: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
  },

  tagline: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 4,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  rating: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '700',
  },

  metaText: {
    fontSize: 13,
  },

  metaDot: {
    fontSize: 13,
  },

  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  genreText: {
    fontSize: 12,
    fontWeight: '600',
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },

  overview: {
    fontSize: 14,
    lineHeight: 22,
  },

  castList: {
    paddingRight: 16,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },

  infoItem: {
    width: '45%',
    gap: 2,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  companies: {
    fontSize: 13,
    lineHeight: 20,
  },
});
