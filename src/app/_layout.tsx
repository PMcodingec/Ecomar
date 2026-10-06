import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
export default function Layout() {
  return <><StatusBar style="light" /><Stack screenOptions={{ headerStyle: { backgroundColor: '#062C3B' }, headerTintColor: '#fff', contentStyle: { backgroundColor: '#062C3B' } }}><Stack.Screen name="index" options={{ title: 'EcoMar' }} /><Stack.Screen name="ar" options={{ title: 'Explorar arrecife' }} /></Stack></>;
}
