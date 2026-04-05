import type { RootStackParamList } from '@infrastructure/navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/**
 * Listens for notification taps and navigates to MovieDetail screen.
 * Must be rendered inside NavigationContainer.
 */
export const useNotificationNavigation = () => {
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.movieId && data?.title) {
        navigation.navigate('MovieDetail', {
          movieId: data.movieId as number,
          title: data.title as string,
        });
      }
    });

    return () => subscription.remove();
  }, [navigation]);
};
