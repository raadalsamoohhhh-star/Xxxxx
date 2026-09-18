# نشر دعوتي برو

## الهدف
المشروع يدعم الآن PostgreSQL عند ضبط `DATABASE_URL`. بدونها يعمل محليًا بملفات JSON فقط.

## قبل النشر
1. Node.js 20+.
2. PostgreSQL مُدار مع نسخ احتياطية.
3. تخزين ملفات دائم R2/S3؛ `public/uploads` للتطوير فقط.
4. متغيرات `.env` الحقيقية.
5. HTTPS ودومين.

## Vercel أو أي Node host
- `npm install`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm start`

## متغيرات الإنتاج
`DATABASE_URL`, `DATABASE_SSL`, `AUTH_PEPPER`, `ADMIN_SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_APP_URL`, `MEDIA_STORAGE_MODE`.

## ملاحظة الوسائط
واجهة الرفع الحالية تمنع التخزين المحلي في الإنتاج. قبل الإطلاق يجب ربط R2/S3 فعليًا، ثم جعل `/api/uploads` يعيد روابط التخزين السحابي.

## الهجرة من JSON
شغّل `node scripts/migrate-json-to-postgres.mjs` بعد ضبط `DATABASE_URL` إذا كانت لديك بيانات محلية تريد نقلها.
