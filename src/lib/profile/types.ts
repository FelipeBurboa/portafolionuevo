export type Profile = {
  notice: string;
  bio: string[];
  timeline: { period: string; title: string; detail: string }[];
  skills: string[];
  resumeHref: string | null;
};

export type ContactProfile = {
  notice: string;
  email: string;
  github: string | null;
  linkedin: string | null;
};
