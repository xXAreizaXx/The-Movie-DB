import { useTheme } from '@core/theme';
import type { Movie } from '@features/movies/domain/entities';
import type { MainTabScreenProps } from '@infrastructure/navigation/types';
import { useCallback, useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeaturedBanner, MovieHorizontalList } from '../components';
import { usePopularMovies, useTopRatedMovies, useTrendingMovies } from '../hooks';

type Props = MainTabScreenProps<'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const trending = useTrendingMovies();
  const popular = usePopularMovies();
  const topRated = useTopRatedMovies();

  const trendingMovies = useMemo(() => {
    const all = trending.data?.pages.flatMap((p) => p.results) ?? [];
    const seen = new Set<number>();
    return all.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [trending.data]);

  const popularMovies = useMemo(() => {
    const all = popular.data?.pages.flatMap((p) => p.results) ?? [];
    const seen = new Set<number>();
    return all.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [popular.data]);

  const topRatedMovies = useMemo(() => {
    const all = topRated.data?.pages.flatMap((p) => p.results) ?? [];
    const seen = new Set<number>();
    return all.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [topRated.data]);

  const featuredMovie = trendingMovies[0] ?? null;

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      navigation.navigate('MovieDetail', { movieId: movie.id, title: movie.title });
    },
    [navigation],
  );

  const handleRefresh = useCallback(() => {
    trending.refetch();
    popular.refetch();
    topRated.refetch();
  }, [trending, popular, topRated]);

  const isRefreshing = trending.isRefetching || popular.isRefetching || topRated.isRefetching;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.accent}
        />
      }
    >
      <View style={{ paddingTop: insets.top }}>
        <Text style={[styles.header, { color: colors.textPrimary }]}>Flixora</Text>
      </View>

      {featuredMovie && <FeaturedBanner movie={featuredMovie} onPress={handleMoviePress} />}

      <MovieHorizontalList
        title="Tendencias"
        movies={trendingMovies.slice(1)}
        isLoading={trending.isLoading}
        onMoviePress={handleMoviePress}
        onEndReached={() => trending.hasNextPage && trending.fetchNextPage()}
        isFetchingNextPage={trending.isFetchingNextPage}
      />

      <MovieHorizontalList
        title="Populares"
        movies={popularMovies}
        isLoading={popular.isLoading}
        onMoviePress={handleMoviePress}
        onEndReached={() => popular.hasNextPage && popular.fetchNextPage()}
        isFetchingNextPage={popular.isFetchingNextPage}
      />

      <MovieHorizontalList
        title="Mejor Valoradas"
        movies={topRatedMovies}
        isLoading={topRated.isLoading}
        onMoviePress={handleMoviePress}
        onEndReached={() => topRated.hasNextPage && topRated.fetchNextPage()}
        isFetchingNextPage={topRated.isFetchingNextPage}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
