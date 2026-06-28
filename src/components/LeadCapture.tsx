import { useState } from "react";
import type { WebinarInput, GeneratedKit, LeadInfo, ResearchBrief } from "../types";
import {
  saveLead,
  downloadJson,
  downloadText,
  postWebhook,
  buildMailtoLink,
  buildPayload,
  getWebhookUrl,
  buildMarkdownKit,
} from "../storage";

interface LeadCaptureProps {
  input: WebinarInput;
  kit: GeneratedKit;
  research?: ResearchBrief | null;
}

const emptyLead: LeadInfo = {
  name: "",
  email: "",
  company: "",
  website: "",
  timeline: "",
  biggestBlocker: "",
  budgetRange: "",
  wantsHelp: "maybe",
  consent: false,
};

export function LeadCapture({ input, kit, research }: LeadCaptureProps) {
  const [lead, setLead] = useState<LeadInfo>(emptyLead);
  const [status, setStatus] = useState<string>("");
  const [capturedPayload, setCapturedPayload] = useState<ReturnType<typeof buildPayload> | null>(null);

  function filename(extension: "json" | "md") {
    const slug =
      input.title.replace(/\s+/g, "-").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40) ||
      "webinar-rescue-kit";
    return `rescue-kit-${slug}.${extension}`;
  }

  function validateLead(): string | null {
    if (!lead.name.trim() || !lead.email.trim() || !lead.company.trim()) {
      return "Name, email, and company are required before export.";
    }
    if (!/^\S+@\S+\.\S+$/.test(lead.email)) {
      return "Use a valid work email before export.";
    }
    if (!lead.timeline.trim() || !lead.biggestBlocker.trim()) {
      return "Timeline and biggest blocker are required so the intake is actionable.";
    }
    if (!lead.consent) {
      return "Consent is required before sending this to Bada Digital.";
    }
    return null;
  }

  async function handleCapture() {
    const error = validateLead();
    if (error) {
      setStatus(error);
      return;
    }

    const payload = buildPayload(lead, input, research);
    saveLead(payload);
    setCapturedPayload(payload);

    const webhookUrl = getWebhookUrl();
    if (webhookUrl) {
      setStatus("Saving locally and sending to webhook...");
      const result = await postWebhook(webhookUrl, payload);
      if (result.ok) {
        setStatus("Captured, saved locally, and sent to webhook. Export is unlocked.");
        return;
      }
      setStatus(`Webhook failed (${result.message}). Saved locally. Export is unlocked; use the email fallback if needed.`);
      return;
    }

    setStatus("Captured locally. Export is unlocked. No webhook configured, so use the email fallback if this should go to Bada now.");
  }

  function handleJsonDownload() {
    if (!capturedPayload) {
      setStatus("Capture your lead details first. Export is gated so paid traffic creates an actionable intake.");
      return;
    }
    downloadJson({ payload: capturedPayload, kit }, filename("json"));
    setStatus("JSON kit downloaded.");
  }

  function handleMarkdownDownload() {
    if (!capturedPayload) {
      setStatus("Capture your lead details first. Export is gated so paid traffic creates an actionable intake.");
      return;
    }
    downloadText(buildMarkdownKit(input, kit), filename("md"));
    setStatus("Markdown kit downloaded.");
  }

  const mailtoHref = buildMailtoLink(lead, input);
  const exportLocked = !capturedPayload;

  return (
    <div className="lead-capture">
      <div className="lead-capture-inner">
        <h3>┌─ Capture & Export</h3>

        <div className="export-gate">
          <strong>{exportLocked ? "Export locked" : "Export unlocked"}</strong>
          <span>
            {exportLocked
              ? " Submit the intake below first so this can become a real lead, not a throwaway download."
              : " Lead captured. Download the full kit or send it through the fallback."}
          </span>
        </div>

        <div className="lead-divider">
          <span>— get the kit or get expert help —</span>
        </div>

        <p className="lead-pitch">
          <strong>Bada Digital — Event Lead Growth.</strong> We help teams turn webinar ideas into
          pipeline-generating campaigns. Fill in your info to export the kit and create a usable intake packet.
        </p>

        <div className="lead-fields">
          <input
            type="text"
            placeholder="Your name *"
            value={lead.name}
            onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="work@email.com *"
            value={lead.email}
            onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Company *"
            value={lead.company}
            onChange={(e) => setLead((p) => ({ ...p, company: e.target.value }))}
          />
          <input
            type="url"
            placeholder="Website"
            value={lead.website}
            onChange={(e) => setLead((p) => ({ ...p, website: e.target.value }))}
          />
          <select
            value={lead.timeline}
            onChange={(e) => setLead((p) => ({ ...p, timeline: e.target.value }))}
          >
            <option value="">Timeline *</option>
            <option value="under-7-days">Under 7 days</option>
            <option value="1-2-weeks">1–2 weeks</option>
            <option value="3-4-weeks">3–4 weeks</option>
            <option value="30-plus-days">30+ days</option>
          </select>
          <select
            value={lead.biggestBlocker}
            onChange={(e) => setLead((p) => ({ ...p, biggestBlocker: e.target.value }))}
          >
            <option value="">Biggest blocker *</option>
            <option value="strategy">Strategy / positioning</option>
            <option value="landing-page">Landing page</option>
            <option value="email-sequence">Email sequence</option>
            <option value="ads">Ads / promotion</option>
            <option value="follow-up">CRM / sales follow-up</option>
            <option value="low-registrations">Low registrations</option>
          </select>
          <select
            value={lead.budgetRange}
            onChange={(e) => setLead((p) => ({ ...p, budgetRange: e.target.value }))}
          >
            <option value="">Budget range</option>
            <option value="under-500">Under $500</option>
            <option value="500-1500">$500–$1,500</option>
            <option value="1500-3000">$1,500–$3,000</option>
            <option value="3000-5000">$3,000–$5,000</option>
            <option value="5000-plus">$5,000+</option>
          </select>
          <select
            value={lead.wantsHelp}
            onChange={(e) => setLead((p) => ({ ...p, wantsHelp: e.target.value as LeadInfo["wantsHelp"] }))}
          >
            <option value="yes">Yes, I want help launching this</option>
            <option value="maybe">Maybe, send me options</option>
            <option value="no">No, just the kit</option>
          </select>
        </div>

        <label className="consent-row">
          <input
            type="checkbox"
            checked={lead.consent}
            onChange={(e) => setLead((p) => ({ ...p, consent: e.target.checked }))}
          />
          <span>I agree Bada Digital may contact me about this webinar/event plan.</span>
        </label>

        <div className="lead-actions">
          <button type="button" className="btn-send" onClick={handleCapture}>
            ██ Capture Intake
          </button>
          <button type="button" className="btn-download" onClick={handleMarkdownDownload}>
            ↓ Download Markdown
          </button>
          <button type="button" className="btn-download" onClick={handleJsonDownload}>
            ↓ Download JSON
          </button>
          <a href={mailtoHref} className="btn-mailto">
            ✉ Email Fallback
          </a>
        </div>

        {status && <p className="lead-status">{status}</p>}
      </div>
    </div>
  );
}
