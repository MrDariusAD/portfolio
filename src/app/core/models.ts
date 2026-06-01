/* ============================================================================
   Domain models — shared between the Angular app and the Payload CMS schemas.
   These TypeScript interfaces mirror the Payload collections 1:1 so the local
   mock JSON (src/assets/cms/*.json) and a live Payload API are interchangeable.
   ========================================================================== */

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'DevOps'
  | 'Databases'
  | 'Tools_Design';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  /** 1–100 — drives the proficiency meter. */
  proficiency: number;
  tags: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortSummary: string;
  fullDescription: string;
  techStack: string[];
  githubUrl?: string;
  linkedInUrl?: string;
  emailUrl?: string;
  discordUrl?: string;
  hasPrivacyPolicy: boolean;
  privacyPolicyMarkdown?: string;
  hasGdprInstructions: boolean;
  gdprInstructionsMarkdown?: string;
  /** Optional emoji / icon shorthand used by the gallery card header. */
  icon?: string;
  /** Optional ordered lifecycle states (e.g. INT.PrintIt state machine). */
  lifecycle?: string[];
}

export interface TimelineMilestone {
  id: string;
  period: string;
  organisation: string;
  role: string;
  title: string;
  summary: string;
  responsibilities: string[];
  techStack: string[];
  /** Marks the current/active tenure for the timeline node styling. */
  current?: boolean;
  /**
   * Optional nested roles/projects within the same employer/tenure. Rendered
   * indented under the parent on the timeline and collapsible.
   */
  children?: TimelineMilestone[];
}

export interface SocialLink {
  id: string;
  label: string;
  /** PrimeIcons class, e.g. `pi pi-github`. */
  icon: string;
  url: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  introduction: string;
  socials: SocialLink[];
  certifications: string[];
  languages: { language: string; level: string }[];
}
