import { useState } from "react";
import type { WebinarInput } from "../types";
import { sampleWebinar, emptyInput } from "../sampleData";

interface FormProps {
  onGenerate: (input: WebinarInput) => void;
}

export function Form({ onGenerate }: FormProps) {
  const [input, setInput] = useState<WebinarInput>(emptyInput());

  function set<K extends keyof WebinarInput>(key: K, value: WebinarInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function loadSample() {
    setInput({ ...sampleWebinar });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onGenerate(input);
  }

  return (
    <form className="wrk-form" onSubmit={handleSubmit}>
      <div className="form-toolbar">
        <h2>┌─ Webinar Details</h2>
        <button type="button" className="btn-sample" onClick={loadSample}>
          ▶ Load Sample Data
        </button>
      </div>

      <fieldset>
        <legend>Event Basics</legend>
        <label>
          <span>Title *</span>
          <input
            type="text"
            value={input.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder='e.g. "Pipeline Rescue: 5 Fixes That Move Revenue"'
            required
          />
        </label>
        <label>
          <span>Topic</span>
          <input
            type="text"
            value={input.topic}
            onChange={(e) => set("topic", e.target.value)}
            placeholder="e.g. Webinar-led pipeline generation"
          />
        </label>
        <div className="form-row">
          <label>
            <span>Date & Time</span>
            <input
              type="text"
              value={input.dateTime}
              onChange={(e) => set("dateTime", e.target.value)}
              placeholder="e.g. 2026-07-15 11:00 AM ET"
            />
          </label>
          <label>
            <span>Duration</span>
            <input
              type="text"
              value={input.duration}
              onChange={(e) => set("duration", e.target.value)}
              placeholder="e.g. 45 minutes"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>Format</span>
            <select
              value={input.format}
              onChange={(e) =>
                set("format", e.target.value as WebinarInput["format"])
              }
            >
              <option value="live">Live</option>
              <option value="recorded">Pre-recorded</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label>
            <span>Platform</span>
            <input
              type="text"
              value={input.platform}
              onChange={(e) => set("platform", e.target.value)}
              placeholder="e.g. Zoom, WebEx, Google Meet"
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Audience & Positioning</legend>
        <label>
          <span>Target Audience *</span>
          <textarea
            value={input.targetAudience}
            onChange={(e) => set("targetAudience", e.target.value)}
            placeholder="Be specific: role, company size, industry, situation"
            rows={2}
            required
          />
        </label>
        <label>
          <span>Core Pain Point *</span>
          <textarea
            value={input.painPoint}
            onChange={(e) => set("painPoint", e.target.value)}
            placeholder="The #1 problem your audience faces that this webinar solves"
            rows={2}
            required
          />
        </label>
        <label>
          <span>Main Promise / Outcome *</span>
          <textarea
            value={input.mainPromise}
            onChange={(e) => set("mainPromise", e.target.value)}
            placeholder="What attendees walk away with — be specific and outcome-oriented"
            rows={2}
            required
          />
        </label>
        <label>
          <span>Industry / Niche</span>
          <input
            type="text"
            value={input.industry}
            onChange={(e) => set("industry", e.target.value)}
            placeholder="e.g. B2B SaaS, Healthcare, E-commerce"
          />
        </label>
        <label>
          <span>Unique Angle / Hook</span>
          <textarea
            value={input.uniqueAngle}
            onChange={(e) => set("uniqueAngle", e.target.value)}
            placeholder="What makes THIS webinar different? Contrarian take, exclusive data, live demo, case study..."
            rows={2}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Speaker & Brand</legend>
        <div className="form-row">
          <label>
            <span>Speaker Name *</span>
            <input
              type="text"
              value={input.speakerName}
              onChange={(e) => set("speakerName", e.target.value)}
              placeholder="e.g. Jordan Chen"
              required
            />
          </label>
          <label>
            <span>Company / Brand *</span>
            <input
              type="text"
              value={input.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              placeholder="e.g. Acme Growth Co"
              required
            />
          </label>
        </div>
        <label>
          <span>Speaker Credentials</span>
          <textarea
            value={input.speakerCredentials}
            onChange={(e) => set("speakerCredentials", e.target.value)}
            placeholder="Title, experience, notable results — why should the audience trust this person?"
            rows={2}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Conversion</legend>
        <label>
          <span>Call to Action</span>
          <input
            type="text"
            value={input.callToAction}
            onChange={(e) => set("callToAction", e.target.value)}
            placeholder="e.g. Book a free pipeline audit"
          />
        </label>
        <label>
          <span>Product / Service</span>
          <input
            type="text"
            value={input.productService}
            onChange={(e) => set("productService", e.target.value)}
            placeholder="What you're ultimately selling post-webinar"
          />
        </label>
      </fieldset>

      <button type="submit" className="btn-generate">
        ██ Generate Rescue Kit
      </button>
    </form>
  );
}
