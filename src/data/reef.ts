export const organisms = [
  { id: 'coral', name: 'Coral', color: '#F58A92', position: [-0.2, 0.1, 0], description: 'Los corales construyen estructuras que ofrecen refugio a muchos organismos.' },
  { id: 'alga', name: 'Alga', color: '#69CD8A', position: [0.2, 0.1, 0], description: 'Las algas realizan fotosíntesis y forman parte de la base de numerosas redes alimentarias.' },
  { id: 'pez', name: 'Pez herbívoro', color: '#F6C85F', position: [0.15, 0.25, 0.1], description: 'Algunos peces consumen algas y contribuyen a regular su crecimiento.' },
  { id: 'depredador', name: 'Pez depredador', color: '#80B8F4', position: [-0.1, 0.4, -0.15], description: 'Los peces depredadores se alimentan de otros animales de la red alimentaria.' },
  { id: 'simbionte', name: 'Microalgas simbiontes', color: '#D8A4F4', position: [-0.2, 0.2, 0], description: 'Muchas especies de coral mantienen una relación simbiótica con microalgas fotosintéticas.' },
] as const;
export type OrganismId = typeof organisms[number]['id'];
export const interactions = [
  { name: 'Depredación', ids: ['depredador', 'pez'], description: 'Un pez depredador consume a otro pez. Es un ejemplo esquemático de transferencia de energía.' },
  { name: 'Competencia', ids: ['coral', 'alga'], description: 'Corales y algas pueden competir por espacio en el arrecife.' },
  { name: 'Mutualismo', ids: ['coral', 'simbionte'], description: 'Las microalgas aportan productos de la fotosíntesis; el coral ofrece un entorno protegido y nutrientes.' },
] as const;
