import {NextResponse} from 'next/server';
import {getDb} from '@/lib/server-db';
export const dynamic='force-dynamic';
export async function GET(){try{await getDb();return NextResponse.json({ok:true,storage:process.env.DATABASE_URL?'postgresql':'local-dev'});}catch{return NextResponse.json({ok:false},{status:503});}}
