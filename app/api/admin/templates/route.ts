import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin-auth';
import { readTemplateRegistry, writeTemplateRegistry } from '@/lib/template-registry';
export async function GET() { if (!await isAdmin()) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 }); return NextResponse.json(readTemplateRegistry()); }
export async function PATCH(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  const body = await req.json().catch(() => ({})); const items = readTemplateRegistry(); const i = items.findIndex(x => x.id === body.id);
  if (i < 0) return NextResponse.json({ error: 'القالب غير موجود' }, { status: 404 });
  const allowed = ['story','schedule','gallery','venue','rsvp','wishes']; const current = items[i];
  items[i] = { ...current,
    ...(typeof body.name === 'string' ? {name: body.name.trim().slice(0,100)} : {}),
    ...(typeof body.description === 'string' ? {description: body.description.trim().slice(0,500)} : {}),
    ...(typeof body.category === 'string' ? {category: body.category.trim().slice(0,50)} : {}),
    ...(typeof body.active === 'boolean' ? {active: body.active} : {}),
    ...(typeof body.featured === 'boolean' ? {featured: body.featured} : {}),
    ...(typeof body.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(body.accent) ? {accent:body.accent} : {}),
    ...(typeof body.background === 'string' && /^#[0-9a-fA-F]{6}$/.test(body.background) ? {background:body.background} : {}),
    ...(Array.isArray(body.supportedSections) ? {supportedSections:body.supportedSections.map(String).filter((x:string)=>allowed.includes(x))} : {})
  };
  writeTemplateRegistry(items); return NextResponse.json(items[i]);
}
