import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Onboarding from '../components/Onboarding';
export default function Welcome() { return <><StatusBar style="dark" /><Onboarding onComplete={async () => { router.replace('/'); }} /></>; }
