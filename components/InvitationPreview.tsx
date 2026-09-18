type Props = {
  style?: "classic" | "editorial" | "night";
  groom?: string;
  bride?: string;
  date?: string;
  venue?: string;
};

export default function InvitationPreview({
  style = "classic",
  groom = "محمد",
  bride = "لينا",
  date = "20 أكتوبر 2026",
  venue = "قاعة النخبة — عمّان"
}: Props) {
  const night = style === "night";
  const editorial = style === "editorial";
  return (
    <div className={`relative overflow-hidden rounded-[28px] min-h-[590px] shadow-2xl ${night ? "bg-[#171719] text-white" : "bg-[#f4eee6] text-[#29231e]"}`}>
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#d6b58a,transparent_35%),radial-gradient(circle_at_80%_80%,#8f7659,transparent_30%)]" />
      <div className="relative min-h-[590px] p-8 flex flex-col items-center justify-center text-center">
        <p className="text-xs tracking-[.35em] uppercase opacity-70">دعوة خاصة</p>
        <div className="my-8 h-px w-20 bg-current opacity-30" />
        <p className="text-sm opacity-70 mb-4">بكل الحب والفرح</p>
        <h2 className={`serif ${editorial ? "text-5xl" : "text-6xl"} leading-tight`}>
          {groom} <span className="gold">&</span> {bride}
        </h2>
        <p className="mt-8 text-sm opacity-80">{date}</p>
        <p className="mt-2 text-sm opacity-60">{venue}</p>
        <div className="mt-12 rounded-full border border-current/20 px-6 py-3 text-xs">تأكيد الحضور</div>
      </div>
    </div>
  );
}