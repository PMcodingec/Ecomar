import { organisms, interactions } from './reef';
const reef = require('../../assets/onboarding/reef.png');
const connections = require('../../assets/onboarding/connections.png');
export type Category = 'Todos' | 'Ecosistemas' | 'Organismos' | 'Interacciones';
export type Lesson = { id: string; title: string; category: Exclude<Category, 'Todos'>; image: number; description: string; tag: string };
export const lessons: Lesson[] = [
  { id: 'reef', title: 'Arrecife de coral', category: 'Ecosistemas', image: reef, tag: 'EXPLORACIÓN RA', description: 'Explora la estructura del arrecife, identifica organismos y observa sus relaciones. Coloca la escena sobre una superficie horizontal bien iluminada. La representación es esquemática y no tiene escala biológica.' },
  ...organisms.map(o => ({ id: o.id, title: o.name, category: 'Organismos' as const, image: reef, tag: 'BIOLOGÍA MARINA', description: o.description + (o.id === 'simbionte' ? ' En el modelo se muestran ampliadas y separadas para identificarlas; en esta simbiosis están asociadas a los tejidos del coral.' : '') })),
  ...interactions.map((i, n) => ({ id: `interaction-${n}`, title: i.name, category: 'Interacciones' as const, image: connections, tag: 'ECOLOGÍA', description: i.description })),
];
export const categories: Category[] = ['Todos', 'Ecosistemas', 'Organismos', 'Interacciones'];
export function searchLessons(query: string, category: Category, favorites?: readonly string[]) {
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const term = normalize(query.trim());
  return lessons.filter(l => (category === 'Todos' || l.category === category) && (!favorites || favorites.includes(l.id)) && normalize(`${l.title} ${l.category} ${l.description}`).includes(term));
}
