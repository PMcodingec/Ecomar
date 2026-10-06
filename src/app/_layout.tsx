import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding from '../components/Onboarding';
export const welcomeKey = '@ecomar/onboarding/v1';
function Entry() {
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(welcomeKey).then(value => { if (mounted) setComplete(value === 'complete'); }).catch(() => {}).finally(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);
  if (!ready) return <View style={{ flex: 1, backgroundColor: '#F6F8F3', justifyContent: 'center' }}><StatusBar style="dark" /><ActivityIndicator color="#237D7C" accessibilityLabel="Preparando EcoMar" /></View>;
  if (!complete) return <><StatusBar style="dark" /><Onboarding onComplete={async () => { await AsyncStorage.setItem(welcomeKey, 'complete'); setComplete(true); }} /></>;
  return <><StatusBar style="light" /><Stack screenOptions={{ headerStyle: { backgroundColor: '#062C3B' }, headerTintColor: '#fff', contentStyle: { backgroundColor: '#062C3B' } }}><Stack.Screen name="index" options={{ title: 'EcoMar', headerShown: false }} /><Stack.Screen name="ar" options={{ title: 'Explorar arrecife' }} /><Stack.Screen name="welcome" options={{ headerShown: false }} /></Stack></>;
}
export default function Layout() { return <SafeAreaProvider><Entry /></SafeAreaProvider>; }
