import type { LeadPayload, LeadInfo, WebinarInput, GeneratedKit } from "./types";

const LEADS_KEY = "wrk_leads";
const WEBHOOK_KEY = "wrk_webhook_url";

// ── localStorage helpers ────────────────────────────────────────────

export function saveLead(payload: LeadPayload): void {
  const existing = loadLeads();
  existing.push(payload);
  localStorage.setItem(LEADS_KEY, JSON.stringify(existing));
}

export function loadLeads(): LeadPayload[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? (JSON.parse(raw) as LeadPayload[]) : [];
  } catch {
    return [];
  }
}

export function clearLeads(): void {
  localStorage.removeItem(LEADS_KEY);
}

// ── Webhook URL setting ─────────────────────────────────────────────

export function getWebhookUrl(): string {
  return localStorage.getItem(WEBHOOK_KEY) ?? "";
}

export function setWebhookUrl(url: string): void {
  if (url.trim()) {
    localStorage.setItem(WEBHOOK_KEY, url.trim());
  } else {
    localStorage.removeItem(WEBHOOK_KEY);
  }
}

// ── Downloads ───────────────────────────────────────────────────────

export function downloadJson(data: unknown, filename: string): void {
  downloadText(JSON.stringify(data, null, 2), filename, "application/json");
}

export function downloadText(
  text: string,
  filename: string,
  type = "text/markdown",
): void {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Webhook POST ────────────────────────────────────────────────────

export interface WebhookResult {
  ok: boolean;
  status?: number;
  message: string;
}

export async function postWebhook(
  url: string,
  payload: LeadPayload,
): Promise<WebhookResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return { ok: true, status: res.status, message: "Sent successfully" };
    }
    return {
      ok: false,
      status: res.status,
      message: `Server responded with ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Network error",
    };
  }
}

// ── Mailto fallback ─────────────────────────────────────────────────

const BADA_EMAIL = "alex@bada.digital";

export function buildMailtoLink(lead: LeadInfo, input: WebinarInput): string {
  const subject = encodeURIComponent(
    `Webinar Rescue Kit Inquiry — ${input.title || "New Webinar"}`,
  );
  const body = encodeURIComponent(
    [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company}`,
      `Website: ${lead.website}`,
      `Timeline: ${lead.timeline}`,
      `Biggest blocker: ${lead.biggestBlocker}`,
      `Budget range: ${lead.budgetRange}`,
      `Interested in help: ${lead.wantsHelp}`,
      ``,
      `Webinar: ${input.title}`,
      `Topic: ${input.topic}`,
      `Audience: ${input.targetAudience}`,
      `Industry: ${input.industry}`,
      ``,
      `Sent from Webinar Rescue Kit by Bada Digital`,
    ].join("\n"),
  );
  return `mailto:${BADA_EMAIL}?subject=${subject}&body=${body}`;
}

// ── Build payload helper ────────────────────────────────────────────

export function buildPayload(lead: LeadInfo, input: WebinarInput): LeadPayload {
  return {
    lead,
    input,
    generatedAt: new Date().toISOString(),
    utm: getUtmParams(),
  };
}

export function getUtmParams(
  search = typeof window === "undefined" ? "" : window.location.search,
): Record<string, string> {
  const params = new URLSearchParams(search);
  const out: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key.startsWith("utm_") || ["gclid", "fbclid", "msclkid"].includes(key)) {
      out[key] = value;
    }
  }
  return out;
}

export function buildMarkdownKit(input: WebinarInput, kit: GeneratedKit): string {
  const emailBlock = kit.emailSequence
    .map((email) =>
      `### ${email.label}\n\nTiming: ${email.sendTiming}\n\nSubject: ${email.subject}\n\nPreheader: ${email.preheader}\n\n\`\`\`\n${email.body}\n\`\`\``,
    )
    .join("\n\n");
  const followUpBlock = kit.postWebinarFollowUp
    .map((email) =>
      `### ${email.label}\n\nTiming: ${email.sendTiming}\n\nSubject: ${email.subject}\n\nPreheader: ${email.preheader}\n\n\`\`\`\n${email.body}\n\`\`\``,
    )
    .join("\n\n");

  return `# ${input.title} — Webinar Rescue Kit

## Rescue Score
${kit.rescueScore.score}/100 — ${kit.rescueScore.label}

Recommended offer: ${kit.rescueScore.recommendedOffer}

### Rationale
${kit.rescueScore.rationale.map((item) => `- ${item}`).join("\n")}

### Next Actions
${kit.rescueScore.nextActions.map((item) => `- ${item}`).join("\n")}

## Executive Snapshot
${kit.executiveSnapshot}

## Positioning
- Angle: ${kit.positioning.angle}
- Differentiation: ${kit.positioning.differentiation}
- Value proposition: ${kit.positioning.valueProposition}
- Audience insight: ${kit.positioning.audienceInsight}

## Registration Page Copy
Headline: ${kit.landingPage.headline}

Subheadline: ${kit.landingPage.subheadline}

${kit.landingPage.bullets.map((item) => `- ${item}`).join("\n")}

CTA: ${kit.landingPage.ctaButton}

Proof note: ${kit.landingPage.socialProofNote}

Urgency: ${kit.landingPage.urgencyElement}

## Invite / Reminder Sequence
${emailBlock}

## Post-Webinar Follow-Up
${followUpBlock}

## Paid Ad Angles
${kit.adAngles
  .map(
    (ad) =>
      `### ${ad.platform}\n\nHeadline: ${ad.headline}\n\n${ad.body}\n\nCTA: ${ad.cta}\n\nTargeting notes: ${ad.targetingNotes}`,
  )
  .join("\n\n")}

## Sales Handoff
${kit.salesHandoff.map((item) => `- ${item}`).join("\n")}

## Production Checklist
${kit.productionChecklist.map((item) => `- ${item}`).join("\n")}

## Risk Flags
${kit.riskFlags.map((item) => `- ${item}`).join("\n")}
`;
}
