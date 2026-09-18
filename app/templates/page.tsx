import Header from "@/components/Header";
import Link from "next/link";
import { categories } from "@/lib/templates";
import { getPublicTemplates } from "@/lib/template-registry";

export default function TemplatesPage() {
  const templates = getPublicTemplates();
  return (
    <>
      <Header />
      <main className="section">
        <div className="container">
          <div className="max-w-2xl">
            <p className="gold text-sm font-bold">القوالب</p>
            <h1 className="serif text-5xl mt-3">اختَر الشخصية قبل التفاصيل.</h1>
            <p className="text-[#756f68] mt-5 leading-7">هذه بداية مكتبة القوالب. لاحقًا يمكن إضافة القوالب من لوحة الإدارة دون تغيير المحرر.</p>
          </div>
          <div className="flex gap-2 flex-wrap mt-10">
            {categories.map(c => <button key={c} className="btn btn-light text-sm">{c}</button>)}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {templates.map(t => (
              <article key={t.id} className="bg-white border border-[#e9e3dc] rounded-[28px] overflow-hidden">
                <div className="h-80 overflow-hidden bg-[#eee]">
                  <img src={t.preview} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="serif text-2xl">{t.name}</h2>
                    <span className="text-xs text-[#756f68]">{t.category}</span>
                  </div>
                  <p className="text-sm text-[#756f68] mt-3 leading-6">{t.description}</p>
                  <Link href={`/create/${t.id}`} className="btn btn-primary w-full mt-5">استخدم القالب</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}