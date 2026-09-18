export type InvitationLanguage = "ar" | "en" | "fr";
export type SectionKey = "story" | "schedule" | "gallery" | "venue" | "rsvp" | "wishes";
export type FontKey = "serif" | "sans" | "modern" | "display";
export type RadiusKey = "soft" | "round" | "square";

export type InvitationData = {
  templateId: string; slug: string; groom: string; bride: string; date: string; time: string;
  venue: string; address: string; invitationText: string; heroImage: string; gallery: string[];
  mapUrl: string; musicUrl: string; rsvpEnabled: boolean; saveTheDateEnabled: boolean;
  saveTheDateTitle: string; saveTheDateText: string; languages: InvitationLanguage[];
  defaultLanguage: InvitationLanguage; monogram: string; customCoverIllustration: string;
  videoUrl: string; domain: string;
  design: { accent: string; background: string; font: FontKey; radius: RadiusKey; titleSize: "compact"|"large"; overlay: number };
  sectionOrder: SectionKey[];
  sections: Record<SectionKey, boolean>;
};

export const defaultInvitation: InvitationData = {
  templateId:"garden-royal", slug:"mohammad-lina", groom:"محمد", bride:"لينا",
  date:"2026-10-20", time:"20:00", venue:"قاعة النخبة — عمّان", address:"عمّان، الأردن",
  invitationText:"يسعدنا أن نشارككم أجمل لحظاتنا ونتشرف بحضوركم فرحتنا.", heroImage:"", gallery:[],
  mapUrl:"https://maps.google.com/?q=Amman", musicUrl:"", rsvpEnabled:true,
  saveTheDateEnabled:true, saveTheDateTitle:"Save the Date", saveTheDateText:"احتفظوا بهذا التاريخ وكونوا معنا في يومنا الكبير.",
  languages:["ar","en"], defaultLanguage:"ar", monogram:"M & L", customCoverIllustration:"", videoUrl:"", domain:"",
  design:{accent:"#9a7650",background:"#fbfaf8",font:"serif",radius:"round",titleSize:"large",overlay:35},
  sectionOrder:["story","schedule","gallery","venue","rsvp","wishes"],
  sections:{story:true,schedule:true,gallery:true,venue:true,rsvp:true,wishes:true}
};

export const INVITATION_STORAGE_KEY = "dawati-pro-invitations";
export function readInvitations(): Record<string,InvitationData>{ if(typeof window==="undefined") return {}; try{return JSON.parse(localStorage.getItem(INVITATION_STORAGE_KEY)||"{}")}catch{return {}} }
export function saveInvitation(data:InvitationData){const all=readInvitations();all[data.slug]=data;localStorage.setItem(INVITATION_STORAGE_KEY,JSON.stringify(all));}
export function getInvitation(slug:string){return readInvitations()[slug]||null}
export function invitationTargetMs(data:InvitationData){const ms=new Date(`${data.date}T${data.time||"20:00"}`).getTime();return Number.isNaN(ms)?Date.now():ms}
