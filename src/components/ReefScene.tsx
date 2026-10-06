import { useRef } from 'react';
import { ViroARScene, ViroARPlaneSelector, ViroAmbientLight, ViroBox, ViroSphere, ViroNode, ViroText, ViroMaterials } from '@reactvision/react-viro';
import { organisms, OrganismId } from '../data/reef';
ViroMaterials.createMaterials(Object.fromEntries([...organisms.map(o=>[o.id,{diffuseColor:o.color}]),['sand',{diffuseColor:'#C8BE9F'}],['active',{diffuseColor:'#FFFFFF'}]]));
type Props = { sceneNavigator?: { viroAppProps: { scale: number; active: readonly string[]; onSelect: (id: OrganismId)=>void; onPlaced: ()=>void; onTracking: (state: number)=>void } } };
export default function ReefScene({sceneNavigator}: Props = {}) {
  const selector=useRef<ViroARPlaneSelector>(null);
  const app=sceneNavigator!.viroAppProps;
  return <ViroARScene anchorDetectionTypes={['PlanesHorizontal']} onTrackingUpdated={app.onTracking} onAnchorFound={a=>selector.current?.handleAnchorFound(a)} onAnchorUpdated={a=>selector.current?.handleAnchorUpdated(a)} onAnchorRemoved={a=>a && selector.current?.handleAnchorRemoved(a)}>
    <ViroAmbientLight color="#ffffff" intensity={600}/>
    <ViroARPlaneSelector ref={selector} alignment="Horizontal" hideOverlayOnSelection onPlaneSelected={app.onPlaced}>
      <ViroNode scale={[app.scale,app.scale,app.scale]}>
        <ViroBox position={[0,0.015,0]} width={0.7} height={0.03} length={0.5} materials={['sand']}/>
        {organisms.map(o=><ViroNode key={o.id} position={[...o.position]} onClick={()=>app.onSelect(o.id)}>
          <ViroSphere radius={o.id==='simbionte'?0.025:0.065} scale={o.id.includes('pez')||o.id==='depredador'?[1.6,0.65,0.7]:[1,1,1]} materials={[app.active.includes(o.id)?'active':o.id]}/>
          <ViroText text={o.name} position={[0,0.1,0]} width={0.3} height={0.08} style={{fontSize:14,color:o.color,textAlign:'center'}}/>
        </ViroNode>)}
      </ViroNode>
    </ViroARPlaneSelector>
  </ViroARScene>;
}

