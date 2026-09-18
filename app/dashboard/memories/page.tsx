import Header from "@/components/Header";

export default function Memories() {
  return (
    <>
      <Header />
      <main className="section">
        <div className="container">
          <p className="gold text-sm font-bold">بعد المناسبة</p>
          <h1 className="serif text-5xl mt-2">كتاب الذكريات</h1>
          <p className="text-[#756f68] mt-4 max-w-2xl">مكان واحد لصور وفيديوهات وتهاني الضيوف. يمكن تشغيله عبر QR بعد الحفل.</p>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {["صور الضيوف","الفيديوهات","التهاني"].map((x,i)=>(
              <div key={x} className="bg-white border border-[#e9e3dc] rounded-3xl p-7">
                <div className="serif text-4xl gold">{[32,7,48][i]}</div>
                <h2 className="font-bold mt-5">{x}</h2>
                <p className="text-sm text-[#756f68] mt-2">بانتظار ربط التخزين السحابي في نسخة الإنتاج.</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}