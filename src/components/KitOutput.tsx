import type { GeneratedKit } from "../types";

interface KitOutputProps {
  kit: GeneratedKit;
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="kit-section" id={id}>
      <h3>
        <span className="section-marker">█</span> {title}
      </h3>
      {children}
    </section>
  );
}

function CopyBlock({ text }: { text: string }) {
  return (
    <pre className="copy-block">
      <code>{text}</code>
    </pre>
  );
}

export function KitOutput({ kit }: KitOutputProps) {
  return (
    <div className="kit-output">
      <div className="kit-header">
        <h2>┌─ Your Rescue Kit</h2>
        <nav className="kit-nav">
          <a href="#snapshot">Snapshot</a>
          <a href="#positioning">Positioning</a>
          <a href="#landing-page">Landing Page</a>
          <a href="#email-sequence">Emails</a>
          <a href="#follow-up">Follow-Up</a>
          <a href="#ads">Ads</a>
          <a href="#sales-handoff">Sales</a>
          <a href="#production">Production</a>
          <a href="#risk-flags">Risks</a>
        </nav>
      </div>

      {/* ── Executive Snapshot ── */}
      <Section id="snapshot" title="Executive Snapshot">
        <CopyBlock text={kit.executiveSnapshot} />
      </Section>

      {/* ── Positioning ── */}
      <Section id="positioning" title="Webinar Positioning">
        <div className="positioning-grid">
          <div>
            <h4>Angle</h4>
            <p>{kit.positioning.angle}</p>
          </div>
          <div>
            <h4>Differentiation</h4>
            <p
              className={
                kit.positioning.differentiation.startsWith("[MISSING]")
                  ? "flag-text"
                  : ""
              }
            >
              {kit.positioning.differentiation}
            </p>
          </div>
          <div>
            <h4>Value Proposition</h4>
            <p>{kit.positioning.valueProposition}</p>
          </div>
          <div>
            <h4>Audience Insight</h4>
            <p>{kit.positioning.audienceInsight}</p>
          </div>
        </div>
      </Section>

      {/* ── Landing Page Copy ── */}
      <Section id="landing-page" title="Registration Page Copy">
        <div className="landing-preview">
          <div className="lp-headline">{kit.landingPage.headline}</div>
          <div className="lp-subheadline">{kit.landingPage.subheadline}</div>
          <ul className="lp-bullets">
            {kit.landingPage.bullets.map((b, i) => (
              <li key={i}>✓ {b}</li>
            ))}
          </ul>
          <div className="lp-cta">{kit.landingPage.ctaButton}</div>
          <p className="flag-text">{kit.landingPage.socialProofNote}</p>
          <p className="lp-urgency">{kit.landingPage.urgencyElement}</p>
        </div>
      </Section>

      {/* ── Email Invite/Reminder Sequence ── */}
      <Section id="email-sequence" title="5-Email Invite/Reminder Sequence">
        {kit.emailSequence.map((email, i) => (
          <div className="email-card" key={i}>
            <div className="email-meta">
              <strong>{email.label}</strong>
              <span className="email-timing">⏱ {email.sendTiming}</span>
            </div>
            <div className="email-fields">
              <div>
                <span className="field-label">Subject:</span> {email.subject}
              </div>
              <div>
                <span className="field-label">Preheader:</span>{" "}
                {email.preheader}
              </div>
            </div>
            <CopyBlock text={email.body} />
          </div>
        ))}
      </Section>

      {/* ── Post-Webinar Follow-Up ── */}
      <Section id="follow-up" title="Post-Webinar Follow-Up Sequence">
        {kit.postWebinarFollowUp.map((email, i) => (
          <div className="email-card" key={i}>
            <div className="email-meta">
              <strong>{email.label}</strong>
              <span className="email-timing">⏱ {email.sendTiming}</span>
            </div>
            <div className="email-fields">
              <div>
                <span className="field-label">Subject:</span> {email.subject}
              </div>
              <div>
                <span className="field-label">Preheader:</span>{" "}
                {email.preheader}
              </div>
            </div>
            <CopyBlock text={email.body} />
          </div>
        ))}
      </Section>

      {/* ── Paid Ad Angles ── */}
      <Section id="ads" title="Paid Ad Angles">
        {kit.adAngles.map((ad, i) => (
          <div className="ad-card" key={i}>
            <div className="ad-platform">{ad.platform}</div>
            <div className="ad-content">
              <div>
                <span className="field-label">Headline:</span> {ad.headline}
              </div>
              <CopyBlock text={ad.body} />
              <div>
                <span className="field-label">CTA:</span> {ad.cta}
              </div>
            </div>
            <details className="ad-targeting">
              <summary>Targeting Notes</summary>
              <p>{ad.targetingNotes}</p>
            </details>
          </div>
        ))}
      </Section>

      {/* ── Sales Handoff ── */}
      <Section id="sales-handoff" title="Sales Handoff Checklist">
        <ol className="checklist">
          {kit.salesHandoff.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </Section>

      {/* ── Production Checklist ── */}
      <Section id="production" title="Production / Run-of-Show Checklist">
        <ol className="checklist production-checklist">
          {kit.productionChecklist.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </Section>

      {/* ── Risk Flags ── */}
      <Section id="risk-flags" title="Risk Flags & Missing Proof">
        {kit.riskFlags.length === 0 ? (
          <p className="no-risks">No major risks flagged. Nice work.</p>
        ) : (
          <ul className="risk-list">
            {kit.riskFlags.map((flag, i) => (
              <li key={i} className="risk-item">
                <span className="risk-icon">⚠</span> {flag}
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
