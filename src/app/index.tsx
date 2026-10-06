import { Link } from 'expo-router';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { organisms, interactions } from '../data/reef';
export default function Home() {
  return <ScrollView contentContainerStyle={s.page}>
    <Text style={s.tag}>BIOLOGÍA · REALIDAD AUMENTADA</Text><Text style={s.title}>La vida del arrecife, conectada.</Text>
    <Text style={s.body}>Explora una representación tridimensional y descubre las relaciones entre sus organismos.</Text>
    <Link href="/ar" style={s.button}>Explorar en mi entorno →</Link>
    <Link href="/welcome" style={s.body}>Ver guía de bienvenida →</Link><Text style={s.heading}>Antes de comenzar</Text><Text style={s.body}>Busca una mesa o suelo con buena iluminación. Mueve lentamente el teléfono y toca una superficie detectada para colocar el arrecife.</Text>
    <Text style={s.heading}>Organismos del arrecife</Text>
    {organisms.map(o => <View key={o.id} style={s.card}><Text style={[s.heading,{color:o.color}]}>{o.name}</Text><Text style={s.body}>{o.description}</Text></View>)}
    <Text style={s.heading}>Interacciones ecológicas</Text>{interactions.map(i => <View key={i.name} style={s.card}><Text style={s.heading}>{i.name}</Text><Text style={s.body}>{i.description}</Text></View>)}
    <Text style={s.note}>Prototipo educativo: formas, tamaños y posiciones son esquemáticos. El contenido requiere validación docente.</Text>
  </ScrollView>;
}
const s=StyleSheet.create({page:{padding:24,gap:18,paddingBottom:48},tag:{color:'#71DDCD',fontSize:12,letterSpacing:1},title:{color:'white',fontSize:34,fontWeight:'800'},heading:{color:'white',fontSize:20,fontWeight:'700'},body:{color:'#C3DEE5',fontSize:16,lineHeight:24},button:{backgroundColor:'#71DDCD',color:'#062C3B',padding:18,borderRadius:14,fontSize:18,fontWeight:'700'},card:{backgroundColor:'#104657',padding:18,borderRadius:16,gap:8},note:{color:'#92B9C5',lineHeight:21}});
