import { useRef } from 'react';
import {
  ViroARScene, ViroARPlaneSelector, ViroAmbientLight, ViroBox,
  ViroSphere, ViroNode, ViroText, ViroMaterials, ViroPolyline,
} from '@reactvision/react-viro';
import { organisms, OrganismId } from '../data/reef';

type Point = [number, number, number];
type AppProps = {
  scale: number; rotation: number; labels: boolean; selected: OrganismId | null;
  active: readonly string[];
  onSelect: (id: OrganismId) => void; onPlaced: () => void; onTracking: (state: number) => void;
};
type Props = { sceneNavigator?: { viroAppProps: AppProps } };
const rocks: { position: Point; scale: Point }[] = [
  { position: [-.22, .055, -.1], scale: [.11, .045, .07] },
  { position: [.2, .04, -.12], scale: [.09, .035, .07] },
  { position: [.05, .04, .16], scale: [.07, .03, .05] },
];
ViroMaterials.createMaterials({
  ...Object.fromEntries(organisms.map(o => [o.id, { diffuseColor: o.color }])),
  sand: { diffuseColor: '#D5CCAA' }, rock: { diffuseColor: '#748C8A' },
  eye: { diffuseColor: '#102A36' }, white: { diffuseColor: '#FFFFFF' },
  connection: { diffuseColor: '#FFE18B', lightingModel: 'Constant' },
  glow: { diffuseColor: '#FFE18B', lightingModel: 'Constant' },
});

function Coral({ material }: { material: string }) {
  return <ViroNode>
    <ViroSphere radius={1} position={[0, -.06, 0]} scale={[.07, .035, .055]} materials={['rock']} />
    {[-1, 0, 1].map((branch) => <ViroNode key={branch} position={[branch * .032, -.01, 0]} rotation={[0, branch * 30, branch * -22]}>
      <ViroSphere radius={1} scale={[.015, .09, .015]} materials={[material]} />
      <ViroSphere radius={1} position={[-.025, .045, 0]} rotation={[0, 0, 40]} scale={[.011, .045, .011]} materials={[material]} />
      <ViroSphere radius={1} position={[.024, .035, .01]} rotation={[15, 0, -40]} scale={[.011, .04, .011]} materials={[material]} />
    </ViroNode>)}
  </ViroNode>;
}
function Algae() {
  return <ViroNode>
    {[-1, 0, 1].map((blade) => <ViroNode key={blade} position={[blade * .025, 0, blade * .015]} rotation={[blade * 10, blade * 40, blade * 14]}>
      <ViroSphere radius={1} scale={[.011, .085, .012]} materials={['alga']} />
      <ViroSphere radius={1} position={[.02, .015, 0]} rotation={[0, 0, -35]} scale={[.016, .04, .006]} materials={['alga']} />
      <ViroSphere radius={1} position={[-.015, -.015, 0]} rotation={[0, 0, 35]} scale={[.014, .035, .006]} materials={['alga']} />
    </ViroNode>)}
  </ViroNode>;
}
function Fish({ material, predator }: { material: string; predator: boolean }) {
  return <ViroNode scale={predator ? [1.25, 1.25, 1.25] : [1, 1, 1]}>
    <ViroSphere radius={1} scale={[.08, .038, .026]} materials={[material]} />
    <ViroSphere radius={1} position={[-.085, 0, 0]} scale={[.025, .046, .008]} materials={[material]} />
    <ViroSphere radius={1} position={[-.012, .035, 0]} rotation={[0, 0, 25]} scale={[.03, .019, .005]} materials={[material]} />
    <ViroSphere radius={1} position={[.012, -.009, .027]} rotation={[0, 20, -25]} scale={[.025, .012, .005]} materials={['white']} />
    {[-1, 1].map(side => <ViroSphere key={side} radius={.006} position={[.055, .012, side * .021]} materials={['eye']} />)}
  </ViroNode>;
}
function Symbionts() {
  return <ViroNode>
    {[[0, 0, 0], [-.025, .02, 0], [.025, .012, .01]].map((p, i) => <ViroSphere key={i} radius={.018} position={p as Point} materials={['simbionte']} />)}
  </ViroNode>;
}

export default function ReefScene({ sceneNavigator }: Props = {}) {
  const selector = useRef<ViroARPlaneSelector>(null);
  const app = sceneNavigator!.viroAppProps;
  const participants = organisms.filter(o => app.active.includes(o.id));
  return <ViroARScene anchorDetectionTypes={['PlanesHorizontal']} onTrackingUpdated={app.onTracking}
    onAnchorFound={a => selector.current?.handleAnchorFound(a)}
    onAnchorUpdated={a => selector.current?.handleAnchorUpdated(a)}
    onAnchorRemoved={a => a && selector.current?.handleAnchorRemoved(a)}>
    <ViroAmbientLight color="#FFFFFF" intensity={650} />
    <ViroARPlaneSelector ref={selector} alignment="Horizontal" hideOverlayOnSelection onPlaneSelected={app.onPlaced}>
      <ViroNode scale={[app.scale, app.scale, app.scale]} rotation={[0, app.rotation, 0]}>
        <ViroBox position={[0, .015, 0]} width={.7} height={.03} length={.5} materials={['sand']} />
        {rocks.map((rock, i) => <ViroSphere key={i} radius={1} {...rock} materials={['rock']} />)}
        <ViroNode position={[-.04, .08, -.15]} scale={[.7, .7, .7]}><Coral material="coral" /></ViroNode>
        {participants.length === 2 && <ViroPolyline points={participants.map(o => [...o.position] as Point)} thickness={.004} materials={['connection']} ignoreEventHandling />}
        {organisms.map(o => <ViroNode key={o.id} position={[...o.position]} onClick={() => app.onSelect(o.id)}>
          {o.id === 'coral' && <Coral material="coral" />}
          {o.id === 'alga' && <Algae />}
          {(o.id === 'pez' || o.id === 'depredador') && <Fish material={o.id} predator={o.id === 'depredador'} />}
          {o.id === 'simbionte' && <Symbionts />}
          {(app.active.includes(o.id) || app.selected === o.id) && <ViroSphere radius={.011} position={[0, .13, 0]} materials={['glow']} ignoreEventHandling />}
          {(app.labels || app.selected === o.id) && <ViroText text={o.name} position={[0, .17, 0]} width={.25} height={.065} style={{ fontSize: 12, color: '#FFFFFF', textAlign: 'center' }} ignoreEventHandling />}
        </ViroNode>)}
      </ViroNode>
    </ViroARPlaneSelector>
  </ViroARScene>;
}
