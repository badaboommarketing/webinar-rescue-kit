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

export interface ResearchRequestInput {
  companyName: string;
  companyWebsite: string;
  industry: string;
  targetAudience: string;
  proposedTopic: string;
  competitorsRaw: string;
}

export interface ResearchSource {
  title: string;
  url: string;
  snippet?: string;
  query?: string;
  sourceType?: "company" | "competitor" | "event" | "market" | "other";
}

export interface CompetitorProfile {
  name: string;
  url?: string;
  positioning?: string;
  eventPatterns: string[];
  notableHooks: string[];
  proofClaims: string[];
  sources: ResearchSource[];
}

export interface CompetitorEventSignal {
  competitor: string;
  eventName: string;
  eventType: "webinar" | "workshop" | "virtual-event" | "demo" | "conference" | "unknown";
  estimatedCadence: string;
  evidence: string;
  sourceUrl?: string;
}

export interface CompanyResearch {
  name: string;
  website?: string;
  positioning?: string;
  offers: string[];
  audienceSignals: string[];
  proofSignals: string[];
  gaps: string[];
}

export interface ResearchBrief {
  generatedAt: string;
  company: CompanyResearch;
  competitors: CompetitorProfile[];
  competitorEventSignals: CompetitorEventSignal[];
  marketPatterns: string[];
  strategicGaps: string[];
  sourceBackedAssumptions: string[];
  unansweredQuestions: string[];
  recommendedAngles: string[];
  sources: ResearchSource[];
  confidence: "low" | "medium" | "high";
}

export interface ResearchIntelligence {
  status: "missing" | "attached";
  confidence: "low" | "medium" | "high";
  companyPositioning: string;
  competitorEventCadence: CompetitorEventSignal[];
  marketPatterns: string[];
  strategicGaps: string[];
  sourceBackedAssumptions: string[];
  unansweredQuestions: string[];
  sources: ResearchSource[];
}

export interface WebinarStrategy {
  topicVerdict: string;
  strategicThesis: string;
  recommendedAngle: string;
  differentiation: string;
  formatRecommendation: string;
  contentPillars: string[];
  researchDrivenQuestions: string[];
}

export interface CampaignBrief {
  oneLineBrief: string;
  directorNotes: string[];
  landingPageStrategy: string;
  emailStrategy: string;
  paidMediaStrategy: string;
  salesFollowUpStrategy: string;
  creativeGuardrails: string[];
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
  researchIntelligence: ResearchIntelligence;
  webinarStrategy: WebinarStrategy;
  campaignBrief: CampaignBrief;
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
  research?: ResearchBrief | null;
  generatedAt: string;
  utm: Record<string, string>;
}
