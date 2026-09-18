"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  variant: string;
  groom: string;
  bride: string;
  date: string;
  venue: string;
  invitationText: string;
  heroImage?: string;
  eventDate?: string;
  eventTime?: string;
  mapUrl?: string;
  musicUrl?: string;
  rsvpEnabled?: boolean;
  gallery?: string[];
  sections?: { story:boolean; schedule:boolean; gallery:boolean; venue:boolean; rsvp:boolean; wishes:boolean };
  sectionOrder?: string[];
};

const presets: Record<string, any> = {
  "garden-royal": {
    title: "حديقة ملكية",
    eyebrow: "دعوة زفاف",
    className: "vip-garden",
    bg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
  },
  "champagne-palace": {
    title: "قصر الشمبانيا",
    eyebrow: "The Wedding",
    className: "vip-champagne",
    bg: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=85",
  },
  "pink-rose": {
    title: "حديقة الورد",
    eyebrow: "دعوة زفاف",
    className: "vip-pink",
    bg: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
  },
  "dark-velvet": {
    title: "Velvet Night",
    eyebrow: "The Wedding of",
    className: "vip-velvet",
    bg: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
  },
  "phone-story": {
    title: "دعوة على الهاتف",
    eyebrow: "مناسبة لا تُنسى",
    className: "vip-phone",
    bg: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
  },
  "rose-motion": {
    title: "بوابة الورد",
    eyebrow: "Wedding Invitation",
    className: "vip-rose-motion",
    bg: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85",
  },
};

export default function VideoInspiredTemplate({ variant, groom, bride, date, venue, invitationText, heroImage, eventDate, eventTime = "20:00", mapUrl, musicUrl, rsvpEnabled = true, gallery = [], sections, sectionOrder = ["story","schedule","gallery","venue","rsvp","wishes"] }: Props) {
  const p = presets[variant] ?? presets["garden-royal"];
  const [open, setOpen] = useState(false);
  const [rsvp, setRsvp] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const target = useMemo(() => {
    const ms = new Date(`${eventDate || "2026-10-20"}T${eventTime}`).getTime();
    return Number.isNaN(ms) ? Date.now() : ms;
  }, [eventDate, eventTime]);
  const [left, setLeft] = useState(target - Date.now());

  useEffect(() => {
    const timer = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(timer);
  }, [target]);

  const days = Math.max(0, Math.floor(left / 86400000));
  const hours = Math.max(0, Math.floor(left / 3600000) % 24);
  const minutes = Math.max(0, Math.floor(left / 60000) % 60);
  const seconds = Math.max(0, Math.floor(left / 1000) % 60);

  if (!open) {
    return (
      <div className={`video-template ${p.className}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(10,8,8,.18), rgba(10,8,8,.68)), url(${heroImage || p.bg})` }}>
        <div className="opening-particles" />
        <div className="opening-card">
          <span>{p.eyebrow}</span>
          <div className="seal">✦</div>
          <h2>{groom} <small>&</small> {bride}</h2>
          <p>اضغط لفتح الدعوة</p>
          <button onClick={() => setOpen(true)} className="open-btn">فتح الدعوة</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-template ${p.className} invitation-scroll`}>
      <section className="hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.48)), url(${heroImage || p.bg})` }}>
        <div className="hero-flower flower-a" />
        <div className="hero-flower flower-b" />
        <div className="hero-copy">
          <span className="eyebrow">{p.eyebrow}</span>
          <h1>{groom}<i>&</i>{bride}</h1>
          <p>{date}</p>
        </div>
      </section>

      {sectionOrder.filter(key => sections?.[key as keyof typeof sections] !== false).map(key => {
        if (key === "story") return <section className="story-card" key={key}><span className="eyebrow">بكل حب</span><h2>{invitationText || "يسعدنا أن نشارككم أجمل لحظاتنا"}</h2><div className="ornament">❦</div><p>نتشرف بحضوركم ومشاركتكم فرحتنا في هذا اليوم المميز.</p></section>;
        if (key === "schedule") return <section className="countdown" key={key}><span className="eyebrow">العد التنازلي</span><div className="count-grid">{[[days,"يوم"],[hours,"ساعة"],[minutes,"دقيقة"],[seconds,"ثانية"]].map(([n,l]) => <div key={String(l)}><b>{n}</b><span>{l}</span></div>)}</div></section>;
        if (key === "gallery") return gallery.length ? <section className="invite-gallery" key={key}><span className="eyebrow">ذكرياتنا</span><div className="invite-gallery-grid">{gallery.map((src,i)=><img key={src+i} src={src} alt="صورة من المناسبة" />)}</div></section> : null;
        if (key === "venue") return <section className="details-grid" key={key}><div className="detail-card"><span>التاريخ</span><strong>{date}</strong></div><div className="detail-card"><span>المكان</span><strong>{venue}</strong></div></section>;
        if (key === "rsvp") return rsvpEnabled ? <section className="rsvp-card" key={key}><span className="eyebrow">تأكيد الحضور</span><h2>هل ستشاركوننا فرحتنا؟</h2><div className="rsvp-actions"><button className={rsvp === "yes" ? "selected" : ""} onClick={() => setRsvp("yes")}>سأحضر</button><button className={rsvp === "no" ? "selected" : ""} onClick={() => setRsvp("no")}>أعتذر</button></div>{rsvp === "yes" && <div className="guest-step"><span>عدد الأشخاص</span><div><button onClick={() => setGuestCount(Math.max(1, guestCount-1))}>−</button><b>{guestCount}</b><button onClick={() => setGuestCount(guestCount+1)}>+</button></div></div>}{rsvp && <p className="rsvp-note">تم تسجيل اختيارك في المعاينة.</p>}</section> : null;
        return null;
      })}

      <section className="actions">
        {mapUrl ? <a href={mapUrl} target="_blank" rel="noreferrer" className="action-link">📍 الموقع</a> : <button>📍 الموقع</button>}
        <button onClick={() => { const start = eventDate ? `${eventDate}T${eventTime || "20:00"}` : "2026-10-20T20:00"; const encoded = start.replace(/[-:]/g, ""); const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${groom} & ${bride}`)}&dates=${encoded}/${encoded}&location=${encodeURIComponent(venue)}`; window.open(url, "_blank"); }}>📅 أضف للتقويم</button>
        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${groom} & ${bride} — ${date} — ${venue}`)}`, "_blank")}>💬 مشاركة واتساب</button>
        {musicUrl && <audio className="music-player" controls src={musicUrl} />}
      </section>
    </div>
  );
}
