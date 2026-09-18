import { promises as fs } from 'fs';
import path from 'path';

export type User = { id:string; name:string; email:string; passwordHash:string; createdAt:string };
export type Session = { token:string; userId:string; expiresAt:string };
export type StoredInvitation = import('./invitation').InvitationData & { ownerId:string; published:boolean; createdAt:string; updatedAt:string };
export type RSVP = { id:string; slug:string; name:string; status:'yes'|'no'; guests:number; note:string; createdAt:string; token?:string; tableId?:string; seat?:number };
export type Guest = { id:string; invitationSlug:string; name:string; phone:string; email:string; seats:number; status:'pending'|'confirmed'|'declined'; note:string; token:string; tableId?:string; seat?:number; createdAt:string; updatedAt:string };
export type Table = { id:string; invitationSlug:string; name:string; seats:number; createdAt:string; updatedAt:string };

type Store = {
  users():Promise<User[]>; saveUsers(v:User[]):Promise<void>;
  sessions():Promise<Session[]>; saveSessions(v:Session[]):Promise<void>;
  invitations():Promise<Record<string,StoredInvitation>>; saveInvitations(v:Record<string,StoredInvitation>):Promise<void>;
  rsvps():Promise<RSVP[]>; saveRsvps(v:RSVP[]):Promise<void>;
  guests():Promise<Guest[]>; saveGuests(v:Guest[]):Promise<void>;
  tables():Promise<Table[]>; saveTables(v:Table[]):Promise<void>;
};

const dataDir = path.join(process.cwd(),'data');
const paths = {
  users:path.join(dataDir,'users.json'), sessions:path.join(dataDir,'sessions.json'),
  invitations:path.join(dataDir,'invitations.json'), rsvps:path.join(dataDir,'rsvps.json'),
  guests:path.join(dataDir,'guests.json'), tables:path.join(dataDir,'tables.json')
};

async function readJson<T>(file:string, fallback:T):Promise<T>{try{return JSON.parse(await fs.readFile(file,'utf8')) as T}catch{return fallback}}
async function writeJson<T>(file:string,data:T){await fs.mkdir(dataDir,{recursive:true});const tmp=`${file}.tmp`;await fs.writeFile(tmp,JSON.stringify(data,null,2),'utf8');await fs.rename(tmp,file)}

const fileStore:Store = {
  users:()=>readJson(paths.users,[]), saveUsers:v=>writeJson(paths.users,v),
  sessions:()=>readJson(paths.sessions,[]), saveSessions:v=>writeJson(paths.sessions,v),
  invitations:()=>readJson(paths.invitations,{}), saveInvitations:v=>writeJson(paths.invitations,v),
  rsvps:()=>readJson(paths.rsvps,[]), saveRsvps:v=>writeJson(paths.rsvps,v),
  guests:()=>readJson(paths.guests,[]), saveGuests:v=>writeJson(paths.guests,v),
  tables:()=>readJson(paths.tables,[]), saveTables:v=>writeJson(paths.tables,v),
};

let pgStorePromise:Promise<Store>|null=null;

async function createPgStore():Promise<Store>{
  const pg = await import('pg');
  const pool = new pg.Pool({connectionString:process.env.DATABASE_URL, max:10, idleTimeoutMillis:30000, connectionTimeoutMillis:10000, ssl:process.env.DATABASE_SSL==='false'?false:{rejectUnauthorized:false}});
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS invitations (slug TEXT PRIMARY KEY, owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, data JSONB NOT NULL, published BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS rsvps (id TEXT PRIMARY KEY, slug TEXT NOT NULL REFERENCES invitations(slug) ON DELETE CASCADE, name TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('yes','no')), guests INTEGER NOT NULL, note TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL, token TEXT, table_id TEXT, seat INTEGER);
    CREATE TABLE IF NOT EXISTS guests (id TEXT PRIMARY KEY, invitation_slug TEXT NOT NULL REFERENCES invitations(slug) ON DELETE CASCADE, name TEXT NOT NULL, phone TEXT NOT NULL, email TEXT NOT NULL, seats INTEGER NOT NULL, status TEXT NOT NULL CHECK(status IN ('pending','confirmed','declined')), note TEXT NOT NULL, token TEXT UNIQUE NOT NULL, table_id TEXT, seat INTEGER, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL);
    CREATE TABLE IF NOT EXISTS tables_ (id TEXT PRIMARY KEY, invitation_slug TEXT NOT NULL REFERENCES invitations(slug) ON DELETE CASCADE, name TEXT NOT NULL, seats INTEGER NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL);
    CREATE INDEX IF NOT EXISTS invitations_owner_idx ON invitations(owner_id);
    CREATE INDEX IF NOT EXISTS rsvps_slug_idx ON rsvps(slug);
    CREATE INDEX IF NOT EXISTS guests_invitation_idx ON guests(invitation_slug);
    CREATE INDEX IF NOT EXISTS tables_invitation_idx ON tables_(invitation_slug);
  `);
  const map = <T>(r:any):T=>r as T;
  return {
    async users(){return map<User[]>( (await pool.query('SELECT id,name,email,password_hash AS "passwordHash",created_at AS "createdAt" FROM users ORDER BY created_at')).rows)},
    async saveUsers(v){const c=await pool.connect();try{await c.query('BEGIN');const ids=v.map(x=>x.id);if(ids.length)await c.query(`DELETE FROM users WHERE id <> ALL($1::text[])`,[ids]);else await c.query('DELETE FROM users');for(const u of v)await c.query('INSERT INTO users(id,name,email,password_hash,created_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,password_hash=EXCLUDED.password_hash,created_at=EXCLUDED.created_at',[u.id,u.name,u.email,u.passwordHash,u.createdAt]);await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}},
    async sessions(){return map<Session[]>( (await pool.query('SELECT token,user_id AS "userId",expires_at AS "expiresAt" FROM sessions')).rows)},
    async saveSessions(v){const c=await pool.connect();try{await c.query('BEGIN');if(v.length){await c.query(`DELETE FROM sessions WHERE token <> ALL($1::text[])`,[v.map(x=>x.token)])}else await c.query('DELETE FROM sessions');for(const x of v)await c.query('INSERT INTO sessions(token,user_id,expires_at) VALUES($1,$2,$3) ON CONFLICT(token) DO UPDATE SET user_id=EXCLUDED.user_id,expires_at=EXCLUDED.expires_at',[x.token,x.userId,x.expiresAt]);await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}},
    async invitations(){const rows=(await pool.query('SELECT slug,owner_id AS "ownerId",data,published,created_at AS "createdAt",updated_at AS "updatedAt" FROM invitations')).rows;return Object.fromEntries(rows.map((r:any)=>[r.slug,{...r.data,slug:r.slug,ownerId:r.ownerId,published:r.published,createdAt:r.createdAt,updatedAt:r.updatedAt}]))},
    async saveInvitations(v){const c=await pool.connect();try{await c.query('BEGIN');const keys=Object.keys(v);if(keys.length)await c.query(`DELETE FROM invitations WHERE slug <> ALL($1::text[])`,[keys]);else await c.query('DELETE FROM invitations');for(const i of Object.values(v)){const {ownerId,published,createdAt,updatedAt,...data}=i;await c.query('INSERT INTO invitations(slug,owner_id,data,published,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(slug) DO UPDATE SET owner_id=EXCLUDED.owner_id,data=EXCLUDED.data,published=EXCLUDED.published,updated_at=EXCLUDED.updated_at',[i.slug,ownerId,JSON.stringify(data),published,createdAt,updatedAt])}await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}},
    async rsvps(){return map<RSVP[]>( (await pool.query('SELECT id,slug,name,status,guests,note,created_at AS "createdAt",token,table_id AS "tableId",seat FROM rsvps')).rows)},
    async saveRsvps(v){const c=await pool.connect();try{await c.query('BEGIN');const ids=v.map(x=>x.id);if(ids.length)await c.query(`DELETE FROM rsvps WHERE id <> ALL($1::text[])`,[ids]);else await c.query('DELETE FROM rsvps');for(const r of v)await c.query('INSERT INTO rsvps(id,slug,name,status,guests,note,created_at,token,table_id,seat) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(id) DO UPDATE SET slug=EXCLUDED.slug,name=EXCLUDED.name,status=EXCLUDED.status,guests=EXCLUDED.guests,note=EXCLUDED.note,token=EXCLUDED.token,table_id=EXCLUDED.table_id,seat=EXCLUDED.seat',[r.id,r.slug,r.name,r.status,r.guests,r.note,r.createdAt,r.token||null,r.tableId||null,r.seat??null]);await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}},
    async guests(){return map<Guest[]>( (await pool.query('SELECT id,invitation_slug AS "invitationSlug",name,phone,email,seats,status,note,token,table_id AS "tableId",seat,created_at AS "createdAt",updated_at AS "updatedAt" FROM guests')).rows)},
    async saveGuests(v){const c=await pool.connect();try{await c.query('BEGIN');const ids=v.map(x=>x.id);if(ids.length)await c.query(`DELETE FROM guests WHERE id <> ALL($1::text[])`,[ids]);else await c.query('DELETE FROM guests');for(const g of v)await c.query('INSERT INTO guests(id,invitation_slug,name,phone,email,seats,status,note,token,table_id,seat,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT(id) DO UPDATE SET invitation_slug=EXCLUDED.invitation_slug,name=EXCLUDED.name,phone=EXCLUDED.phone,email=EXCLUDED.email,seats=EXCLUDED.seats,status=EXCLUDED.status,note=EXCLUDED.note,token=EXCLUDED.token,table_id=EXCLUDED.table_id,seat=EXCLUDED.seat,updated_at=EXCLUDED.updated_at',[g.id,g.invitationSlug,g.name,g.phone,g.email,g.seats,g.status,g.note,g.token,g.tableId||null,g.seat??null,g.createdAt,g.updatedAt]);await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}},
    async tables(){return map<Table[]>( (await pool.query('SELECT id,invitation_slug AS "invitationSlug",name,seats,created_at AS "createdAt",updated_at AS "updatedAt" FROM tables_')).rows)},
    async saveTables(v){const c=await pool.connect();try{await c.query('BEGIN');const ids=v.map(x=>x.id);if(ids.length)await c.query(`DELETE FROM tables_ WHERE id <> ALL($1::text[])`,[ids]);else await c.query('DELETE FROM tables_');for(const t of v)await c.query('INSERT INTO tables_(id,invitation_slug,name,seats,created_at,updated_at) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO UPDATE SET invitation_slug=EXCLUDED.invitation_slug,name=EXCLUDED.name,seats=EXCLUDED.seats,updated_at=EXCLUDED.updated_at',[t.id,t.invitationSlug,t.name,t.seats,t.createdAt,t.updatedAt]);await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}},
  };
}

export async function getDb():Promise<Store>{
  if(!process.env.DATABASE_URL)return fileStore;
  if(!pgStorePromise)pgStorePromise=createPgStore().catch(err=>{pgStorePromise=null;throw err});
  return pgStorePromise;
}
export const db = {
  users:()=>getDb().then(x=>x.users()), saveUsers:(v:User[])=>getDb().then(x=>x.saveUsers(v)),
  sessions:()=>getDb().then(x=>x.sessions()), saveSessions:(v:Session[])=>getDb().then(x=>x.saveSessions(v)),
  invitations:()=>getDb().then(x=>x.invitations()), saveInvitations:(v:Record<string,StoredInvitation>)=>getDb().then(x=>x.saveInvitations(v)),
  rsvps:()=>getDb().then(x=>x.rsvps()), saveRsvps:(v:RSVP[])=>getDb().then(x=>x.saveRsvps(v)),
  guests:()=>getDb().then(x=>x.guests()), saveGuests:(v:Guest[])=>getDb().then(x=>x.saveGuests(v)),
  tables:()=>getDb().then(x=>x.tables()), saveTables:(v:Table[])=>getDb().then(x=>x.saveTables(v)),
};
