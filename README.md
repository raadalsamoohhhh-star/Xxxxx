# دَعوَتي — Invitation Platform

هذه نسخة MVP أولية لمنصة دعوات إلكترونية عربية، مبنية بحيث يكون نظام القوالب منفصلًا عن بيانات الدعوة.

## التشغيل

```bash
npm install
npm run dev
```

ثم افتح:
http://localhost:3000

## المسارات

- `/` الصفحة الرئيسية
- `/templates` مكتبة القوالب
- `/create/royal-gold` محرر الدعوة
- `/create/minimal-ivory`
- `/create/midnight`

## الخطوة التالية

هذه النسخة هي الواجهة والأساس المعماري الأول. قبل الإنتاج يجب إضافة:
- PostgreSQL + Prisma
- Auth
- حفظ الدعوات
- رفع الصور
- صفحة الدعوة العامة `/i/[slug]`
- RSVP
- Google Maps
- Music
- Countdown
- لوحة Admin
- إدارة القوالب من لوحة الإدارة
- الدفع
- حماية API والتحقق من الصلاحيات

## إدخال تصاميم جديدة

القوالب معرفة في `lib/templates.ts`. التصميم الفعلي يجب أن يكون React component أو مجموعة components أصلية، وليس مجرد صورة. يمكن لاحقًا بناء نظام Template Schema يسمح بتسجيل:
- أقسام القالب
- الحقول الديناميكية
- الخطوط
- الألوان
- animations
- خيارات الظهور

لا تستخدم أصولًا محمية بحقوق نشر من موقع مرجعي بدون ترخيص. الصور الحالية في الـ demo هي صور مرجعية مستضافة خارجيًا، ويجب استبدالها بأصول تملك حقوق استخدامها قبل الإطلاق التجاري.

## محرر الدعوات الديناميكي — V5
النسخة الحالية تربط بيانات المناسبة بالقالب مباشرة: الأسماء، التاريخ، الوقت، المكان، النص، صورة الغلاف، رابط الخريطة، الموسيقى، والرابط المختصر. المعاينة تتحدث لحظيًا، والحفظ يعمل محليًا عبر Local Storage، وصفحة `/i/[slug]` تقرأ الدعوة المحفوظة وتعرضها بالقالب نفسه.

> ملاحظة: الحفظ المحلي مناسب للـMVP فقط. للإنتاج يجب استبداله بقاعدة بيانات وAPI ومصادقة وصلاحيات.

## V8 — الحسابات والبيانات
V8 adds server-side JSON persistence for local deployment, cookie sessions, registration/login/logout, per-user invitation ownership, protected invitation creation, dashboard statistics, and persisted RSVP records. This is a development architecture: replace the JSON repository with PostgreSQL/Prisma and use a production password-hashing/KMS/secrets setup before public launch.

## V9 — Guest & Seating Operations

- Guest records are now separate from public RSVP submissions.
- Every guest can receive a private RSVP URL at `/guest/[token]`.
- Guest status: pending / confirmed / declined.
- Guest phone, email, seats and notes are stored server-side.
- Table management is persisted per invitation.
- Guests can be assigned to tables with capacity validation.
- Calendar export is available from `/api/calendar?slug=...` as an ICS file.
- Dashboard navigation now exposes guest and seating management.

The current persistence layer is intentionally file-backed for local development. For production deployment, replace it with PostgreSQL (or another managed database), object storage, rate limiting, secure password hashing (Argon2/bcrypt), CSRF/origin protections where applicable, and transactional writes.

## V10 media layer
- Authenticated media uploads to `public/uploads` for local/self-hosted deployments.
- Gallery management in the invitation editor.
- Public invitation gallery, hero/video media, audio player and QR share block.
- Upload limits: 20 MB per file, 12 files/request, image/video/audio MIME allowlist.


## V11 — Professional invitation editor
- Three editor modes: content, design and sections.
- Per-invitation accent/background/font/radius settings.
- Drag-like section ordering using up/down controls.
- Section visibility controls for story, schedule, gallery, venue, RSVP and wishes.
- Live phone-oriented preview styling.
- Video and Teatro templates consume section order and gallery data.
- Public invitations now use the same theme and section configuration.

V11 still uses the development JSON repository. Production deployment should move persistence/media to managed infrastructure and add rate limiting, validation, moderation and audit logging.
