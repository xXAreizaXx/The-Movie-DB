import './global.css';

import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { QueryProvider } from './src/infrastructure/providers';

export default function App() {
  return (
    <QueryProvider>
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-text-primary text-xl font-bold">Flixora</Text>
        <StatusBar style="light" />
      </View>
    </QueryProvider>
  );
}
