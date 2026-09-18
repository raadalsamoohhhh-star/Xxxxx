import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دَعوَتي — دعوات إلكترونية فاخرة",
  description: "منصة عربية لإنشاء دعوات إلكترونية تفاعلية."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}