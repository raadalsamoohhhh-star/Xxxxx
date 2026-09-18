export type Template = {
  id:string; name:string; category:string; description:string;
  style:"classic"|"editorial"|"night"|"video"; preview:string;
  supportedSections?: string[]; active?: boolean; featured?: boolean; accent?: string; background?: string;
};
const previews:Record<string,string>={
  "teatro-inspired":"https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80",
  "garden-royal":"https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  "champagne-palace":"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  "pink-rose":"https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
  "dark-velvet":"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
  "phone-story":"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  "rose-motion":"https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80",
  "royal-gold":"https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  "minimal-ivory":"https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  "midnight":"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80"
};
export const templates:Template[]=[
 {id:"teatro-inspired",name:"Teatro Velvet",category:"زفاف",description:"ستائر مخملية وافتتاحية مسرحية تفاعلية.",style:"video",preview:previews["teatro-inspired"]},
 {id:"garden-royal",name:"Garden Royal",category:"زفاف",description:"حديقة ملكية ناعمة مع حركة دخول تدريجية.",style:"video",preview:previews["garden-royal"]},
 {id:"champagne-palace",name:"Champagne Palace",category:"زفاف",description:"واجهة فاخرة بإضاءة دافئة وتفاصيل احتفالية.",style:"video",preview:previews["champagne-palace"]},
 {id:"pink-rose",name:"Pink Rose Garden",category:"زفاف",description:"ورود وردية رومانسية وانتقالات ناعمة.",style:"video",preview:previews["pink-rose"]},
 {id:"dark-velvet",name:"Dark Velvet",category:"زفاف",description:"مخملي داكن مع لمسات ذهبية.",style:"video",preview:previews["dark-velvet"]},
 {id:"phone-story",name:"Phone Story",category:"زفاف",description:"قصة هاتفية مناسبة للمشاركة على الجوال.",style:"video",preview:previews["phone-story"]},
 {id:"rose-motion",name:"Rose Motion",category:"زفاف",description:"بوابة وردية متحركة بتدفق بصري ناعم.",style:"video",preview:previews["rose-motion"]},
 {id:"royal-gold",name:"Royal Gold",category:"زفاف",description:"هوية ملكية هادئة بلمسات ذهبية.",style:"classic",preview:previews["royal-gold"]},
 {id:"minimal-ivory",name:"Minimal Ivory",category:"زفاف",description:"مساحات نظيفة وطابع تحريري راقٍ.",style:"editorial",preview:previews["minimal-ivory"]},
 {id:"midnight",name:"Midnight",category:"خطوبة",description:"دعوة ليلية سينمائية بطابع فاخر.",style:"night",preview:previews["midnight"]}
];
export const managedTemplateDefaults: Record<string, Partial<Template>> = {
  "minimal-ivory": { supportedSections:["story","schedule","gallery","venue","rsvp"] },
  "royal-gold": { supportedSections:["story","schedule","venue","rsvp","wishes"] },
  "teatro-inspired": { supportedSections:["story","schedule","gallery","venue","rsvp","wishes"] }
};
for (const t of templates) Object.assign(t, managedTemplateDefaults[t.id] || {supportedSections:["story","schedule","gallery","venue","rsvp","wishes"]});

export const categories=["الكل","زفاف","خطوبة","حنة","تخرج","ميلاد","مولود"];
