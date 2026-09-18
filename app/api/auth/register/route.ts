import {NextResponse} from 'next/server';import crypto from 'crypto';import {db} from '@/lib/server-db';import {createSession,hashPassword,setSessionCookie} from '@/lib/auth';import {email,text} from '@/lib/validation';import {rateLimit} from '@/lib/rate-limit';
export async function POST(req:Request){
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';if(!rateLimit(`register:${ip}`,5,60*60_000))return NextResponse.json({error:'محاولات كثيرة. حاول لاحقًا.'},{status:429});
  const b=await req.json().catch(()=>({}));const name=text(b.name,100),e=email(b.email),password=String(b.password||'');
  if(name.length<2||!e||password.length<8)return NextResponse.json({error:'أدخل الاسم والبريد وكلمة مرور من 8 أحرف على الأقل.'},{status:400});
  const users=await db.users();if(users.some(u=>u.email===e))return NextResponse.json({error:'البريد مستخدم مسبقًا.'},{status:409});
  const user={id:crypto.randomUUID(),name,email:e,passwordHash:hashPassword(password),createdAt:new Date().toISOString()};users.push(user);await db.saveUsers(users);await setSessionCookie(await createSession(user.id));return NextResponse.json({id:user.id,name:user.name,email:user.email});
}
