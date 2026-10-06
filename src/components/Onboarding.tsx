import { useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCameraPermissions } from 'expo-camera';
const slides = [
  { image: require('../../assets/onboarding/reef.png'), eyebrow: 'BIENVENIDO A ECOMAR', title: 'Un océano por descubrir', body: 'Explora ecosistemas marinos en realidad aumentada y comprende cómo se relacionan sus organismos. EcoMar acompaña el aprendizaje de estudiantes de Biología.' },
  { image: require('../../assets/onboarding/connections.png'), eyebrow: 'APRENDE EXPLORANDO', title: 'Todo está conectado', body: 'Observa el arrecife desde distintos ángulos. Toca los organismos y descubre ejemplos de depredación, competencia y mutualismo.' },
  { image: require('../../assets/onboarding/camera.png'), eyebrow: 'PREPARA TU ENTORNO', title: 'Dale vida con tu cámara', body: 'Permite el acceso a la cámara. Busca una mesa o suelo bien iluminado, mueve lentamente el teléfono y toca una superficie detectada para colocar el arrecife.' },
];
export default function Onboarding({ onComplete }: { onComplete: () => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const slide = slides[step];
  async function finish() {
    setBusy(true);
    try { await onComplete(); }
    catch { Alert.alert('No pudimos guardar tu bienvenida', 'Intenta nuevamente para continuar.'); }
    finally { setBusy(false); }
  }
  async function camera() {
    try {
      if (permission && !permission.canAskAgain && !permission.granted) await Linking.openSettings();
      else await requestPermission();
    } catch { Alert.alert('No pudimos abrir el permiso', 'Puedes permitir la cámara desde los ajustes del teléfono.'); }
  }
  return <View style={[s.page, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
    <View style={s.top}><Text style={s.brand}>EcoMar</Text><Text style={s.counter}>{step + 1} / 3</Text></View>
    <ScrollView contentContainerStyle={s.content} bounces={false}>
      <Image source={slide.image} accessibilityLabel={step === 2 ? 'Teléfono explorando un arrecife sobre una mesa' : 'Ilustración de un ecosistema marino'} style={{ width: Math.min(width - 48, 420), height: Math.min(width - 48, height * .36, 360), alignSelf: 'center' }} resizeMode="contain" />
      <Text style={s.eyebrow}>{slide.eyebrow}</Text><Text accessibilityRole="header" style={s.title}>{slide.title}</Text><Text style={s.body}>{slide.body}</Text>
      {step === 2 && <>
        <Pressable accessibilityRole="button" disabled={permission?.granted} onPress={camera} style={[s.camera, permission?.granted && s.granted]}><Text style={s.cameraText}>{permission?.granted ? '✓ Cámara habilitada' : permission && !permission.canAskAgain ? 'Abrir ajustes de cámara' : 'Permitir acceso a la cámara'}</Text></Pressable>
        <Text style={s.note}>También puedes continuar y permitirla al abrir la experiencia RA. Necesitas la aplicación instalada y un dispositivo compatible.</Text>
      </>}
    </ScrollView>
    <View style={s.bottom}>
      <View style={s.dots} accessibilityLabel={`Paso ${step + 1} de 3`}>{slides.map((_, i) => <View key={i} style={[s.dot, step === i && s.current]} />)}</View>
      <Pressable accessibilityRole="button" disabled={busy} style={[s.next, busy && { opacity: .6 }]} onPress={() => step < 2 ? setStep(v => v + 1) : finish()}><Text style={s.nextText}>{busy ? 'Guardando…' : step < 2 ? 'Continuar →' : 'Comenzar a explorar →'}</Text></Pressable>
      {step > 0 && <Pressable accessibilityRole="button" disabled={busy} onPress={() => setStep(v => v - 1)} style={s.back}><Text style={s.backText}>Volver</Text></Pressable>}
    </View>
  </View>;
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F6F8F3' }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24 },
  brand: { color: '#063F4C', fontSize: 25, fontWeight: '800' }, counter: { color: '#5C7D82', fontSize: 14 },
  content: { paddingHorizontal: 24, paddingBottom: 12, gap: 14 }, eyebrow: { textAlign: 'center', color: '#237D7C', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  title: { textAlign: 'center', color: '#063F4C', fontSize: 32, lineHeight: 38, fontWeight: '800' }, body: { textAlign: 'center', color: '#41616A', fontSize: 16, lineHeight: 25 },
  camera: { padding: 15, borderWidth: 1, borderColor: '#237D7C', borderRadius: 14 }, granted: { backgroundColor: '#E0EFE5', borderColor: '#E0EFE5' }, cameraText: { color: '#063F4C', textAlign: 'center', fontWeight: '700', fontSize: 15 },
  note: { color: '#5C7D82', fontSize: 13, lineHeight: 20 }, bottom: { paddingHorizontal: 24, paddingBottom: 16, paddingTop: 12, gap: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C9DCDB' }, current: { width: 26, backgroundColor: '#237D7C' },
  next: { backgroundColor: '#063F4C', padding: 18, borderRadius: 16 }, nextText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center', fontWeight: '700' }, back: { padding: 8 }, backText: { color: '#41616A', textAlign: 'center', fontSize: 14 },
});
