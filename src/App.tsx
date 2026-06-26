import { useState, useRef } from "react";
import type { WebinarInput, GeneratedKit } from "./types";
import { generateKit } from "./generator";
import { getWebhookUrl, setWebhookUrl } from "./storage";
import { Form } from "./components/Form";
import { KitOutput } from "./components/KitOutput";
import { LeadCapture } from "./components/LeadCapture";
import "./App.css";

function App() {
  const [kit, setKit] = useState<GeneratedKit | null>(null);
  const [lastInput, setLastInput] = useState<WebinarInput | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [webhookUrl, setWebhookUrlState] = useState(getWebhookUrl);
  const kitRef = useRef<HTMLDivElement>(null);

  function handleGenerate(input: WebinarInput) {
    const generated = generateKit(input);
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
              Turn a rough webinar idea into a complete growth campaign.
              <br />
              <span className="tagline-sub">
                Positioning · Copy · Emails · Ads · Checklists — no API keys
                needed.
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
              <span>Webhook URL (n8n or any endpoint)</span>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => handleWebhookSave(e.target.value)}
                placeholder="https://your-n8n.example.com/webhook/webinar-rescue-kit-intake"
              />
            </label>
            <p className="settings-note">
              n8n reference: workflow <code>8KuTrjP8voivf8QD</code>, path{" "}
              <code>webinar-rescue-kit-intake</code> (inactive, validated in
              Bada n8n). Set your own webhook URL to receive lead submissions as
              JSON POST.
            </p>
          </div>
        )}
      </header>

      <main className="wrk-main">
        <Form onGenerate={handleGenerate} />

        {kit && lastInput && (
          <div ref={kitRef} className="kit-container">
            <KitOutput kit={kit} />
            <LeadCapture input={lastInput} kit={kit} />
          </div>
        )}
      </main>

      <footer className="wrk-footer">
        <p>
          <span className="footer-brand">◆ Bada Digital</span> — Event Lead
          Growth
        </p>
        <p className="footer-sub">
          Webinar Rescue Kit is a free tool. No data is sent anywhere unless you
          configure a webhook.
        </p>
      </footer>
    </div>
  );
}

export default App;
