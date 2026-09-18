import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[#e9e3dc] bg-[#fbfaf8]/90 backdrop-blur sticky top-0 z-50">
      <div className="container h-18 flex items-center justify-between">
        <Link href="/" className="serif text-2xl font-bold">دعوتي برو</Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/templates">القوالب</Link>
          <Link href="/dashboard">لوحة التحكم</Link>
          <a href="/#how">كيف تعمل؟</a>
          <a href="/#features">المميزات</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden sm:inline-flex btn btn-light text-sm">دخول</Link>
          <Link href="/templates" className="btn btn-primary text-sm">أنشئ دعوتك</Link>
        </div>
      </div>
    </header>
  );
}