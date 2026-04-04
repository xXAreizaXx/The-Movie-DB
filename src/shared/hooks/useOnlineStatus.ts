import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useSyncExternalStore } from 'react';

// Keep TanStack Query's onlineManager in sync with NetInfo
export const setupOnlineManager = () => {
  onlineManager.setEventListener((setOnline) => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
    return unsubscribe;
  });
};

// Lightweight hook to read current online status
let isOnline = true;
const listeners = new Set<() => void>();

NetInfo.addEventListener((state) => {
  const next = !!state.isConnected;
  if (next !== isOnline) {
    isOnline = next;
    listeners.forEach((l) => l());
  }
});

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const getSnapshot = () => isOnline;

export const useOnlineStatus = (): boolean => {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
