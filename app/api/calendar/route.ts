import {NextResponse} from 'next/server';
import {db} from '@/lib/server-db';
import {text} from '@/lib/validation';
export async function GET(req:Request){
  const slug=text(new URL(req.url).searchParams.get('slug'),60);const inv=(await db.invitations())[slug];
  if(!inv||!inv.published)return NextResponse.json({error:'الدعوة غير موجودة.'},{status:404});
  const start=new Date(`${inv.date}T${inv.time||'20:00'}:00`);if(Number.isNaN(start.getTime()))return NextResponse.json({error:'تاريخ غير صالح.'},{status:400});
  const end=new Date(start.getTime()+3*60*60*1000);const fmt=(d:Date)=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  const esc=(s:string)=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//Dawati Pro//AR','BEGIN:VEVENT',`UID:${slug}@dawati.pro`,`DTSTAMP:${fmt(new Date())}`,`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:${esc(`مناسبة ${inv.groom} و ${inv.bride}`)}`,`LOCATION:${esc(`${inv.venue} - ${inv.address}`)}`,`DESCRIPTION:${esc(inv.invitationText)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
  return new NextResponse(ics,{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':`attachment; filename="${slug}.ics"`,'Cache-Control':'public, max-age=300'}});
}
