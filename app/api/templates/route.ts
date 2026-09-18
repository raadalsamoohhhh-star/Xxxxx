import { NextResponse } from 'next/server'; import { getPublicTemplates } from '@/lib/template-registry';
export async function GET() { return NextResponse.json(getPublicTemplates()); }
