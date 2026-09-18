"use client";
import { useState } from "react";

type Props = {
  groom:string; bride:string; date:string; venue:string; address?:string;
  invitationText:string; heroImage?:string; mapUrl?:string; videoUrl?:string; musicUrl?:string; rsvpEnabled?:boolean; monogram?:string; gallery?:string[]; sections?: { story:boolean; schedule:boolean; gallery:boolean; venue:boolean; rsvp:boolean; wishes:boolean }; sectionOrder?: string[];
};

export default function TeatroInspiredTemplate({groom,bride,date,venue,address,invitationText,heroImage,mapUrl,videoUrl,musicUrl,rsvpEnabled=true,monogram="M & L",gallery=[],sections,sectionOrder=["story","schedule","gallery","venue","rsvp","wishes"]}:Props){
  const [open,setOpen]=useState(false); const [rsvp,setRsvp]=useState<string|null>(null);
  const bg=heroImage||"https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1200&q=85";
  if(!open) return <div className="teatro-template teatro-gate"><div className="curtain curtain-left"/><div className="curtain curtain-right"/><div className="teatro-gate-content">
    <span className="teatro-kicker">دعوة رقمية</span><div className="teatro-monogram">{monogram}</div><h2>{groom} <i>&</i> {bride}</h2>
    <p>قصة جديدة تبدأ بحضوركم</p><button className="teatro-open" onClick={()=>setOpen(true)}>فتح الستار</button>
  </div></div>;
  return <div className="teatro-template">
    <section className="teatro-hero" style={{backgroundImage:`linear-gradient(180deg,rgba(12,3,5,.05),rgba(12,3,5,.82)),url(${bg})`}}>
      <div className="teatro-stage-glow"/><div className="teatro-copy"><span className="teatro-kicker">THE WEDDING</span>
      <div className="teatro-monogram">{monogram}</div><h1>{groom}<small>&</small>{bride}</h1><p>{date}</p></div>
    </section>
    {videoUrl&&<div className="px-5 py-5 bg-[#13090b]"><video src={videoUrl} controls playsInline preload="metadata" poster={heroImage||undefined} className="w-full max-h-[560px] object-cover rounded-[24px]" /></div>}
    {sectionOrder.filter(key=>sections?.[key as keyof typeof sections] !== false).map(key=>{
      if(key==="story") return <section className="teatro-panel" key={key}><span className="teatro-kicker">يسعدنا حضوركم</span><h2>{invitationText}</h2><div className="teatro-rule"/><p>هذه الدعوة هي تذكرتكم إلى يومنا المميز.</p></section>;
      if(key==="gallery") return gallery.length ? <section className="teatro-gallery" key={key}><span className="teatro-kicker">ذكرياتنا</span><div className="invite-gallery-grid">{gallery.map((src,i)=><img key={src+i} src={src} alt="صورة من المناسبة" />)}</div></section> : null;
      if(key==="venue") return <section className="teatro-details" key={key}><div><span>الموعد</span><strong>{date}</strong></div><div><span>المكان</span><strong>{venue}</strong><small>{address}</small></div></section>;
      if(key==="rsvp") return rsvpEnabled?<section className="teatro-rsvp" key={key}><span className="teatro-kicker">RSVP</span><h2>هل ستكونون معنا؟</h2><div className="teatro-rsvp-actions"><button className={rsvp==="yes"?"active":""} onClick={()=>setRsvp("yes")}>سأحضر</button><button className={rsvp==="no"?"active":""} onClick={()=>setRsvp("no")}>أعتذر</button></div>{rsvp&&<p>تم تسجيل الاختيار في المعاينة.</p>}</section>:null;
      return null;
    })}
    <section className="teatro-footer-actions">{musicUrl&&<audio controls preload="metadata" src={musicUrl} className="w-full" />}{mapUrl&&<a href={mapUrl} target="_blank" rel="noreferrer">📍 الخريطة</a>}
      <button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(`${groom} & ${bride} — ${date} — ${venue}`)}`,"_blank")}>💬 مشاركة</button>
    </section>
  </div>;
}
