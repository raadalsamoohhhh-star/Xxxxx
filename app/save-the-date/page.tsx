"use client";
import { defaultInvitation } from "@/lib/invitation";
export default function SaveTheDatePage(){
 const d=new Date(`${defaultInvitation.date}T${defaultInvitation.time}`);
 const label=new Intl.DateTimeFormat("ar-JO",{dateStyle:"long"}).format(d);
 return <main className="save-date-page"><section className="save-date-card"><span className="save-date-kicker">SAVE THE DATE</span>
 <div className="save-date-monogram">{defaultInvitation.monogram}</div><h1>{defaultInvitation.groom} <i>&</i> {defaultInvitation.bride}</h1>
 <p>{defaultInvitation.saveTheDateText}</p><strong>{label}</strong><div className="save-date-count">احتفظوا بالتاريخ في تقويمكم</div></section></main>;
}
