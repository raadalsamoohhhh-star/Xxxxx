import {NextResponse} from 'next/server';
import {mkdir,writeFile} from 'fs/promises';import path from 'path';import {randomUUID} from 'crypto';
import {getCurrentUser} from '@/lib/auth';
const allowed=new Map([['image/jpeg','jpg'],['image/png','png'],['image/webp','webp'],['image/gif','gif'],['video/mp4','mp4'],['audio/mpeg','mp3'],['audio/wav','wav'],['audio/ogg','ogg']]);
const maxBytes=20*1024*1024;
export async function POST(req:Request){
  const user=await getCurrentUser();if(!user)return NextResponse.json({error:'غير مصرح'},{status:401});
  if(process.env.NODE_ENV==='production'&&process.env.MEDIA_STORAGE_MODE!=='local')return NextResponse.json({error:'تخزين الوسائط السحابي غير مفعّل. اضبط MEDIA_STORAGE_MODE أو اربط R2/S3 قبل الإنتاج.'},{status:503});
  const form=await req.formData();const files=form.getAll('files').filter((x):x is File=>x instanceof File);if(!files.length)return NextResponse.json({error:'لم يتم اختيار ملفات'},{status:400});if(files.length>12)return NextResponse.json({error:'الحد الأقصى 12 ملفًا في المرة الواحدة'},{status:400});
  for(const file of files)if(!allowed.has(file.type)||file.size>maxBytes)return NextResponse.json({error:`الملف غير صالح أو كبير جدًا: ${file.name}`},{status:415});
  const dir=path.join(process.cwd(),'public','uploads');await mkdir(dir,{recursive:true});const urls:string[]=[];
  for(const file of files){const ext=allowed.get(file.type)!;const name=`${user.id}-${randomUUID()}.${ext}`;await writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()));urls.push(`/uploads/${name}`);}
  return NextResponse.json({urls});
}
