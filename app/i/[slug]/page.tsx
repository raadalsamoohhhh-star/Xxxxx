"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VideoInspiredTemplate from "@/components/templates/VideoInspiredTemplate";
import TeatroInspiredTemplate from "@/components/templates/TeatroInspiredTemplate";
import InvitationTheme from "@/components/InvitationTheme";
import { InvitationData } from "@/lib/invitation";


export default function InvitationPage() {
  const [data, setData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    const slug = window.location.pathname.split("/").filter(Boolean).pop() || "";
    fetch(`/api/invitations?slug=${encodeURIComponent(decodeURIComponent(slug))}`)
      .then(async r=>{ if(!r.ok) return null; return r.json(); })
      .then(found=>{ if(found) setData(found); else setNotFound(true); })
      .catch(()=>setNotFound(true))
      .finally(()=>setLoading(false));
  }, []);

  useEffect(()=>{ if(!data) return; fetch('/api/templates').then(r=>r.ok?r.json():[]).then(list=>{ const found=Array.isArray(list)?list.find((x:any)=>x.id===data.templateId):null; setTemplate(found||null); }).catch(()=>setTemplate(null)); },[data]);

  if (loading) return <main className="min-h-screen grid place-items-center">جارٍ تحميل الدعوة…</main>;
  if (notFound || !data) return <main className="min-h-screen grid place-items-center p-6 text-center"><div><h1 className="serif text-4xl">الدعوة غير موجودة</h1><p className="mt-3 text-[#756f68]">تأكد من الرابط أو أنشئ دعوة جديدة.</p><Link href="/templates" className="btn btn-primary mt-6">استعراض القوالب</Link></div></main>;

  if (!template || template.id !== data.templateId) return <main className="min-h-screen grid place-items-center">جارٍ تحميل القالب…</main>;
  const formatted = new Intl.DateTimeFormat("ar-JO", { dateStyle: "long", timeStyle: "short" }).format(new Date(`${data.date}T${data.time || "20:00"}`));

  return (
    <main className="min-h-screen bg-[#f4eee6] p-3 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-3 flex items-center justify-between text-xs text-[#756f68]">
          <span>دعوتي برو · {template.name}</span>
          <span>{template.category}</span>
        </div>
        <InvitationTheme data={data}>
        {template.id === "teatro-inspired" ? (
          <TeatroInspiredTemplate groom={data.groom} bride={data.bride} date={formatted} venue={data.venue} address={data.address} invitationText={data.invitationText} heroImage={data.heroImage} mapUrl={data.mapUrl} videoUrl={data.videoUrl} musicUrl={data.musicUrl} rsvpEnabled={false} monogram={data.monogram} gallery={data.gallery} sections={data.sections} sectionOrder={data.sectionOrder} />
        ) : template.style === "video" ? (
          <VideoInspiredTemplate variant={data.templateId} groom={data.groom} bride={data.bride} date={formatted} venue={data.venue} invitationText={data.invitationText} heroImage={data.heroImage} eventDate={data.date} eventTime={data.time} mapUrl={data.mapUrl} musicUrl={data.musicUrl} videoUrl={data.videoUrl} rsvpEnabled={false} gallery={data.gallery} sections={data.sections} sectionOrder={data.sectionOrder} />
        ) : (
          <div className="rounded-[32px] bg-white min-h-[720px] p-8 flex flex-col items-center justify-center text-center shadow-2xl">
            <p className="text-xs tracking-[.3em] opacity-60">دعوة خاصة</p>
            <h1 className="serif text-6xl mt-8">{data.groom} <span className="gold">&</span> {data.bride}</h1>
            <p className="mt-6">{formatted}</p><p className="text-sm text-[#756f68] mt-2">{data.venue}</p>
          </div>
        )}
        </InvitationTheme>

        {template.style !== "video" && template.id !== "teatro-inspired" && (data.videoUrl || data.heroImage) && <div className="mt-5 rounded-[32px] overflow-hidden bg-black shadow-xl">{data.videoUrl ? <video src={data.videoUrl} controls playsInline preload="metadata" className="w-full max-h-[720px] object-cover" poster={data.heroImage || undefined}/> : <img src={data.heroImage} alt="صورة غلاف الدعوة" className="w-full max-h-[720px] object-cover"/>}</div>}
        {template.style !== "video" && template.id !== "teatro-inspired" && data.musicUrl && <div className="mt-5 rounded-3xl bg-white p-5 shadow-xl"><p className="text-sm font-bold mb-3">موسيقى الدعوة</p><audio controls preload="metadata" src={data.musicUrl} className="w-full"/></div>}
        {template.style !== "video" && template.id !== "teatro-inspired" && !!data.gallery?.length && <section className="mt-5 rounded-[32px] bg-white p-6 shadow-xl"><h2 className="serif text-3xl text-center">ذكرياتنا</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">{data.gallery.map((src,i)=><img key={src+i} alt="صورة من المناسبة" src={src} className="w-full aspect-square object-cover rounded-2xl" loading="lazy"/>)}</div></section>}
        <section className="mt-5 rounded-[32px] bg-white p-7 shadow-xl text-center"><p className="gold text-sm font-bold">شارك الدعوة</p><h2 className="serif text-3xl mt-2">امسح QR لفتحها</h2><img className="w-48 h-48 mx-auto mt-5" alt="QR" src={`https://quickchart.io/qr?size=300&text=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} /><button onClick={()=>navigator.clipboard?.writeText(window.location.href)} className="btn btn-light mt-4">نسخ رابط الدعوة</button></section>
        {data.rsvpEnabled && <PublicRSVP slug={data.slug} />}
      </div>
    </main>
  );
}

function PublicRSVP({slug}:{slug:string}){
 const [name,setName]=useState(""); const [guests,setGuests]=useState(1); const [status,setStatus]=useState<"yes"|"no">("yes"); const [note,setNote]=useState(""); const [sent,setSent]=useState(false);
 async function submit(){ if(!name.trim()) return; const r=await fetch("/api/rsvp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug,name,status,guests,note})}); if(r.ok)setSent(true); }
 return <section className="mt-5 rounded-[32px] bg-white p-7 shadow-xl text-center"><p className="gold text-sm font-bold">تأكيد الحضور</p><h2 className="serif text-3xl mt-2">ننتظر ردّكم</h2>{sent?<p className="mt-5 text-green-700">تم تسجيل ردك بنجاح، شكرًا لكم 🤍</p>:<><input className="field mt-5" placeholder="الاسم" value={name} onChange={e=>setName(e.target.value)}/><div className="grid grid-cols-2 gap-3 mt-3"><button className={`btn ${status==="yes"?"btn-primary":"btn-light"}`} onClick={()=>setStatus("yes")}>سأحضر</button><button className={`btn ${status==="no"?"btn-primary":"btn-light"}`} onClick={()=>setStatus("no")}>أعتذر</button></div>{status==="yes"&&<input className="field mt-3" type="number" min="1" max="20" value={guests} onChange={e=>setGuests(Number(e.target.value))}/>}<textarea className="field mt-3 resize-none" rows={2} placeholder="رسالة أو ملاحظة (اختياري)" value={note} onChange={e=>setNote(e.target.value)}/><button className="btn btn-primary w-full mt-4" onClick={submit}>إرسال التأكيد</button></>}</section>
}
