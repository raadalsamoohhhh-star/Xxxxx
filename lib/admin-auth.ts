import crypto from 'crypto';
import { cookies } from 'next/headers';
import { assertProductionConfig } from './config';

const COOKIE = 'dawati_admin_session';
const SECRET = () => { assertProductionConfig(); return process.env.ADMIN_SESSION_SECRET || process.env.AUTH_PEPPER || 'dawati-dev-admin-secret'; };

export function adminCredentialsValid(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL || '';
  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  if (!expectedEmail || !expectedPassword) return false;
  return email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() && password === expectedPassword;
}

function sign(value: string) { return crypto.createHmac('sha256', SECRET()).update(value).digest('hex'); }
export function createAdminToken() { const exp = Date.now() + 1000 * 60 * 60 * 8; const payload = String(exp); return `${payload}.${sign(payload)}`; }
function valid(token: string) { const [payload, signature] = token.split('.'); if (!payload || !signature || !/^\d+$/.test(payload)) return false; if (Number(payload) < Date.now()) return false; const expected = sign(payload); if (signature.length !== expected.length) return false; return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected)); }
export async function setAdminCookie(token: string) { (await cookies()).set(COOKIE, token, { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', path:'/', maxAge:60*60*8 }); }
export async function isAdmin() { const token=(await cookies()).get(COOKIE)?.value; return Boolean(token && valid(token)); }
export async function clearAdminCookie() { (await cookies()).delete(COOKIE); }
