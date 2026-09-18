export function assertProductionConfig(){
  if(process.env.NODE_ENV!=='production')return;
  const required=['AUTH_PEPPER','ADMIN_SESSION_SECRET','ADMIN_EMAIL','ADMIN_PASSWORD','DATABASE_URL','NEXT_PUBLIC_APP_URL'];
  const missing=required.filter(k=>!process.env[k]);
  if(missing.length)throw new Error(`Missing production environment variables: ${missing.join(', ')}`);
  if((process.env.AUTH_PEPPER||'').length<32||(process.env.ADMIN_SESSION_SECRET||'').length<32)throw new Error('Production auth secrets must be at least 32 characters.');
  if(process.env.MEDIA_STORAGE_MODE!=='r2'&&process.env.MEDIA_STORAGE_MODE!=='s3')throw new Error('Production media storage must be configured as r2 or s3.');
}
