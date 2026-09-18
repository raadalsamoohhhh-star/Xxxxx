/**
 * Feature contract for every invitation template.
 * The production version can persist this JSON in PostgreSQL.
 */
export type InvitationFeatureConfig = {
  animatedOpening: boolean;
  countdown: boolean;
  gallery: boolean;
  video: boolean;
  music: boolean;
  maps: boolean;
  calendar: boolean;
  rsvp: boolean;
  guestTracking: boolean;
  personalizedLinks: "none" | "guest" | "family" | "both";
  whatsapp: boolean;
  qrCheckIn: boolean;
  seating: boolean;
  memories: boolean;
  multilingual: string[];
  sections: string[];
};

export const premiumWeddingConfig: InvitationFeatureConfig = {
  animatedOpening: true,
  countdown: true,
  gallery: true,
  video: true,
  music: true,
  maps: true,
  calendar: true,
  rsvp: true,
  guestTracking: true,
  personalizedLinks: "both",
  whatsapp: true,
  qrCheckIn: true,
  seating: true,
  memories: true,
  multilingual: ["ar", "en"],
  sections: ["cover", "story", "families", "details", "gallery", "location", "rsvp", "wishes"]
};
