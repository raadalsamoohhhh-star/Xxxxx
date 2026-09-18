import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
test('critical project files exist',()=>{
  for(const f of ['app/api/invitations/route.ts','app/api/rsvp/route.ts','app/api/guest-rsvp/route.ts','app/api/uploads/route.ts','lib/server-db.ts','lib/auth.ts','lib/template-registry.ts'])assert.equal(fs.existsSync(path.join(root,f)),true,f);
});
test('public invitation does not use localStorage fallback',()=>{const s=fs.readFileSync(path.join(root,'app/i/[slug]/page.tsx'),'utf8');assert.equal(s.includes('getInvitation'),false);assert.equal(s.includes('defaultInvitation'),false);});
test('rsvp read endpoint requires authenticated owner',()=>{const s=fs.readFileSync(path.join(root,'app/api/rsvp/route.ts'),'utf8');assert.match(s,/getCurrentUser/);assert.match(s,/ownerId!==u\.id/);});
test('password hashing is salted scrypt',()=>{const s=fs.readFileSync(path.join(root,'lib/auth.ts'),'utf8');assert.match(s,/scryptSync/);assert.match(s,/randomBytes\(16\)/);});
