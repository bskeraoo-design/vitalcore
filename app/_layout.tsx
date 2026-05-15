import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { DemoProvider } from '@/lib/DemoContext';

export default function RootLayout() {
  return (
    <DemoProvider>
      <ThemeProvider value={DarkTheme}>
        <Stack initialRouteName="login">
          <Stack.Screen name="login"  options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal"  options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </DemoProvider>
  );
}
