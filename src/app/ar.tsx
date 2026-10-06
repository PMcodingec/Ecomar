import Constants from 'expo-constants';
import { Text, View } from 'react-native';
import { lazy, Suspense } from 'react';
const Experience=lazy(()=>import('../components/ARExperience'));
export default function ARScreen(){
  if(Constants.executionEnvironment==='storeClient') return <View style={{padding:24,gap:16}}><Text style={{color:'white',fontSize:22}}>Instala la versión de desarrollo de EcoMar</Text><Text style={{color:'#C3DEE5',fontSize:16}}>La realidad aumentada requiere la aplicación propia de EcoMar para Android o iOS. Expo Go permite consultar el contenido educativo.</Text></View>;
  return <Suspense fallback={<Text style={{color:'white'}}>Preparando arrecife…</Text>}><Experience/></Suspense>;
}
