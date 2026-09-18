export function text(value:unknown,max=500){return String(value??'').trim().slice(0,max)}
export function email(value:unknown){const v=text(value,254).toLowerCase();return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)?v:''}
export function slug(value:unknown){return text(value,80).toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)}
export function positiveInt(value:unknown,fallback=1,max=100){const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(1,Math.floor(n))):fallback}
export function url(value:unknown,max=1000){const v=text(value,max);try{const u=new URL(v);return ['http:','https:'].includes(u.protocol)?u.toString():''}catch{return ''}}
