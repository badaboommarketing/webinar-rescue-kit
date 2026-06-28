# Webinar Rescue Kit

Live demo: https://badaboommarketing.github.io/webinar-rescue-kit/

Repo: https://github.com/badaboommarketing/webinar-rescue-kit

A research-assisted web app that turns a rough webinar or event idea into a marketing-director-grade campaign kit: company/competitor research, competitor event signals, strategic angle, positioning, landing page copy, invite emails, reminder emails, follow-up sales sequence, ad angles, production checklist, sales handoff checklist, and proof/risk flags.

Built for Bada Digital's Event Lead Growth wedge. The app remains static-deployable and local-first, but it can now call an active n8n research workflow for company, competitor, market, and event-cadence intelligence.

## What it does

- Loads a realistic sample webinar brief.
- Accepts custom webinar/event inputs.
- Runs optional n8n research against a company, website, industry, audience, and competitor list.
- Returns a structured research brief with company positioning, competitor profiles, competitor event signals, market patterns, strategic gaps, recommended campaign angles, unanswered questions, and source links.
- Allows manual import of research JSON when research is produced elsewhere.
- Generates a structured campaign package instantly in the browser.
- Produces a director-facing campaign brief and webinar strategy before writing tactical assets.
- Calculates a rescue score and recommends the right Bada offer.
- Saves lead/intake payloads to localStorage.
- Captures UTM/source parameters with the intake payload.
- Gates export until the intake has usable contact, timeline, blocker, and consent data.
- Downloads the generated kit as Markdown or JSON.
- Posts lead payloads to a configurable n8n webhook when supplied.
- Provides a mailto fallback to Bada Digital.
- Flags missing proof instead of inventing claims.

## Local setup

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Verification

```bash
npm test
npm run build
npm run lint
```

Current verified commands are recorded in the handoff Slack message.

## Static deploy

This is a standard Vite static app.

```bash
npm run build
```

Deploy the `dist/` directory to Vercel, Netlify, Cloudflare Pages, or any static host.

Suggested live environment variables are not required for MVP. Webhook URL is intentionally user-configurable in the app settings so the same static build can point at dev, staging, or production n8n.

## n8n research workflow

An active workflow now powers the research phase:

- Workflow name: `Webinar Rescue Kit — Research Intelligence Engine`
- Workflow ID: `2T1jgmCry1bggrWJ`
- Webhook path: `webinar-rescue-kit-research`
- Production webhook URL: `https://badaboom.app.n8n.cloud/webhook/webinar-rescue-kit-research`
- Status: active
- Purpose: receive a research request, build a query plan, search the web, synthesize source-backed company/competitor/event intelligence, and return a normalized `researchBrief` object.

High-level workflow:

1. `Research Request Webhook` receives the app payload.
2. `Build Search Plan` creates company, market, event, and competitor search queries.
3. `Search Bing` performs HTTP searches for each query.
4. `Execute Web Research and Synthesize` parses results, extracts source links/snippets, estimates event signals, and builds the research brief.
5. `Return Research Brief` responds to the app as JSON.

Expected research request shape:

```json
{
  "request": {
    "companyName": "HubSpot",
    "companyWebsite": "https://www.hubspot.com",
    "industry": "B2B SaaS marketing automation",
    "targetAudience": "B2B marketing directors",
    "proposedTopic": "AI-assisted marketing pipeline generation",
    "competitorsRaw": "Marketo\nSalesforce Marketing Cloud\nON24"
  },
  "input": {
    "title": "AI Growth Stack Workshop",
    "topic": "AI-assisted marketing pipeline generation"
  }
}
```

Expected response shape:

```json
{
  "ok": true,
  "source": "webinar-rescue-kit-research",
  "researchBrief": {
    "company": {},
    "competitors": [],
    "competitorEventSignals": [],
    "marketPatterns": [],
    "strategicGaps": [],
    "sourceBackedAssumptions": [],
    "unansweredQuestions": [],
    "recommendedAngles": [],
    "sources": [],
    "confidence": "medium"
  }
}
```

The research layer is intentionally source-backed, not magic. Search results can still be noisy, so the generated campaign brief explicitly carries assumptions, unanswered questions, and proof guardrails.

## n8n intake workflow

A validated workflow exists in Bada n8n:

- Workflow name: `Webinar Rescue Kit — Local MVP Intake Webhook`
- Workflow ID: `8KuTrjP8voivf8QD`
- Webhook path: `webinar-rescue-kit-intake`
- Status: inactive at creation time
- Purpose: receive JSON POST payloads from the app and return a receipt

Expected app payload shape:

```json
{
  "lead": {
    "name": "Alex Example",
    "email": "alex@example.com",
    "company": "Example Co"
  },
  "input": {
    "title": "Pipeline Rescue: 5 Webinar Fixes That Actually Move Revenue",
    "topic": "Webinar-led pipeline generation for B2B teams"
  },
  "generatedAt": "2026-06-26T00:00:00.000Z"
}
```

To connect it:

1. Activate the workflow in n8n when ready.
2. Copy the production webhook URL.
3. Open the app settings panel.
4. Paste the webhook URL.
5. Submit a test lead.

The app still works without n8n. It saves locally and downloads JSON.

## Product notes

This MVP is built as an ad-facing lead magnet. The user-facing promise is simple: turn a webinar idea into a practical campaign package in minutes. The monetization path is a free generator, paid custom plan, then Bada Digital's Event Lead Growth service upsell.

No fake ROI, testimonials, attendance numbers, or client results are embedded. Any proof-dependent copy is marked as a placeholder.
