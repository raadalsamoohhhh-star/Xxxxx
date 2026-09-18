import { NextResponse } from 'next/server';
import { adminCredentialsValid, createAdminToken, setAdminCookie } from '@/lib/admin-auth';
export async function POST(req: Request) { const body = await req.json().catch(() => ({})); if (!adminCredentialsValid(String(body.email || ''), String(body.password || ''))) return NextResponse.json({ error: 'بيانات دخول الإدارة غير صحيحة.' }, { status: 401 }); await setAdminCookie(createAdminToken()); return NextResponse.json({ ok: true }); }
