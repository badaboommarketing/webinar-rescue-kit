# Webinar Rescue Kit

A local-first web app that turns a rough webinar or event idea into a complete growth kit: positioning, landing page copy, invite emails, reminder emails, follow-up sales sequence, ad angles, production checklist, sales handoff checklist, and proof/risk flags.

Built for Bada Digital's Event Lead Growth wedge. The MVP is static-deployable and does not require paid APIs.

## What it does

- Loads a realistic sample webinar brief.
- Accepts custom webinar/event inputs.
- Generates a structured campaign package instantly in the browser.
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

## n8n intake workflow

A validated inactive workflow exists in Bada n8n:

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
