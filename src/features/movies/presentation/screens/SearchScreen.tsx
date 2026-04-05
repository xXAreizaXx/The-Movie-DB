import { useTheme } from '@core/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Movie, MovieDetail } from '@features/movies/domain/entities';
import type { MainTabScreenProps } from '@infrastructure/navigation/types';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MovieCard, MovieListItem } from '../components';
import { useFilterMoviesByLetter, useSearchMovies, useTrendingMovies } from '../hooks';

type Props = MainTabScreenProps<'Search'>;

const DEBOUNCE_MS = 400;
const NUM_COLUMNS = 3;
const HORIZONTAL_PADDING = 16;
const GRID_GAP = 12;
const CARD_WIDTH =
  (Dimensions.get('window').width - HORIZONTAL_PADDING * 2 - GRID_GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;

const CardSpacer = () => <View style={styles.cardSpacer} />;

export const SearchScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  const [filterMode, setFilterMode] = useState(false);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useSearchMovies(
    filterMode ? '' : debouncedQuery,
  );

  const trending = useTrendingMovies();

  const filterLetter = filterMode ? debouncedQuery.trim().charAt(0) : '';
  const { data: filteredMovies, isLoading: isFilterLoading } =
    useFilterMoviesByLetter(filterLetter);

  const movies = useMemo(() => data?.pages.flatMap((p) => p.results) ?? [], [data]);

  const trendingMovies = useMemo(() => {
    const all = trending.data?.pages.flatMap((p) => p.results) ?? [];
    const seen = new Set<number>();
    return all.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [trending.data]);

  const totalResults = data?.pages[0]?.totalResults ?? 0;

  const handleMoviePress = useCallback(
    (movie: Movie | MovieDetail) => {
      navigation.navigate('MovieDetail', { movieId: movie.id, title: movie.title });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const isSearching = debouncedQuery.trim().length > 0 && !filterMode;
  const isFiltering = filterMode && debouncedQuery.trim().length > 0;
  const showEmpty = isSearching && !isLoading && movies.length === 0;
  const showResults = isSearching && movies.length > 0;
  const showDiscovery = !isSearching && !isFiltering;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
    >
      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder={filterMode ? 'Escribe una letra...' : 'Buscar peliculas...'}
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            maxLength={filterMode ? 1 : undefined}
          />
          {query.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
              onPress={() => setQuery('')}
            />
          )}
        </View>
        <View style={styles.modeRow}>
          <Pressable
            onPress={() => {
              setFilterMode(false);
              setQuery('');
            }}
            style={[
              styles.modePill,
              {
                backgroundColor: !filterMode ? colors.accent : colors.surface,
                borderColor: !filterMode ? colors.accent : colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={14} color={!filterMode ? '#fff' : colors.textSecondary} />
            <Text
              style={[styles.modePillText, { color: !filterMode ? '#fff' : colors.textSecondary }]}
            >
              Buscar
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilterMode(true);
              setQuery('');
            }}
            style={[
              styles.modePill,
              {
                backgroundColor: filterMode ? colors.accent : colors.surface,
                borderColor: filterMode ? colors.accent : colors.border,
              },
            ]}
          >
            <Ionicons name="funnel" size={14} color={filterMode ? '#fff' : colors.textSecondary} />
            <Text
              style={[styles.modePillText, { color: filterMode ? '#fff' : colors.textSecondary }]}
            >
              Filtro por letra
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Discovery: trending grid when not searching */}
      {showDiscovery && (
        <FlatList
          data={trendingMovies}
          keyExtractor={(item) => `trending-${item.id}`}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH }}>
              <MovieCard movie={item} onPress={handleMoviePress} />
            </View>
          )}
          contentContainerStyle={[styles.gridContent, { paddingBottom: insets.bottom + 16 }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Descubre</Text>
          }
          ListEmptyComponent={
            trending.isLoading ? (
              <View style={styles.loaderCenter}>
                <ActivityIndicator size="large" color={colors.accent} />
              </View>
            ) : null
          }
        />
      )}

      {/* Balanced filter results */}
      {isFiltering && isFilterLoading && (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Analizando reparto y géneros...
          </Text>
        </View>
      )}

      {isFiltering && !isFilterLoading && filteredMovies && filteredMovies.length > 0 && (
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => `filter-${item.id}`}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleMoviePress(item)}
              style={({ pressed }) => [
                styles.filterCard,
                { backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={[styles.filterTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.filterMeta}>
                <Ionicons name="pricetags-outline" size={12} color={colors.textSecondary} />
                <Text style={[styles.filterMetaText, { color: colors.textSecondary }]}>
                  {item.genres.map((g) => g.name).join(', ')}
                </Text>
              </View>
              <View style={styles.filterMeta}>
                <Ionicons name="people-outline" size={12} color={colors.textSecondary} />
                <Text style={[styles.filterMetaText, { color: colors.textSecondary }]}>
                  {item.cast.filter((c) => c.gender === 1).length}F ·{' '}
                  {item.cast.filter((c) => c.gender === 2).length}M
                </Text>
              </View>
            </Pressable>
          )}
          ItemSeparatorComponent={CardSpacer}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.resultsContent, { paddingBottom: insets.bottom + 16 }]}
          ListHeaderComponent={
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              {filteredMovies.length} pelicula{filteredMovies.length === 1 ? '' : 's'} con reparto
              balanceado para &quot;{filterLetter.toUpperCase()}&quot;
            </Text>
          }
        />
      )}

      {isFiltering &&
        !isFilterLoading &&
        (!filteredMovies || filteredMovies.length === 0) &&
        debouncedQuery.trim().length > 0 && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconWrap, { backgroundColor: colors.surface }]}>
              <Ionicons name="funnel-outline" size={40} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Sin resultados</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              No hay peliculas con &quot;{debouncedQuery.toUpperCase()}&quot; que tengan ≥3 géneros
              y reparto balanceado (≥3F, ≥3M)
            </Text>
          </View>
        )}

      {/* Loading search */}
      {isSearching && isLoading && (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Buscando...</Text>
        </View>
      )}

      {/* No results */}
      {showEmpty && (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconWrap, { backgroundColor: colors.surface }]}>
            <Ionicons name="film-outline" size={40} color={colors.textSecondary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Sin resultados</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            No encontramos peliculas para &quot;{debouncedQuery}&quot;
          </Text>
        </View>
      )}

      {/* Search results */}
      {showResults && (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MovieListItem movie={item} onPress={handleMoviePress} />}
          ItemSeparatorComponent={CardSpacer}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.resultsContent, { paddingBottom: insets.bottom + 16 }]}
          ListHeaderComponent={
            <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
              {totalResults.toLocaleString()} resultado{totalResults === 1 ? '' : 's'}
            </Text>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.accent} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },

  gridContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },

  gridRow: {
    gap: GRID_GAP,
    marginBottom: GRID_GAP,
  },

  resultsContent: {
    paddingTop: 4,
  },

  resultsCount: {
    fontSize: 13,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  cardSpacer: {
    height: 12,
  },

  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 40,
  },

  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  modeRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },

  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  modePillText: {
    fontSize: 13,
    fontWeight: '600',
  },

  filterCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  filterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  filterMetaText: {
    fontSize: 12,
    flex: 1,
  },
});
