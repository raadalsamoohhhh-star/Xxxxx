import Link from "next/link";
import Header from "@/components/Header";
import { isAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const cards = [
    ["1,248","المستخدمون"],
    ["3,942","الدعوات"],
    ["286","دعوات منشورة"],
    ["87%","معدل RSVP"]
  ];
  return (
    <>
      <Header />
      <main className="section">
        <div className="container">
          <div className="flex justify-between items-end">
            <div><p className="gold text-sm font-bold">Admin</p><h1 className="serif text-5xl mt-2">لوحة الإدارة</h1></div>
            <span className="text-xs bg-[#f0e8df] px-3 py-2 rounded-full">مشرف</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {cards.map(([n,l])=><div key={l} className="bg-white border border-[#e9e3dc] rounded-3xl p-6"><div className="serif text-4xl">{n}</div><p className="text-sm text-[#756f68] mt-2">{l}</p></div>)}
          </div>
          <Link href="/admin/templates" className="inline-block btn btn-primary mt-8">إدارة مكتبة القوالب</Link><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {[
              ["إدارة القوالب","إضافة وتعديل وإخفاء القوالب وميزات كل قالب."],
              ["المستخدمون","الحسابات، الدعوات، الخطط وحالة الحساب."],
              ["الطلبات والمدفوعات","متابعة الخطط والعمليات والمدفوعات."],
              ["المحتوى","الأقسام العامة، النصوص، الفئات والإعدادات."],
              ["الإحصائيات","الزيارات، فتح الدعوات، RSVP والتحويلات."],
              ["الأمان","الجلسات، الصلاحيات، السجل والتنبيهات."]
            ].map(([t,d])=><div key={t} className="bg-white border border-[#e9e3dc] rounded-3xl p-6"><h2 className="font-bold">{t}</h2><p className="text-sm text-[#756f68] mt-2 leading-6">{d}</p><button className="mt-5 text-sm gold">فتح القسم ←</button></div>)}
          </div>
        </div>
      </main>
    </>
  );
}