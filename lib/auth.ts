import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db, User } from './server-db';
import { assertProductionConfig } from './config';

const COOKIE='dawati_session';
const PEPPER=()=>{assertProductionConfig();return process.env.AUTH_PEPPER||'local-dev-pepper';};

export function hashPassword(password:string){
  const salt=crypto.randomBytes(16).toString('hex');
  const hash=crypto.scryptSync(password, `${PEPPER()}|${salt}`, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
}
export function verifyPassword(password:string,stored:string){
  try{
    if(!stored.startsWith('scrypt$'))return false;
    const [,salt,hex]=stored.split('$');
    const actual=crypto.scryptSync(password,`${PEPPER()}|${salt}`,64).toString('hex');
    return hex.length===actual.length && crypto.timingSafeEqual(Buffer.from(hex),Buffer.from(actual));
  }catch{return false}
}
export async function createSession(userId:string){
  const token=crypto.randomBytes(32).toString('base64url');
  const sessions=(await db.sessions()).filter(s=>new Date(s.expiresAt)>new Date());
  sessions.push({token,userId,expiresAt:new Date(Date.now()+1000*60*60*24*30).toISOString()});
  await db.saveSessions(sessions); return token;
}
export async function getCurrentUser():Promise<User|null>{
  const token=(await cookies()).get(COOKIE)?.value;if(!token)return null;
  const sessions=await db.sessions();const s=sessions.find(x=>x.token===token&&new Date(x.expiresAt)>new Date());
  if(!s)return null; const users=await db.users(); return users.find(u=>u.id===s.userId)||null;
}
export async function setSessionCookie(token:string){(await cookies()).set(COOKIE,token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});}
export async function clearSession(){const token=(await cookies()).get(COOKIE)?.value;if(token)await db.saveSessions((await db.sessions()).filter(s=>s.token!==token));(await cookies()).delete(COOKIE);}
