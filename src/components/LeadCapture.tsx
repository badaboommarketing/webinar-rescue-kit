import { useState } from "react";
import type { WebinarInput, GeneratedKit, LeadInfo } from "../types";
import {
  saveLead,
  downloadJson,
  postWebhook,
  buildMailtoLink,
  buildPayload,
  getWebhookUrl,
} from "../storage";

interface LeadCaptureProps {
  input: WebinarInput;
  kit: GeneratedKit;
}

export function LeadCapture({ input, kit }: LeadCaptureProps) {
  const [lead, setLead] = useState<LeadInfo>({
    name: "",
    email: "",
    company: "",
  });
  const [status, setStatus] = useState<string>("");

  function handleDownload() {
    downloadJson(
      { input, kit, exportedAt: new Date().toISOString() },
      `rescue-kit-${input.title.replace(/\s+/g, "-").toLowerCase().slice(0, 40) || "export"}.json`,
    );
    setStatus("Kit downloaded.");
  }

  async function handleSend() {
    if (!lead.name.trim() || !lead.email.trim()) {
      setStatus("Name and email are required to send.");
      return;
    }

    const payload = buildPayload(lead, input);

    // Save to localStorage
    saveLead(payload);

    // Try webhook if configured
    const webhookUrl = getWebhookUrl();
    if (webhookUrl) {
      setStatus("Sending...");
      const result = await postWebhook(webhookUrl, payload);
      if (result.ok) {
        setStatus("Sent to webhook and saved locally.");
        return;
      }
      setStatus(
        `Webhook failed (${result.message}). Saved locally — use the email fallback below.`,
      );
      return;
    }

    setStatus(
      "Saved locally. No webhook configured — use the email link below or set a webhook URL in Settings.",
    );
  }

  const mailtoHref = buildMailtoLink(lead, input);

  return (
    <div className="lead-capture">
      <div className="lead-capture-inner">
        <h3>┌─ Save & Export</h3>

        <button type="button" className="btn-download" onClick={handleDownload}>
          ↓ Download Kit as JSON
        </button>

        <div className="lead-divider">
          <span>— or get expert help —</span>
        </div>

        <p className="lead-pitch">
          <strong>Bada Digital — Event Lead Growth.</strong> We help teams turn
          webinar ideas into pipeline-generating campaigns. Fill in your info to
          connect with us.
        </p>

        <div className="lead-fields">
          <input
            type="text"
            placeholder="Your name"
            value={lead.name}
            onChange={(e) => setLead((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={lead.email}
            onChange={(e) => setLead((p) => ({ ...p, email: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Company"
            value={lead.company}
            onChange={(e) =>
              setLead((p) => ({ ...p, company: e.target.value }))
            }
          />
        </div>

        <div className="lead-actions">
          <button type="button" className="btn-send" onClick={handleSend}>
            ██ Save & Send to Bada Digital
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
