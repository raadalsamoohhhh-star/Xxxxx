import fs from 'fs';
import path from 'path';
import { Template, templates as builtInTemplates } from './templates';

export type ManagedTemplate = Template & {
  active: boolean;
  featured: boolean;
  supportedSections: string[];
  accent: string;
  background: string;
};

const file = path.join(process.cwd(), 'data', 'templates.json');

function normalize(t: Partial<ManagedTemplate>): ManagedTemplate {
  const base = builtInTemplates.find(x => x.id === t.id);
  return {
    ...(base || {
      id: String(t.id || ''), name: 'قالب جديد', category: 'زفاف',
      description: '', style: 'classic', preview: ''
    }),
    ...t,
    active: t.active !== false,
    featured: Boolean(t.featured),
    supportedSections: Array.isArray(t.supportedSections) && t.supportedSections.length
      ? t.supportedSections.map(String)
      : ['story','schedule','gallery','venue','rsvp','wishes'],
    accent: String(t.accent || base?.accent || '#9a7650'),
    background: String(t.background || base?.background || '#fbfaf8')
  } as ManagedTemplate;
}

export function readTemplateRegistry(): ManagedTemplate[] {
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(parsed)) throw new Error('invalid registry');
    return parsed.map(normalize);
  } catch {
    return builtInTemplates.map(normalize);
  }
}

export function getTemplate(id: string) {
  return readTemplateRegistry().find(t => t.id === id) || null;
}

export function getPublicTemplates() {
  return readTemplateRegistry().filter(t => t.active);
}

export function writeTemplateRegistry(items: ManagedTemplate[]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(items.map(normalize), null, 2), 'utf8');
}
