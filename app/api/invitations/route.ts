import {NextResponse} from 'next/server';
import {db,StoredInvitation} from '@/lib/server-db';
import {defaultInvitation,InvitationData} from '@/lib/invitation';
import {getCurrentUser} from '@/lib/auth';
import {slug as normalizeSlug,text,url,positiveInt} from '@/lib/validation';
import {getTemplate} from '@/lib/template-registry';
import type {SectionKey,FontKey,RadiusKey} from '@/lib/invitation';

function publicView(inv:StoredInvitation){const {ownerId,...safe}=inv;return safe;}
function sanitize(body:Partial<InvitationData>):Partial<InvitationData>{
  const allowed=['templateId','slug','groom','bride','date','time','venue','address','invitationText','heroImage','gallery','mapUrl','musicUrl','rsvpEnabled','saveTheDateEnabled','saveTheDateTitle','saveTheDateText','languages','defaultLanguage','monogram','customCoverIllustration','videoUrl','domain','design','sectionOrder','sections'] as const;
  const out:Record<string,unknown>={};for(const k of allowed)if(k in body)out[k]=body[k];
  out.templateId=text(out.templateId,80);out.groom=text(out.groom,100);out.bride=text(out.bride,100);out.venue=text(out.venue,200);out.address=text(out.address,300);out.invitationText=text(out.invitationText,2000);out.saveTheDateTitle=text(out.saveTheDateTitle,120);out.saveTheDateText=text(out.saveTheDateText,1000);out.monogram=text(out.monogram,40);out.heroImage=url(out.heroImage,1200);out.mapUrl=url(out.mapUrl,1200);out.musicUrl=url(out.musicUrl,1200);out.videoUrl=url(out.videoUrl,1200);out.customCoverIllustration=url(out.customCoverIllustration,1200);out.domain=text(out.domain,255);out.gallery=Array.isArray(out.gallery)?out.gallery.slice(0,30).map(x=>url(x,1200)).filter(Boolean):[];
  if(typeof out.design==='object'&&out.design!==null){const d=out.design as Record<string,unknown>;const hex=(v:unknown,fallback:string)=>typeof v==='string'&&/^#[0-9a-fA-F]{6}$/.test(v)?v:fallback;const font=(['serif','sans','modern','display'] as FontKey[]).includes(d.font as FontKey)?d.font as FontKey:'serif';const radius=(['soft','round','square'] as RadiusKey[]).includes(d.radius as RadiusKey)?d.radius as RadiusKey:'round';const titleSize=d.titleSize==='compact'||d.titleSize==='large'?d.titleSize:'large';out.design={accent:hex(d.accent,'#9a7650'),background:hex(d.background,'#fbfaf8'),font,radius,titleSize,overlay:positiveInt(d.overlay,35,70)};}
  if(Array.isArray(out.sectionOrder)){const allowedSections:SectionKey[]=['story','schedule','gallery','venue','rsvp','wishes'];out.sectionOrder=[...new Set(out.sectionOrder.filter((x):x is SectionKey=>typeof x==='string'&&allowedSections.includes(x as SectionKey)))];}
  if(typeof out.sections==='object'&&out.sections!==null){const s=out.sections as Record<string,unknown>;out.sections={story:s.story===true,schedule:s.schedule===true,gallery:s.gallery===true,venue:s.venue===true,rsvp:s.rsvp===true,wishes:s.wishes===true};}
  if(Array.isArray(out.languages))out.languages=out.languages.filter((x):x is 'ar'|'en'|'fr'=>x==='ar'||x==='en'||x==='fr');if(out.defaultLanguage!=='ar'&&out.defaultLanguage!=='en'&&out.defaultLanguage!=='fr')out.defaultLanguage='ar';
  return out as Partial<InvitationData>;
}
export async function GET(req:Request){
  const params=new URL(req.url).searchParams; const slug=normalizeSlug(params.get('slug')); const mine=params.get('mine')==='1'; const all=await db.invitations();
  const u=await getCurrentUser();
  if(slug && mine){if(!u)return NextResponse.json({error:'غير مصرح'},{status:401});const inv=all[slug];if(!inv||inv.ownerId!==u.id)return NextResponse.json({error:'غير مصرح'},{status:403});return NextResponse.json(inv);}
  if(slug){const inv=all[slug];if(!inv||!inv.published)return NextResponse.json(null,{status:404});return NextResponse.json(publicView(inv));}
  if(!u)return NextResponse.json({error:'غير مصرح'},{status:401});return NextResponse.json(Object.values(all).filter(x=>x.ownerId===u.id));
}
export async function POST(req:Request){
  const u=await getCurrentUser();if(!u)return NextResponse.json({error:'سجل الدخول أولاً.'},{status:401});
  const body=await req.json().catch(()=>({})) as Partial<InvitationData>;const clean=sanitize(body);const slug=normalizeSlug(clean.slug);const template=getTemplate(String(clean.templateId||''));if(!template||!template.active)return NextResponse.json({error:'القالب غير متاح.'},{status:400});if(!slug)return NextResponse.json({error:'الرابط المختصر يجب أن يحتوي أحرفًا إنجليزية أو أرقامًا.'},{status:400});
  const all=await db.invitations();const old=all[slug];if(old&&old.ownerId!==u.id)return NextResponse.json({error:'الرابط المختصر مستخدم.'},{status:409});const now=new Date().toISOString();
  const item:StoredInvitation={...defaultInvitation,...clean,slug,ownerId:u.id,published:true,createdAt:old?.createdAt||now,updatedAt:now};all[slug]=item;await db.saveInvitations(all);return NextResponse.json(item);
}
