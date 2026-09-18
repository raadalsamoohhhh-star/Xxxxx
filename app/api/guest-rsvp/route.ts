import {NextResponse} from 'next/server';
import {db} from '@/lib/server-db';
import {rateLimit} from '@/lib/rate-limit';
import {text} from '@/lib/validation';
export async function POST(req:Request){
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  if(!rateLimit(`guest-rsvp:${ip}`,20,60_000))return NextResponse.json({error:'محاولات كثيرة. حاول لاحقًا.'},{status:429});
  const b=await req.json().catch(()=>({}));const token=text(b.token,100),status=b.status==='confirmed'||b.status==='declined'?b.status:null;
  if(!token||!status)return NextResponse.json({error:'بيانات ناقصة'},{status:400});
  const rows=await db.guests();const i=rows.findIndex(g=>g.token===token);if(i<0)return NextResponse.json({error:'الرابط غير صالح'},{status:404});
  const inv=(await db.invitations())[rows[i].invitationSlug];if(!inv||!inv.published)return NextResponse.json({error:'الدعوة غير متاحة.'},{status:404});
  rows[i]={...rows[i],status,note:text(b.note,500),updatedAt:new Date().toISOString()};await db.saveGuests(rows);
  return NextResponse.json({ok:true});
}
