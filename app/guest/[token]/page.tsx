import { notFound } from 'next/navigation';
import { db } from '@/lib/server-db';
import GuestRSVP from '@/components/GuestRSVP';
export default async function GuestPage({params}:{params:Promise<{token:string}>}){const {token}=await params;const guest=(await db.guests()).find(g=>g.token===token);if(!guest)notFound();const inv=(await db.invitations())[guest.invitationSlug];if(!inv)notFound();return <GuestRSVP guest={guest} invitation={inv}/>}
