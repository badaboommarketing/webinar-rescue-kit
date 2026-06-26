import type { LeadPayload, LeadInfo, WebinarInput } from "./types";

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

// ── JSON download ───────────────────────────────────────────────────

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
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

const BADA_EMAIL = "hello@badadigital.com";

export function buildMailtoLink(lead: LeadInfo, input: WebinarInput): string {
  const subject = encodeURIComponent(
    `Webinar Rescue Kit Inquiry — ${input.title || "New Webinar"}`,
  );
  const body = encodeURIComponent(
    [
      `Name: ${lead.name}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company}`,
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

export function buildPayload(
  lead: LeadInfo,
  input: WebinarInput,
): LeadPayload {
  return {
    lead,
    input,
    generatedAt: new Date().toISOString(),
  };
}
