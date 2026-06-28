import { useState } from "react";
import type { ResearchBrief, ResearchRequestInput, WebinarInput } from "../types";
import {
  buildResearchRequestPayload,
  emptyResearchRequest,
  normalizeResearchBrief,
  sampleResearchBrief,
} from "../research";
import {
  getResearchWebhookUrl,
  postResearchWebhook,
  setResearchWebhookUrl,
} from "../storage";

interface ResearchPanelProps {
  research: ResearchBrief | null;
  onResearchChange: (research: ResearchBrief | null) => void;
  lastInput?: WebinarInput | null;
}

export function ResearchPanel({ research, onResearchChange, lastInput }: ResearchPanelProps) {
  const [request, setRequest] = useState<ResearchRequestInput>(emptyResearchRequest(lastInput ?? undefined));
  const [webhookUrl, setWebhookUrlState] = useState(getResearchWebhookUrl);
  const [rawJson, setRawJson] = useState("");
  const [status, setStatus] = useState("Research layer optional, but this is what makes the output director-grade.");
  const [isLoading, setIsLoading] = useState(false);

  function set<K extends keyof ResearchRequestInput>(key: K, value: ResearchRequestInput[K]) {
    setRequest((prev) => ({ ...prev, [key]: value }));
  }

  function handleWebhookSave(url: string) {
    setResearchWebhookUrl(url);
    setWebhookUrlState(url);
  }

  function handleSampleResearch() {
    onResearchChange(sampleResearchBrief);
    setRawJson(JSON.stringify(sampleResearchBrief, null, 2));
    setStatus("Sample research attached. Replace it with n8n research before using this for a real client.");
  }

  function handleImportJson() {
    try {
      const parsed = JSON.parse(rawJson);
      const normalized = normalizeResearchBrief(parsed);
      if (!normalized) {
        setStatus("That JSON did not match the research brief shape.");
        return;
      }
      onResearchChange(normalized);
      setStatus(`Research imported with ${normalized.confidence} confidence and ${normalized.sources.length} source(s).`);
    } catch {
      setStatus("Invalid JSON. Paste the researchBrief object returned by n8n.");
    }
  }

  async function handleRunResearch() {
    if (!webhookUrl.trim()) {
      setStatus("Paste the n8n research webhook URL first.");
      return;
    }
    setIsLoading(true);
    setStatus("Running n8n research: company, competitors, event cadence, gaps, and source-backed angles...");
    const result = await postResearchWebhook(webhookUrl, buildResearchRequestPayload(request, lastInput ?? undefined));
    setIsLoading(false);
    if (!result.ok || !result.research) {
      setStatus(`Research failed: ${result.message}`);
      return;
    }
    onResearchChange(result.research);
    setRawJson(JSON.stringify(result.research, null, 2));
    setStatus(`Research attached: ${result.research.confidence} confidence, ${result.research.sources.length} source(s), ${result.research.competitorEventSignals.length} event signal(s).`);
  }

  const competitorSummary = research?.competitors.map((competitor) => competitor.name).join(", ");

  return (
    <section className="research-panel">
      <div className="form-toolbar">
        <div>
          <h2>┌─ Research Intelligence</h2>
          <p className="panel-subtitle">
            Optional for demos. Required before a marketing director should approve paid traffic.
          </p>
        </div>
        <button type="button" className="btn-sample" onClick={handleSampleResearch}>
          ▶ Load Sample Research
        </button>
      </div>

      <fieldset>
        <legend>n8n Research Request</legend>
        <label>
          <span>Research Webhook URL</span>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => handleWebhookSave(e.target.value)}
            placeholder="https://badaboom.app.n8n.cloud/webhook/webinar-rescue-kit-research"
          />
        </label>
        <div className="form-row">
          <label>
            <span>Company Name</span>
            <input
              type="text"
              value={request.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              placeholder="e.g. Acme Growth Co"
            />
          </label>
          <label>
            <span>Company Website</span>
            <input
              type="url"
              value={request.companyWebsite}
              onChange={(e) => set("companyWebsite", e.target.value)}
              placeholder="https://example.com"
            />
          </label>
        </div>
        <label>
          <span>Proposed Webinar / Event Topic</span>
          <input
            type="text"
            value={request.proposedTopic}
            onChange={(e) => set("proposedTopic", e.target.value)}
            placeholder="What should the research pressure-test?"
          />
        </label>
        <label>
          <span>Known Competitors or Comparable Companies</span>
          <textarea
            value={request.competitorsRaw}
            onChange={(e) => set("competitorsRaw", e.target.value)}
            placeholder="One per line, or comma-separated. n8n will also look for adjacent competitors."
            rows={3}
          />
        </label>
        <div className="form-row">
          <label>
            <span>Industry / Niche</span>
            <input
              type="text"
              value={request.industry}
              onChange={(e) => set("industry", e.target.value)}
              placeholder="e.g. B2B SaaS"
            />
          </label>
          <label>
            <span>Target Audience</span>
            <input
              type="text"
              value={request.targetAudience}
              onChange={(e) => set("targetAudience", e.target.value)}
              placeholder="e.g. demand-gen directors at mid-market SaaS companies"
            />
          </label>
        </div>
        <button type="button" className="btn-generate btn-research" onClick={handleRunResearch} disabled={isLoading}>
          {isLoading ? "██ Running Research..." : "██ Run n8n Research"}
        </button>
      </fieldset>

      <fieldset>
        <legend>Paste Research JSON</legend>
        <textarea
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          placeholder='Paste { "researchBrief": ... } or the research brief object returned by n8n.'
          rows={5}
        />
        <div className="inline-actions">
          <button type="button" className="btn-download" onClick={handleImportJson}>
            Import Research JSON
          </button>
          <button type="button" className="btn-download" onClick={() => onResearchChange(null)}>
            Clear Research
          </button>
        </div>
      </fieldset>

      <div className={research ? "research-status research-status-ready" : "research-status"}>
        <strong>{research ? `Research attached: ${research.confidence} confidence` : "No research attached"}</strong>
        <span>{status}</span>
        {research && (
          <span>
            Sources: {research.sources.length} · Competitors: {competitorSummary || "none"} · Event signals: {research.competitorEventSignals.length}
          </span>
        )}
      </div>
    </section>
  );
}
