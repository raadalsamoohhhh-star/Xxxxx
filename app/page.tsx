import Link from "next/link";
import Header from "@/components/Header";
import InvitationPreview from "@/components/InvitationPreview";

const features = [
  ["محرر تفاعلي", "عدّل الدعوة وشاهد النتيجة مباشرة على الهاتف والكمبيوتر."],
  ["ضيوف وRSVP", "روابط عامة وشخصية وعائلية، مع المرافقين والملاحظات."],
  ["قاعة ذكية", "طاولات، مقاعد وQR لمساعدة الضيف على الوصول إلى مكانه."],
  ["تجربة كاملة", "موسيقى، صور، فيديو، خريطة، تقويم وعدّاد للمناسبة."],
  ["ذكريات", "اجمع صور الضيوف وفيديوهاتهم وتهانيهم بعد المناسبة."],
  ["قوالب مرنة", "كل تصميم يتحول إلى قالب تفاعلي قابل للتخصيص."]
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="section">
          <div className="container grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block rounded-full bg-white border border-[#e9e3dc] px-4 py-2 text-xs mb-6">دعوات إلكترونية فاخرة · دعوتي برو</span>
              <h1 className="serif text-5xl md:text-7xl leading-[1.05] font-bold max-w-2xl">
                دعوتك تبدأ بفكرة، <span className="gold">وتصبح تجربة.</span>
              </h1>
              <p className="mt-7 text-lg text-[#756f68] leading-8 max-w-xl">
                صمّم دعوة إلكترونية تفاعلية، خصّصها كما تريد، شاركها مع ضيوفك، وتابع الحضور من مكان واحد.
              </p>
              <div className="mt-8 flex gap-3 flex-wrap">
                <Link href="/templates" className="btn btn-primary">استعرض القوالب</Link>
                <Link href="/register" className="btn btn-light">ابدأ مجانًا</Link>
              </div>
              <div className="mt-10 flex gap-8 text-sm text-[#756f68]">
                <span>✓ عربي وEnglish</span><span>✓ Mobile-first</span><span>✓ RSVP</span>
              </div>
            </div>
            <InvitationPreview />
          </div>
        </section>

        <section id="features" className="section bg-white border-y border-[#e9e3dc]">
          <div className="container">
            <p className="text-sm gold font-bold">منصة متكاملة</p>
            <h2 className="serif text-4xl mt-3">كل شيء بعد اختيار القالب.</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
              {features.map(([t,d],i) => (
                <div key={t} className="rounded-3xl border border-[#e9e3dc] p-7 hover:-translate-y-1 transition">
                  <div className="serif text-2xl gold">0{i+1}</div>
                  <h3 className="font-bold text-lg mt-5">{t}</h3>
                  <p className="text-[#756f68] mt-3 leading-7">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="section">
          <div className="container">
            <div className="max-w-2xl">
              <p className="gold text-sm font-bold">ثلاث خطوات</p>
              <h2 className="serif text-4xl mt-3">من القالب إلى رابط الدعوة.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {["اختر التصميم", "خصّص التفاصيل", "انشر وشارك"].map((x,i) =>
                <div key={x} className="bg-white rounded-3xl p-7 border border-[#e9e3dc]">
                  <div className="text-3xl serif gold">0{i+1}</div>
                  <h3 className="font-bold mt-6">{x}</h3>
                  <p className="text-sm text-[#756f68] mt-3 leading-6">
                    {i===0 ? "ابدأ من قالب جاهز، ثم غيّر الأسلوب حسب مناسبتك." : i===1 ? "الأسماء، التاريخ، الصور، الموسيقى، الخريطة والـ RSVP." : "احصل على رابط قصير وشاركه مباشرة مع الضيوف."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}