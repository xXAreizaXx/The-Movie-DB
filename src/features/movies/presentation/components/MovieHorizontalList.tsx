import { useTheme } from '@core/theme';
import type { Movie } from '@features/movies/domain/entities';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { MovieCard } from './MovieCard';

interface MovieHorizontalListProps {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  onMoviePress: (movie: Movie) => void;
  onEndReached?: () => void;
  isFetchingNextPage?: boolean;
}

export const MovieHorizontalList = ({
  title,
  movies,
  isLoading,
  onMoviePress,
  onEndReached,
  isFetchingNextPage,
}: MovieHorizontalListProps) => {
  const { colors } = useTheme();

  if (isLoading && movies.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={colors.accent} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard movie={item} onPress={onMoviePress} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 14,
  },
  loaderContainer: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoader: {
    width: 40,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
