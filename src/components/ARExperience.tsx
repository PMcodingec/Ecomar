import { useEffect, useState } from 'react';
import { Pressable, View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { ViroARSceneNavigator, ViroTrackingStateConstants, isARSupportedOnDevice } from '@reactvision/react-viro';
import ReefScene from './ReefScene';
import { organisms, interactions, OrganismId } from '../data/reef';
export default function ARExperience() {
  const [permission, requestPermission]=useCameraPermissions();
  const [supported,setSupported]=useState<boolean|null>(null);
  const [placed,setPlaced]=useState(false);
  const [tracking,setTracking]=useState(false);
  const [session,setSession]=useState(0);
  const [scale,setScale]=useState(1);
  const [selected,setSelected]=useState<OrganismId|null>(null);
  const [interaction,setInteraction]=useState<number|null>(null);
  useEffect(()=>{let mounted=true; isARSupportedOnDevice().then(result=>{if(mounted)setSupported(result.isARSupported);}).catch(()=>{if(mounted)setSupported(false);}); return ()=>{mounted=false;};},[]);
  if(supported===null || !permission) return <View style={s.message}><Text style={s.text}>Comprobando compatibilidad con realidad aumentada…</Text></View>;
  if(!supported) return <View style={s.message}><Text style={s.title}>RA no disponible</Text><Text style={s.text}>Este dispositivo no admite esta experiencia. Puedes consultar los organismos y sus relaciones desde el inicio.</Text></View>;
  if(!permission?.granted) return <View style={s.message}><Text style={s.title}>Explora con tu cámara</Text><Text style={s.text}>EcoMar necesita la cámara para detectar superficies y colocar el arrecife.</Text><Pressable style={s.button} onPress={()=>permission?.canAskAgain?requestPermission():Linking.openSettings()}><Text>{permission?.canAskAgain?'Permitir cámara':'Abrir ajustes'}</Text></Pressable></View>;
  const active=interaction===null?[]:interactions[interaction].ids;
  const organism=organisms.find(o=>o.id===selected);
  return <View style={s.container}>
    <ViroARSceneNavigator key={session} style={s.scene} initialScene={{scene:ReefScene}} viroAppProps={{scale,active,onSelect:setSelected,onPlaced:()=>setPlaced(true),onTracking:(state:number)=>setTracking(state===ViroTrackingStateConstants.TRACKING_NORMAL)}}/>
    <View style={s.status} pointerEvents="none"><Text style={s.text}>{!tracking?'Mueve lentamente el teléfono para reconocer el entorno.':!placed?'Toca una superficie horizontal para colocar el arrecife.':'Acércate y toca un organismo para conocerlo.'}</Text></View>
    <ScrollView style={s.panel} contentContainerStyle={{gap:10,padding:16}}>
      <Text style={s.title}>Arrecife esquemático</Text>
      {placed && <><View style={s.row}><Pressable style={s.button} accessibilityLabel="Reducir tamaño" onPress={()=>setScale(v=>Math.max(0.5,v-0.25))}><Text>−</Text></Pressable><Text style={s.text}>{Math.round(scale*100)} %</Text><Pressable style={s.button} accessibilityLabel="Aumentar tamaño" onPress={()=>setScale(v=>Math.min(2,v+0.25))}><Text>+</Text></Pressable><Pressable style={s.button} onPress={()=>{setSession(v=>v+1);setPlaced(false);setTracking(false);setSelected(null);}}><Text>Recolocar</Text></Pressable></View>
      <Text style={s.text}>Resalta los organismos de una interacción:</Text><View style={s.row}>{interactions.map((i,n)=><Pressable key={i.name} style={[s.button,interaction===n&&s.active]} onPress={()=>setInteraction(v=>v===n?null:n)}><Text>{i.name}</Text></Pressable>)}</View></>}
      {interaction!==null&&<Text style={s.text}>{interactions[interaction].description}</Text>}
      {organism&&<><Text style={s.title}>{organism.name}</Text><Text style={s.text}>{organism.description}</Text></>}
      <Text style={s.note}>Representación conceptual; los tamaños no están a escala biológica.</Text>
    </ScrollView>
  </View>;
}
const s=StyleSheet.create({container:{flex:1},scene:{flex:1},message:{flex:1,padding:24,gap:18,justifyContent:'center'},title:{color:'white',fontSize:20,fontWeight:'700'},text:{color:'#E1F1F5',fontSize:15,lineHeight:22},note:{color:'#9CBCC5',fontSize:12},status:{position:'absolute',top:12,left:16,right:16,padding:12,borderRadius:12,backgroundColor:'#062C3BDD'},panel:{position:'absolute',bottom:0,left:0,right:0,maxHeight:'45%',backgroundColor:'#062C3BF2'},row:{flexDirection:'row',flexWrap:'wrap',gap:8,alignItems:'center'},button:{backgroundColor:'#71DDCD',padding:12,borderRadius:10},active:{backgroundColor:'#F6C85F'}});

