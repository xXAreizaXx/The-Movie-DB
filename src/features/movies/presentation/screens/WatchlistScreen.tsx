import { useTheme } from '@core/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Movie } from '@features/movies/domain/entities';
import type { MainTabScreenProps } from '@infrastructure/navigation/types';
import { useCallback, useRef } from 'react';
import { Alert, Animated, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MovieListItem } from '../components';
import { useWatchlistStore } from '../store';

type Props = MainTabScreenProps<'Watchlist'>;

const CardSpacer = () => <View style={styles.cardSpacer} />;

const SwipeableRow = ({
  movie,
  onPress,
  onRemove,
  surfaceColor,
}: {
  movie: Movie;
  onPress: (movie: Movie) => void;
  onRemove: (movieId: number) => void;
  surfaceColor: string;
}) => {
  const swipeRef = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.4],
      extrapolate: 'clamp',
    });

    return (
      <Pressable
        onPress={() => {
          swipeRef.current?.close();
          onRemove(movie.id);
        }}
        style={styles.deleteAction}
      >
        <Animated.View style={[styles.deleteInner, { transform: [{ scale }] }]}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteText}>Quitar</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.swipeWrapper, { backgroundColor: surfaceColor }]}>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
      >
        <MovieListItem movie={movie} onPress={onPress} compact />
      </Swipeable>
    </View>
  );
};

export const WatchlistScreen = ({ navigation }: Props) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const movies = useWatchlistStore((s) => s.movies);
  const removeFromWatchlist = useWatchlistStore((s) => s.remove);
  const clearAll = useWatchlistStore((s) => s.clear);

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      navigation.navigate('MovieDetail', { movieId: movie.id, title: movie.title });
    },
    [navigation],
  );

  const handleClearAll = useCallback(() => {
    Alert.alert('Vaciar Mi Lista', `¿Quitar las ${movies.length} peliculas de tu lista?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Vaciar',
        style: 'destructive',
        onPress: clearAll,
      },
    ]);
  }, [movies.length, clearAll]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mi Lista</Text>
        {movies.length > 0 && (
          <Pressable onPress={handleClearAll} hitSlop={8}>
            <Text style={[styles.clearBtn, { color: colors.accent }]}>Vaciar</Text>
          </Pressable>
        )}
      </View>

      {movies.length > 0 && (
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {movies.length} pelicula{movies.length === 1 ? '' : 's'} · Desliza para quitar
        </Text>
      )}

      {/* Empty state */}
      {movies.length === 0 && (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconWrap, { backgroundColor: colors.surface }]}>
            <Ionicons name="bookmark-outline" size={44} color={colors.textSecondary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
            Tu lista esta vacia
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Agrega peliculas desde el detalle para verlas aqui
          </Text>
        </View>
      )}

      {/* List */}
      {movies.length > 0 && (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <SwipeableRow
              movie={item}
              onPress={handleMoviePress}
              onRemove={removeFromWatchlist}
              surfaceColor={colors.surface}
            />
          )}
          ItemSeparatorComponent={CardSpacer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingTop: 4 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },

  clearBtn: {
    fontSize: 14,
    fontWeight: '600',
  },

  count: {
    fontSize: 13,
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  cardSpacer: {
    height: 12,
  },

  swipeWrapper: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },

  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },

  deleteInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 40,
  },

  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
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
});
