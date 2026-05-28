# Changelog

## v1.0.0-prod — 2026-05-28
- Production hardening pass on Codex's v0.1-shipped scaffold. Confirmed CI + Pages workflow green on `main` at HEAD before tagging `v1.0-prod`.
- Codex's v2-era scaffold already carries the `## Production status` block, `## Part of the Kinetic Gain Suite` SEO footer, `Monetization ladder` with honest tier wording, and KGE `/embedded` tie-back — confirmed unchanged, no narrative edits.
- Added `flows.kineticgain.com` to `procurement-pulse-engine/universe.csv` per the v2 "every deploy enters universe" rule.
- **v2-strategy Phase 0 anchor #3** — Growth Ops sub-vertical (Klaviyo email/SMS marketing platform). Closes the v2 strategy Phase 0 trio alongside watsonx (Workflow/CX) and genesys (Workflow/CX, contact-center).
- No `src/`, README narrative, docs, or screenshot edits — squad doctrine v1.1 respects the v0.1-shipped operator-surface as Codex shipped it.

## v0.1-shipped - 2026-05-28

- initial public release of `klaviyo-flow-consent-audit`
- shipped a Growth Ops operator surface for consent evidence, audience suppression hygiene, attribution posture, and send-safe lifecycle flow sequencing
- added an offline analyzer + CLI for synthetic flow, packet, and escalation snapshots
- published the static dashboard, verification/docs routes, README proof screenshots, and GitHub Pages custom domain at `flows.kineticgain.com`
