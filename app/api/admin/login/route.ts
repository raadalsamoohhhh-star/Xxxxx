import { NextResponse } from 'next/server';
import { adminCredentialsValid, createAdminToken, setAdminCookie } from '@/lib/admin-auth';
import { rateLimit } from '@/lib/rate-limit';
export async function POST(req: Request) { const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown'; if(!rateLimit(`admin-login:${ip}`,5,15*60_000)) return NextResponse.json({error:'محاولات دخول كثيرة. حاول لاحقًا.'},{status:429}); const body = await req.json().catch(() => ({})); if (!adminCredentialsValid(String(body.email || ''), String(body.password || ''))) return NextResponse.json({ error: 'بيانات دخول الإدارة غير صحيحة.' }, { status: 401 }); await setAdminCookie(createAdminToken()); return NextResponse.json({ ok: true }); }
