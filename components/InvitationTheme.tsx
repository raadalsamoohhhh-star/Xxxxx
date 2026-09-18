"use client";
import { ReactNode } from "react";
import { InvitationData } from "@/lib/invitation";

export default function InvitationTheme({ data, children }: { data: InvitationData; children: ReactNode }) {
  const d = data.design || { accent: "#9a7650", background: "#fbfaf8", font: "serif", radius: "round" };
  return <div className={`invite-theme font-${d.font} radius-${d.radius}`} style={{ "--invite-accent": d.accent, "--invite-bg": d.background, "--invite-title-size": d.titleSize === "compact" ? "0.92em" : "1em" } as React.CSSProperties}>{children}</div>;
}
