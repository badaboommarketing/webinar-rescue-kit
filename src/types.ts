export interface WebinarInput {
  title: string;
  topic: string;
  targetAudience: string;
  speakerName: string;
  speakerCredentials: string;
  companyName: string;
  painPoint: string;
  mainPromise: string;
  dateTime: string;
  duration: string;
  format: "live" | "recorded" | "hybrid";
  platform: string;
  callToAction: string;
  productService: string;
  industry: string;
  uniqueAngle: string;
}

export interface EmailContent {
  label: string;
  subject: string;
  preheader: string;
  body: string;
  sendTiming: string;
}

export interface AdAngle {
  platform: string;
  headline: string;
  body: string;
  cta: string;
  targetingNotes: string;
}

export interface LandingPageCopy {
  headline: string;
  subheadline: string;
  bullets: string[];
  ctaButton: string;
  socialProofNote: string;
  urgencyElement: string;
}

export interface Positioning {
  angle: string;
  differentiation: string;
  valueProposition: string;
  audienceInsight: string;
}

export interface GeneratedKit {
  executiveSnapshot: string;
  rescueScore: RescueScore;
  positioning: Positioning;
  landingPage: LandingPageCopy;
  emailSequence: EmailContent[];
  postWebinarFollowUp: EmailContent[];
  adAngles: AdAngle[];
  salesHandoff: string[];
  productionChecklist: string[];
  riskFlags: string[];
}

export interface RescueScore {
  score: number;
  label: "Emergency Rescue" | "Needs Funnel Build" | "Promotion Ready" | "Launch Ready";
  recommendedOffer: string;
  rationale: string[];
  nextActions: string[];
}

export interface LeadInfo {
  name: string;
  email: string;
  company: string;
  website: string;
  timeline: string;
  biggestBlocker: string;
  budgetRange: string;
  wantsHelp: "yes" | "maybe" | "no";
  consent: boolean;
}

export interface LeadPayload {
  lead: LeadInfo;
  input: WebinarInput;
  generatedAt: string;
  utm: Record<string, string>;
}
