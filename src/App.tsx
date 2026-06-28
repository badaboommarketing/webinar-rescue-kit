import { useState, useRef } from "react";
import type { WebinarInput, GeneratedKit, ResearchBrief } from "./types";
import { generateKit } from "./generator";
import { getWebhookUrl, setWebhookUrl } from "./storage";
import { Form } from "./components/Form";
import { KitOutput } from "./components/KitOutput";
import { LeadCapture } from "./components/LeadCapture";
import { ResearchPanel } from "./components/ResearchPanel";
import "./App.css";

function App() {
  const [kit, setKit] = useState<GeneratedKit | null>(null);
  const [lastInput, setLastInput] = useState<WebinarInput | null>(null);
  const [researchBrief, setResearchBrief] = useState<ResearchBrief | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrlState] = useState(getWebhookUrl);
  const kitRef = useRef<HTMLDivElement>(null);

  function handleGenerate(input: WebinarInput) {
    const generated = generateKit(input, researchBrief);
    setKit(generated);
    setLastInput(input);
    setTimeout(() => {
      kitRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleWebhookSave(url: string) {
    setWebhookUrl(url);
    setWebhookUrlState(url);
  }

  return (
    <div className="wrk-app">
      <header className="wrk-header">
        <div className="header-inner">
          <div className="brand">
            <h1>
              <span className="brand-icon">◆</span> Webinar Rescue Kit
            </h1>
            <p className="tagline">
              Turn a rough webinar idea into a research-backed event campaign.
              <br />
              <span className="tagline-sub">
                Company research · Competitor events · Strategy · Copy · Ads · Sales handoff
              </span>
            </p>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="btn-settings"
              onClick={() => setShowSettings(!showSettings)}
              title="Settings"
            >
              ⚙
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="settings-panel">
            <h3>┌─ Settings</h3>
            <label>
              <span>Lead Intake Webhook URL (n8n or any endpoint)</span>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => handleWebhookSave(e.target.value)}
                placeholder="https://your-n8n.example.com/webhook/webinar-rescue-kit-intake"
              />
            </label>
            <p className="settings-note">
              Lead intake reference: workflow <code>8KuTrjP8voivf8QD</code>, path{" "}
              <code>webinar-rescue-kit-intake</code>. Research uses its own webhook in the Research Intelligence panel.
            </p>
          </div>
        )}
      </header>

      <main className="wrk-main">
        <ResearchPanel
          research={researchBrief}
          onResearchChange={setResearchBrief}
          lastInput={lastInput}
        />
        <Form onGenerate={handleGenerate} />

        {kit && lastInput && (
          <div ref={kitRef} className="kit-container">
            <KitOutput kit={kit} />
            <LeadCapture input={lastInput} kit={kit} research={researchBrief} />
          </div>
        )}
      </main>

      <footer className="wrk-footer">
        <p>
          <span className="footer-brand">◆ Bada Digital</span> — Event Lead
          Growth
        </p>
        <p className="footer-sub">
          Webinar Rescue Kit is a free research-assisted tool. No lead data is sent anywhere unless you configure a webhook.
        </p>
      </footer>
    </div>
  );
}

export default App;
