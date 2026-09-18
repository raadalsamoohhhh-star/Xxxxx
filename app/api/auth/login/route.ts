import {NextResponse} from 'next/server';
import {db} from '@/lib/server-db';
import {createSession,verifyPassword,setSessionCookie} from '@/lib/auth';
import {email,text} from '@/lib/validation';
import {rateLimit} from '@/lib/rate-limit';
export async function POST(req:Request){
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  if(!rateLimit(`login:${ip}`,10,15*60_000))return NextResponse.json({error:'محاولات دخول كثيرة. حاول بعد قليل.'},{status:429});
  const b=await req.json().catch(()=>({}));const e=email(b.email),password=String(b.password||'');
  const u=(await db.users()).find(x=>x.email===e);
  if(!u||!verifyPassword(password,u.passwordHash))return NextResponse.json({error:'البريد أو كلمة المرور غير صحيحة.'},{status:401});
  await setSessionCookie(await createSession(u.id));return NextResponse.json({id:u.id,name:u.name,email:u.email});
}
