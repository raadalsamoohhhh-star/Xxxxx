# دعوتي برو — تشغيل V15

## محليًا
1. ثبّت Node.js 20+.
2. نفّذ `npm install`.
3. انسخ `.env.example` إلى `.env.local`.
4. اترك `DATABASE_URL` فارغًا للتجربة المحلية بالملفات، أو ضع PostgreSQL للبيئة الحقيقية.
5. شغّل `npm run dev`.
6. افتح `http://localhost:3000`.

## PostgreSQL
عند وضع `DATABASE_URL` يستخدم التطبيق PostgreSQL تلقائيًا وينشئ الجداول والفهارس عند أول اتصال. لا تستخدم تخزين JSON في الإنتاج.

## فحص المشروع
- `npm run typecheck`
- `npm test`
- `npm run build`

## قبل الإنتاج
- غيّر `AUTH_PEPPER` و`ADMIN_SESSION_SECRET` إلى أسرار عشوائية قوية.
- غيّر بيانات Admin الافتراضية إلى قيم خاصة بك.
- اربط تخزين وسائط دائم (R2/S3 أو مزود مشابه) بدل `public/uploads`.
- اضبط `NEXT_PUBLIC_APP_URL` والدومين الحقيقي.
- فعّل HTTPS.
- راقب الأخطاء والسجلات والنسخ الاحتياطية لقاعدة البيانات.
