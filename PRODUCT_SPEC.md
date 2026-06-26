# Webinar Rescue Kit MVP Spec

## Product
A local-first web app that turns a rough webinar/event idea into a complete growth kit: positioning, landing page copy, emails, ads, follow-up, and implementation checklist.

## Market need
Target users are founders, consultants, course creators, agencies, SaaS marketers, and mid-market marketing teams who know webinars/events can drive pipeline but cannot quickly turn an idea into a credible campaign.

## Core MVP requirements
- One-page polished app that is easy to push live.
- Structured input form for webinar/event details.
- Deterministic generator that produces a credible, specific plan without paid APIs.
- Generated output sections:
  - executive snapshot
  - webinar positioning
  - registration landing page copy
  - 5-email invite/reminder sequence
  - post-webinar follow-up sequence
  - paid ad angles
  - sales handoff checklist
  - production/run-of-show checklist
  - risk flags and missing proof
- Lead/intake path that is not dead:
  - local lead capture saved in browser localStorage
  - downloadable JSON bundle
  - configurable webhook POST endpoint for n8n
  - mailto fallback for Bada Digital
- Sample data path and custom input path.
- README with run/build/deploy notes.
- Tests for generator and storage/webhook helpers.
- No invented performance claims, testimonials, or fake stats.
- Bada Digital CTA for Event Lead Growth, but no external posting/sending.

## Technical preference
- React + TypeScript + Vite.
- No database required for MVP.
- Deployable to Vercel/Netlify as static app.
- Keep dependencies minimal.
- Use CSS with the Bada visual lane: sharp, practical, slight early-web/ASCII/pixel-grid flavor, not generic SaaS gradient soup.

## N8n integration
The app should include a webhook URL setting. If set, lead submissions POST a JSON payload to it. Include an n8n workflow JSON or docs for an intake webhook that receives the payload and returns success.

## Acceptance
- `npm run build` passes.
- `npm test` passes.
- App can run locally with `npm run dev`.
- Generated kit can be created using sample input without external API keys.
