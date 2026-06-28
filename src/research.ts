import type {
  CampaignBrief,
  ResearchBrief,
  ResearchIntelligence,
  ResearchRequestInput,
  ResearchSource,
  WebinarInput,
  WebinarStrategy,
} from "./types";

export const sampleResearchBrief: ResearchBrief = {
  generatedAt: "2026-06-27T00:00:00.000Z",
  company: {
    name: "Acme Growth Co",
    website: "https://example.com",
    positioning:
      "B2B demand generation consultancy focused on webinar-led pipeline programs for mid-market SaaS teams.",
    offers: [
      "Webinar funnel audit",
      "Done-with-you event campaign buildout",
      "Sales handoff and follow-up optimization",
    ],
    audienceSignals: [
      "Demand generation leaders are under pressure to prove pipeline contribution, not registration volume.",
      "Mid-market SaaS teams often have marketing automation in place but weak post-event sales coordination.",
    ],
    proofSignals: [
      "Uses teardown-style education and practical templates rather than broad thought leadership.",
    ],
    gaps: [
      "Needs stronger public proof around attendee-to-pipeline conversion.",
      "Needs clearer differentiation from generic virtual event production vendors.",
    ],
  },
  competitors: [
    {
      name: "Pipeline Webinar Agency",
      url: "https://competitor.example/pipeline-webinars",
      positioning: "Full-service B2B webinar demand generation programs.",
      eventPatterns: [
        "Monthly educational webinars tied to demand-gen pain points.",
        "Quarterly benchmark/report webinars used as lead magnets.",
      ],
      notableHooks: [
        "Live funnel teardown",
        "Benchmark-based diagnosis",
        "Sales handoff clinic",
      ],
      proofClaims: ["Uses case studies and registration-to-meeting conversion language."],
      sources: [
        {
          title: "Pipeline Webinar Agency Events",
          url: "https://competitor.example/events",
          snippet: "Monthly webinars for B2B marketers.",
          sourceType: "competitor",
        },
      ],
    },
    {
      name: "Evergreen Launch Studio",
      url: "https://evergreen.example/webinar-funnels",
      positioning: "Evergreen webinar funnel buildouts for consultants and course creators.",
      eventPatterns: ["Launches evergreen workshops and live challenge events in 4–6 week cycles."],
      notableHooks: ["High-ticket offer workshop", "Automated masterclass rebuild"],
      proofClaims: ["Emphasizes booked calls, conversion rate, and paid traffic efficiency."],
      sources: [
        {
          title: "Evergreen Launch Studio Webinar Funnels",
          url: "https://evergreen.example/webinar-funnels",
          snippet: "Done-for-you evergreen webinar funnels.",
          sourceType: "competitor",
        },
      ],
    },
  ],
  competitorEventSignals: [
    {
      competitor: "Pipeline Webinar Agency",
      eventName: "Demand Gen Funnel Teardown",
      eventType: "webinar",
      estimatedCadence: "Monthly",
      evidence: "Recurring event listings use similar demand-gen teardown language.",
      sourceUrl: "https://competitor.example/events",
    },
    {
      competitor: "Evergreen Launch Studio",
      eventName: "High-Ticket Webinar Funnel Workshop",
      eventType: "workshop",
      estimatedCadence: "Every 4–6 weeks",
      evidence: "Workshop series appears in launch-style batches rather than fixed monthly events.",
      sourceUrl: "https://evergreen.example/workshops",
    },
  ],
  marketPatterns: [
    "Competitors sell outcomes around booked calls, pipeline influence, and conversion, not webinar attendance alone.",
    "The strongest hooks are teardown-, benchmark-, and workshop-led because they feel concrete and immediately useful.",
    "Follow-up and sales handoff are common weak spots; most public event pages over-index on registration and under-explain post-event conversion.",
  ],
  strategicGaps: [
    "Opportunity to own the 'webinar rescue' frame for teams that already run events but do not get revenue from them.",
    "Opportunity to package competitor/event research as part of the intake, which feels more senior than a generic AI copy generator.",
  ],
  sourceBackedAssumptions: [
    "A marketing director will care more about pipeline, sales handoff, and proof than raw attendance volume.",
    "Competitor cadence suggests a monthly or campaign-cycle webinar plan is credible for B2B teams.",
  ],
  unansweredQuestions: [
    "Which CRM and webinar platform does the company actually use?",
    "What proof can be used legally: client logos, attendance numbers, booked calls, or pipeline influence?",
    "Are competitors running paid promotion or relying mainly on partner/email distribution?",
  ],
  recommendedAngles: [
    "Stop treating webinars like content. Use them as sales-qualified conversation engines.",
    "The post-webinar 14-day rescue plan: convert attendees before they go cold.",
    "Live teardown: where webinar funnels lose pipeline after registration.",
  ],
  sources: [
    {
      title: "Pipeline Webinar Agency Events",
      url: "https://competitor.example/events",
      snippet: "Monthly webinars for B2B marketers.",
      query: "B2B webinar demand generation agency events",
      sourceType: "competitor",
    },
    {
      title: "Evergreen Launch Studio Webinar Funnels",
      url: "https://evergreen.example/webinar-funnels",
      snippet: "Done-for-you evergreen webinar funnels.",
      query: "done for you webinar funnel agency",
      sourceType: "competitor",
    },
  ],
  confidence: "medium",
};

export function emptyResearchRequest(input?: Partial<WebinarInput>): ResearchRequestInput {
  return {
    companyName: input?.companyName ?? "",
    companyWebsite: "",
    industry: input?.industry ?? "",
    targetAudience: input?.targetAudience ?? "",
    proposedTopic: input?.topic ?? input?.title ?? "",
    competitorsRaw: "",
  };
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function asSources(value: unknown): ResearchSource[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      title: String(item.title ?? "Untitled source"),
      url: String(item.url ?? ""),
      snippet: typeof item.snippet === "string" ? item.snippet : undefined,
      query: typeof item.query === "string" ? item.query : undefined,
      sourceType: ["company", "competitor", "event", "market", "other"].includes(String(item.sourceType))
        ? (item.sourceType as ResearchSource["sourceType"])
        : "other",
    }))
    .filter((source) => source.url.startsWith("http"));
}

export function normalizeResearchBrief(value: unknown): ResearchBrief | null {
  const candidate = (value as { researchBrief?: unknown })?.researchBrief ?? value;
  if (!candidate || typeof candidate !== "object") return null;
  const raw = candidate as Record<string, unknown>;
  const companyRaw = (raw.company ?? {}) as Record<string, unknown>;
  const confidence = ["low", "medium", "high"].includes(String(raw.confidence))
    ? (raw.confidence as ResearchBrief["confidence"])
    : "low";

  const competitors = Array.isArray(raw.competitors)
    ? raw.competitors
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item) => ({
          name: String(item.name ?? "Unknown competitor"),
          url: typeof item.url === "string" ? item.url : undefined,
          positioning: typeof item.positioning === "string" ? item.positioning : undefined,
          eventPatterns: asStringArray(item.eventPatterns),
          notableHooks: asStringArray(item.notableHooks),
          proofClaims: asStringArray(item.proofClaims),
          sources: asSources(item.sources),
        }))
    : [];

  const competitorEventSignals = Array.isArray(raw.competitorEventSignals)
    ? raw.competitorEventSignals
        .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
        .map((item) => ({
          competitor: String(item.competitor ?? "Unknown competitor"),
          eventName: String(item.eventName ?? "Unspecified event"),
          eventType: ["webinar", "workshop", "virtual-event", "demo", "conference", "unknown"].includes(
            String(item.eventType),
          )
            ? (item.eventType as ResearchBrief["competitorEventSignals"][number]["eventType"])
            : "unknown",
          estimatedCadence: String(item.estimatedCadence ?? "Unknown"),
          evidence: String(item.evidence ?? "No evidence provided"),
          sourceUrl: typeof item.sourceUrl === "string" ? item.sourceUrl : undefined,
        }))
    : [];

  return {
    generatedAt: typeof raw.generatedAt === "string" ? raw.generatedAt : new Date().toISOString(),
    company: {
      name: String(companyRaw.name ?? "Unknown company"),
      website: typeof companyRaw.website === "string" ? companyRaw.website : undefined,
      positioning: typeof companyRaw.positioning === "string" ? companyRaw.positioning : undefined,
      offers: asStringArray(companyRaw.offers),
      audienceSignals: asStringArray(companyRaw.audienceSignals),
      proofSignals: asStringArray(companyRaw.proofSignals),
      gaps: asStringArray(companyRaw.gaps),
    },
    competitors,
    competitorEventSignals,
    marketPatterns: asStringArray(raw.marketPatterns),
    strategicGaps: asStringArray(raw.strategicGaps),
    sourceBackedAssumptions: asStringArray(raw.sourceBackedAssumptions),
    unansweredQuestions: asStringArray(raw.unansweredQuestions),
    recommendedAngles: asStringArray(raw.recommendedAngles),
    sources: asSources(raw.sources),
    confidence,
  };
}

export function buildResearchIntelligence(input: WebinarInput, research?: ResearchBrief | null): ResearchIntelligence {
  if (!research) {
    return {
      status: "missing",
      confidence: "low",
      companyPositioning:
        "No research brief is attached yet. The generator can still produce a campaign kit, but a marketing director should attach company, competitor, and event-cadence research before using the plan for paid traffic.",
      competitorEventCadence: [],
      marketPatterns: [
        "Research layer missing: competitor event patterns, frequency, and proof gaps have not been checked.",
      ],
      strategicGaps: ["Attach n8n research or paste a structured research brief before finalizing campaign materials."],
      sourceBackedAssumptions: [],
      unansweredQuestions: [
        `Who else is educating ${input.targetAudience || "this audience"} on ${input.topic || "this topic"}?`,
        "How often are competitors running webinars, workshops, demos, or report launches?",
        "Which proof claims can the company safely make?",
      ],
      sources: [],
    };
  }

  return {
    status: "attached",
    confidence: research.confidence,
    companyPositioning:
      research.company.positioning ||
      `${research.company.name || input.companyName} needs clearer public positioning before this event is promoted heavily.`,
    competitorEventCadence: research.competitorEventSignals,
    marketPatterns: research.marketPatterns.length
      ? research.marketPatterns
      : ["No clear market patterns were returned. Treat the research as incomplete."],
    strategicGaps: research.strategicGaps.length
      ? research.strategicGaps
      : research.company.gaps.length
        ? research.company.gaps
        : ["No explicit strategic gap was returned; verify differentiation manually."],
    sourceBackedAssumptions: research.sourceBackedAssumptions,
    unansweredQuestions: research.unansweredQuestions,
    sources: research.sources,
  };
}

export function buildWebinarStrategy(input: WebinarInput, research?: ResearchBrief | null): WebinarStrategy {
  const strongestAngle = research?.recommendedAngles[0] || input.uniqueAngle || input.mainPromise;
  const competitorPattern = research?.marketPatterns[0];
  const gaps = research?.strategicGaps?.slice(0, 2) ?? [];
  return {
    topicVerdict: research
      ? `The proposed topic is usable if it is framed against the researched market gap: ${gaps[0] || "clearer differentiation and proof."}`
      : "The proposed topic is directionally usable, but it is not research-backed yet. Run the research workflow before final campaign approval.",
    strategicThesis: research
      ? `${input.companyName || research.company.name} should position this event around a specific pain competitors are not fully solving: ${strongestAngle}. ${competitorPattern || "Lead with operational specificity, not generic education."}`
      : `${input.companyName || "The company"} should use this webinar as a diagnostic event: make the audience recognize the cost of the current problem, then give a concrete action plan tied to the offer.`,
    recommendedAngle: strongestAngle || "A practical teardown of the current webinar/event funnel and the fixes that turn attention into pipeline.",
    differentiation: research?.strategicGaps[0]
      ? `Differentiate by owning this gap: ${research.strategicGaps[0]}`
      : input.uniqueAngle || "Differentiate with live teardown, proof-backed examples, and a concrete post-event follow-up plan.",
    formatRecommendation:
      "Use a 40–50 minute live workshop or teardown: 5 minute diagnosis, 25 minute framework, 10 minute examples, 10 minute Q&A and CTA. A director will trust this more than a broad thought-leadership webinar.",
    contentPillars: [
      `Audience pain: ${input.painPoint || "the cost of weak event-to-pipeline conversion"}`,
      `Research gap: ${research?.strategicGaps[0] || "what competitors are not addressing clearly"}`,
      `Framework: ${input.mainPromise || "a practical step-by-step rescue plan"}`,
      `Proof and implementation: ${research?.company.proofSignals[0] || "real examples, source-backed claims, and clear next steps"}`,
    ],
    researchDrivenQuestions:
      research?.unansweredQuestions.length ? research.unansweredQuestions : [
        "Which competitors are running similar events right now?",
        "What evidence do we have that this audience wants this topic?",
        "What proof can we use without inventing claims?",
      ],
  };
}

export function buildCampaignBrief(input: WebinarInput, research?: ResearchBrief | null): CampaignBrief {
  const angle = research?.recommendedAngles[0] || input.uniqueAngle || input.mainPromise;
  const topCompetitors = research?.competitors.map((competitor) => competitor.name).slice(0, 3).join(", ");
  return {
    oneLineBrief: `Create a research-backed ${input.format} webinar campaign for ${input.targetAudience || "the target audience"} that turns "${input.painPoint || input.topic}" into a concrete reason to register, attend, and take the next sales step.`,
    directorNotes: [
      research
        ? `Research attached with ${research.confidence} confidence, ${research.sources.length} source(s), and ${research.competitorEventSignals.length} competitor event signal(s).`
        : "No research attached. Use this as a draft only until n8n research is run.",
      topCompetitors ? `Competitor set reviewed: ${topCompetitors}.` : "Competitor set still needs validation.",
      "The campaign should sell the cost of inaction first, then the framework, then the post-event implementation path.",
    ],
    landingPageStrategy: `Lead with the specific outcome: ${input.mainPromise || angle}. Add a research-backed section showing why the market's usual webinar/event approach fails, then include proof placeholders rather than unsupported performance claims.`,
    emailStrategy:
      "Use the invite sequence to build urgency around the researched pain, not just the event date. The strongest emails should include a teardown hook, a mistake/diagnostic frame, and a practical takeaway the audience can use even if they never buy.",
    paidMediaStrategy:
      "Run creative against problem-aware audiences first. Test one teardown hook, one benchmark/diagnostic hook, and one contrarian myth-busting hook. Use UTM capture in the app to preserve source attribution.",
    salesFollowUpStrategy:
      "Route captured leads by timeline and blocker. Anyone selecting strategy, ads, landing page, or follow-up as the blocker should receive a specific rescue-sprint follow-up within 48 hours.",
    creativeGuardrails: [
      "Do not claim competitor frequency or market behavior without sources in the research brief.",
      "Do not invent testimonials, ROI, booked-call counts, or attendance rates.",
      "Use concrete event mechanics: teardown, clinic, workshop, benchmark, checklist, audit.",
      "Keep copy director-grade: specific, operational, and tied to pipeline outcomes.",
    ],
  };
}

export function buildResearchRequestPayload(request: ResearchRequestInput, input?: WebinarInput) {
  const competitors = request.competitorsRaw
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    request,
    input,
    competitors,
    requestedAt: new Date().toISOString(),
    expectedOutput:
      "Return JSON with researchBrief: { generatedAt, company, competitors, competitorEventSignals, marketPatterns, strategicGaps, sourceBackedAssumptions, unansweredQuestions, recommendedAngles, sources, confidence }",
  };
}
