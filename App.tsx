import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const topics = [
  { title: 'Ecosistemas marinos', description: 'Explora arrecifes, manglares y praderas marinas.' },
  { title: 'Interacciones ecológicas', description: 'Estudia depredación, competencia y mutualismo.' },
  { title: 'Exploración en realidad aumentada', description: 'Próximamente: observa organismos y sus relaciones en tu entorno.' },
];

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>BIOLOGÍA · APRENDIZAJE</Text>
        <Text style={styles.brand}>EcoMar</Text>
        <Text style={styles.subtitle}>Descubre cómo se conecta la vida bajo el mar.</Text>
        <View style={styles.intro}>
          <Text style={styles.heading}>Un océano de conexiones</Text>
          <Text style={styles.body}>Una aplicación educativa para estudiantes de Biología, enfocada en ecosistemas marinos y sus interacciones ecológicas.</Text>
        </View>
        <Text style={styles.section}>Tu ruta de aprendizaje</Text>
        {topics.map((topic, index) => (
          <View key={topic.title} style={styles.card}>
            <Text style={styles.number}>0{index + 1}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.heading}>{topic.title}</Text>
              <Text style={styles.body}>{topic.description}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.footer}>Proyecto base · Los módulos educativos y la experiencia RA están en desarrollo.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#062C3B' },
  content: { paddingHorizontal: 24, paddingTop: 72, paddingBottom: 40, gap: 20 },
  label: { color: '#71DDCD', fontSize: 12, letterSpacing: 2, fontWeight: '700' },
  brand: { color: '#FFFFFF', fontSize: 48, fontWeight: '800' },
  subtitle: { color: '#C3DEE5', fontSize: 22, lineHeight: 30 },
  intro: { backgroundColor: '#104657', padding: 22, borderRadius: 20, gap: 10 },
  section: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 12 },
  card: { flexDirection: 'row', backgroundColor: '#0C3949', borderRadius: 16, padding: 18, gap: 16 },
  number: { color: '#71DDCD', fontSize: 22, fontWeight: '800' },
  cardContent: { flex: 1, gap: 8 },
  heading: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  body: { color: '#C3DEE5', fontSize: 15, lineHeight: 23 },
  footer: { color: '#92B9C5', fontSize: 13, lineHeight: 20 },
});
