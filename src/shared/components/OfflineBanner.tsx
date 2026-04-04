import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const TOP_INSET = Platform.OS === 'ios' ? 54 : 36;

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="cloud-offline-outline" size={16} color="#fff" />
        <Text style={styles.text}>Sin conexión · Mostrando datos guardados</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#EF4444',
    paddingTop: TOP_INSET,
    paddingBottom: 8,
    zIndex: 999,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
