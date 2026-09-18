"use client";
import type { CSSProperties, ReactNode } from "react";
import type { InvitationData } from "@/lib/invitation";

type InviteThemeVars = CSSProperties & {
  "--invite-accent": string;
  "--invite-bg": string;
  "--invite-title-size": string;
};

export default function InvitationTheme({ data, children }: { data: InvitationData; children: ReactNode }) {
  const d = data.design;
  const style: InviteThemeVars = {
    "--invite-accent": d.accent || "#9a7650",
    "--invite-bg": d.background || "#fbfaf8",
    "--invite-title-size": d.titleSize === "compact" ? "0.92em" : "1em"
  };

  return (
    <div className={`invite-theme font-${d.font} radius-${d.radius}`} style={style}>
      {children}
    </div>
  );
}
