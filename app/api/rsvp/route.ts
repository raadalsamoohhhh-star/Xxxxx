import {NextResponse} from 'next/server';
import crypto from 'crypto';
import {db,RSVP} from '@/lib/server-db';
import {rateLimit} from '@/lib/rate-limit';
import {text,positiveInt} from '@/lib/validation';
import {getCurrentUser} from '@/lib/auth';

export async function GET(req:Request){
  const u=await getCurrentUser();
  if(!u)return NextResponse.json({error:'غير مصرح'},{status:401});
  const slug=text(new URL(req.url).searchParams.get('slug'),60);
  if(!slug)return NextResponse.json({error:'slug مطلوب'},{status:400});
  const inv=(await db.invitations())[slug];
  if(!inv||inv.ownerId!==u.id)return NextResponse.json({error:'غير مصرح'},{status:403});
  return NextResponse.json((await db.rsvps()).filter(x=>x.slug===slug));
}
export async function POST(req:Request){
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  if(!rateLimit(`rsvp:${ip}`,20,60_000))return NextResponse.json({error:'محاولات كثيرة. حاول لاحقًا.'},{status:429});
  const b=await req.json().catch(()=>({}));
  const slug=text(b.slug,60),name=text(b.name,120),status=b.status==='yes'||b.status==='no'?b.status:null;
  if(!slug||!name||!status)return NextResponse.json({error:'بيانات RSVP ناقصة'},{status:400});
  const all=await db.invitations(); const inv=all[slug];
  if(!inv||!inv.published||!inv.rsvpEnabled)return NextResponse.json({error:'الدعوة غير متاحة لتأكيد الحضور.'},{status:404});
  const rows=await db.rsvps();
  const item:RSVP={id:crypto.randomUUID(),slug,name,status,guests:status==='yes'?positiveInt(b.guests,1,20):0,note:text(b.note,500),createdAt:new Date().toISOString()};
  rows.push(item);await db.saveRsvps(rows);return NextResponse.json({ok:true,id:item.id});
}
