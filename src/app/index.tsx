import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories, Category, Lesson, searchLessons } from '../data/catalog';

const savedKey = '@ecomar/saved-lessons/v1';
export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('Todos');
  const [saved, setSaved] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [detail, setDetail] = useState<Lesson | null>(null);
  const insets = useSafeAreaInsets();


  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(savedKey).then(value => {
      const result: unknown = value ? JSON.parse(value) : [];
      if (mounted && Array.isArray(result)) setSaved(result.filter((id): id is string => typeof id === 'string'));
    }).catch(() => { if (mounted) Alert.alert('Guardados no disponibles', 'No pudimos recuperar tus favoritos. Puedes seguir explorando el contenido.'); }).finally(() => { if (mounted) setLoaded(true); });
    return () => { mounted = false; };
  }, []);
  async function toggleSave(id: string) {
    if (!loaded || saving) return;
    const next = saved.includes(id) ? saved.filter(v => v !== id) : [...saved, id];
    setSaving(true);
    try { await AsyncStorage.setItem(savedKey, JSON.stringify(next)); setSaved(next); }
    catch { Alert.alert('No se pudo guardar', 'Intenta nuevamente.'); }
    finally { setSaving(false); }
  }
  const results = searchLessons(query, category, onlySaved ? saved : undefined);
  function openAR() { setDetail(null); router.push('/ar'); }
  return <View style={[s.page, { paddingTop: insets.top }]}>
    <StatusBar style="dark" />
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <View style={s.header}>
        <View style={s.avatar}><Text style={s.avatarText}>E</Text></View>
        <View style={{ flex: 1 }}><Text style={s.welcome}>TU AULA MARINA</Text><Text style={s.brand}>EcoMar</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel="Ver guía de bienvenida" onPress={() => router.push('/welcome')} style={s.help}><Text style={s.helpText}>?</Text></Pressable>
      </View>
      <Text style={s.heading}>Descubre la vida bajo el mar</Text>
      <View style={s.search}><Text style={s.searchIcon}>⌕</Text><TextInput accessibilityLabel="Buscar contenido educativo" placeholder="Busca ecosistemas, organismos…" placeholderTextColor="#7E919A" value={query} onChangeText={setQuery} style={s.input} returnKeyType="search" />{query.length > 0 && <Pressable accessibilityRole="button" onPress={() => setQuery('')} accessibilityLabel="Limpiar búsqueda" style={{ padding: 8 }}><Text style={s.clear}>×</Text></Pressable>}</View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>{categories.map(c => <Pressable key={c} accessibilityRole="button" accessibilityState={{ selected: category === c }} onPress={() => setCategory(c)} style={[s.filter, category === c && s.filterActive]}><Text style={[s.filterText, category === c && s.filterTextActive]}>{c}</Text></Pressable>)}</ScrollView>
      {!onlySaved && !query && category === 'Todos' && <View style={s.banner}>
        <View style={s.bannerCopy}><Text style={s.bannerTag}>APRENDE EN TU ENTORNO</Text><Text style={s.bannerTitle}>Un arrecife en tus manos</Text><Text style={s.bannerBody}>Explora sus organismos y conexiones en realidad aumentada.</Text><Pressable onPress={openAR} style={s.bannerButton} accessibilityRole="button"><Text style={s.bannerButtonText}>Explorar en RA →</Text></Pressable></View>
        <Image source={require('../../assets/onboarding/reef.png')} style={s.bannerImage} resizeMode="cover" accessibilityLabel="Arrecife de coral ilustrado" />
      </View>}
      <View style={s.section}><Text style={s.sectionTitle}>{onlySaved ? 'Mi colección' : category === 'Todos' ? 'Explora y aprende' : category}</Text><Text style={s.count}>{results.length} contenidos</Text></View>
      <View style={s.grid}>{results.map(l => <View key={l.id} style={s.card}>
        <View><Pressable onPress={() => setDetail(l)} accessibilityRole="button" accessibilityLabel={`Abrir ${l.title}`}><Image source={l.image} style={s.cardImage} resizeMode="cover" /></Pressable>
          <Pressable disabled={!loaded || saving} onPress={() => toggleSave(l.id)} accessibilityRole="button" accessibilityLabel={`${saved.includes(l.id) ? 'Quitar de' : 'Añadir a'} favoritos: ${l.title}`} accessibilityState={{ selected: saved.includes(l.id) }} style={s.save}><Text style={[s.saveIcon, saved.includes(l.id) && { color: '#DF6D72' }]}>{saved.includes(l.id) ? '♥' : '♡'}</Text></Pressable>
        </View>
        <View style={s.cardBody}><Text style={s.tag}>{l.tag}</Text><Text style={s.cardTitle}>{l.title}</Text><Text style={s.category}>{l.category}</Text><Pressable onPress={() => setDetail(l)} accessibilityRole="button" style={s.cardButton}><Text style={s.cardButtonText}>Conocer más →</Text></Pressable></View>
      </View>)}</View>
      {results.length === 0 && <View style={s.empty}><Text style={s.sectionTitle}>{onlySaved ? 'Tu colección está por comenzar' : 'No encontramos contenido'}</Text><Text style={s.emptyText}>{onlySaved ? 'Toca el corazón de una tarjeta para guardarla aquí.' : 'Prueba otra palabra o cambia el filtro.'}</Text><Pressable style={s.bannerButton} onPress={() => { setQuery(''); setCategory('Todos'); setOnlySaved(false); }}><Text style={s.bannerButtonText}>Explorar todo</Text></Pressable></View>}
      <Text style={s.note}>Material educativo para estudiantes de Biología. Modelos esquemáticos; contenido pendiente de validación docente.</Text>
    </ScrollView>
    <View style={[s.nav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Pressable accessibilityRole="button" accessibilityState={{ selected: !onlySaved }} onPress={() => { setOnlySaved(false); setQuery(''); setCategory('Todos'); }} style={s.navItem}><Text style={[s.navIcon, !onlySaved && s.navActive]}>⌂</Text><Text style={[s.navText, !onlySaved && s.navActive]}>Explorar</Text></Pressable>
      <Pressable accessibilityRole="button" accessibilityState={{ selected: onlySaved }} onPress={() => { setOnlySaved(true); setQuery(''); setCategory('Todos'); }} style={s.navItem}><Text style={[s.navIcon, onlySaved && s.navActive]}>♡</Text><Text style={[s.navText, onlySaved && s.navActive]}>Guardados</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={openAR} style={s.navItem}><Text style={s.navIcon}>◎</Text><Text style={s.navText}>Realidad AR</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={() => router.push('/welcome')} style={s.navItem}><Text style={s.navIcon}>?</Text><Text style={s.navText}>Guía</Text></Pressable>
    </View>
    <Modal visible={detail !== null} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetail(null)}>
      <View style={[s.modal, { paddingTop: Math.max(insets.top, 20), paddingBottom: insets.bottom }]}>
        <View style={s.modalTop}><Text style={s.brand}>Aprende con EcoMar</Text><Pressable accessibilityRole="button" accessibilityLabel="Cerrar contenido" onPress={() => setDetail(null)} style={s.help}><Text style={s.helpText}>×</Text></Pressable></View>
        {detail && <ScrollView contentContainerStyle={s.detail}><Image source={detail.image} style={s.detailImage} resizeMode="contain" /><Text style={s.tag}>{detail.category.toUpperCase()}</Text><Text style={s.heading}>{detail.title}</Text><Text style={s.detailText}>{detail.description}</Text><Pressable accessibilityRole="button" onPress={openAR} style={s.primary}><Text style={s.primaryText}>Explorar en el arrecife RA →</Text></Pressable><Text style={s.note}>Busca una superficie iluminada y permite la cámara al comenzar.</Text></ScrollView>}
      </View>
    </Modal>
  </View>;
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#F2F5FA' }, content: { width: '100%', maxWidth: 680, alignSelf: 'center', padding: 24, gap: 20, paddingBottom: 28 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 }, avatar: { width: 46, height: 46, backgroundColor: '#D9EEEA', borderRadius: 23, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#157E7D', fontSize: 23, fontWeight: '800' }, welcome: { color: '#778892', fontSize: 10, letterSpacing: 1.2 }, brand: { color: '#132E49', fontSize: 23, fontWeight: '800' }, help: { backgroundColor: '#E1E8F5', width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, helpText: { color: '#3457A0', fontSize: 22, fontWeight: '700' },
  heading: { color: '#132E49', fontSize: 25, fontWeight: '800', lineHeight: 32 }, search: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, minHeight: 50 }, searchIcon: { color: '#6A849B', fontSize: 26, marginRight: 10 }, input: { flex: 1, color: '#132E49', fontSize: 14, paddingVertical: 14 }, clear: { color: '#6A849B', fontSize: 22 },
  filters: { gap: 8 }, filter: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 9, borderWidth: 1, borderColor: '#D5DFEC' }, filterActive: { backgroundColor: '#3059AA', borderColor: '#3059AA' }, filterText: { color: '#536A83', fontSize: 12 }, filterTextActive: { color: '#FFFFFF' },
  banner: { borderRadius: 22, backgroundColor: '#1E427C', flexDirection: 'row', overflow: 'hidden', minHeight: 200 }, bannerCopy: { width: '60%', padding: 20, gap: 10 }, bannerTag: { fontSize: 9, letterSpacing: 1, color: '#A5DDD8', fontWeight: '700' }, bannerTitle: { color: '#FFFFFF', fontSize: 23, lineHeight: 28, fontWeight: '800' }, bannerBody: { color: '#DCE8F6', fontSize: 12, lineHeight: 18 }, bannerImage: { position: 'absolute', right: 0, top: 0, width: '40%', height: '100%' }, bannerButton: { backgroundColor: '#BDE9D9', borderRadius: 9, padding: 12, alignSelf: 'flex-start' }, bannerButtonText: { color: '#123F4C', fontWeight: '700', fontSize: 12 },
  section: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center' }, sectionTitle: { color: '#132E49', fontSize: 19, fontWeight: '700', flexShrink: 1 }, count: { color: '#7C8C9D', fontSize: 11 }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 }, card: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#E4EAF2' }, cardImage: { width: '100%', height: 150 }, save: { position: 'absolute', right: 8, top: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }, saveIcon: { color: '#6E849B', fontSize: 22 }, cardBody: { padding: 12, gap: 8, flex: 1 }, tag: { color: '#218B80', fontSize: 9, letterSpacing: .5, fontWeight: '700' }, cardTitle: { color: '#132E49', fontSize: 15, fontWeight: '700', lineHeight: 20 }, category: { color: '#8391A0', fontSize: 11 }, cardButton: { marginTop: 'auto', backgroundColor: '#3059AA', borderRadius: 7, paddingVertical: 10, alignItems: 'center' }, cardButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  nav: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingTop: 10, borderTopWidth: 1, borderColor: '#E4EAF2' }, navItem: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 3 }, navIcon: { color: '#9AAAC7', fontSize: 25 }, navText: { color: '#8B9CB6', fontSize: 10 }, navActive: { color: '#3059AA' }, note: { color: '#7B8C9B', fontSize: 12, lineHeight: 19 }, empty: { padding: 20, backgroundColor: '#FFFFFF', borderRadius: 14, gap: 12 }, emptyText: { color: '#647A8E', lineHeight: 22 },
  modal: { flex: 1, backgroundColor: '#F2F5FA' }, modalTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 }, detail: { padding: 24, gap: 18 }, detailImage: { width: '100%', height: 240, backgroundColor: '#FFFFFF', borderRadius: 18 }, detailText: { color: '#4B6479', fontSize: 17, lineHeight: 27 }, primary: { backgroundColor: '#3059AA', padding: 18, borderRadius: 12 }, primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', textAlign: 'center' },
});
