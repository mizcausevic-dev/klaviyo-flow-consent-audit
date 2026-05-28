# Security Notes

This repository is a public demonstration surface using **synthetic lifecycle-marketing, consent, and deliverability data only**.

## Scope

- No tenant credentials, API keys, OAuth secrets, or live customer records belong in this repo.
- The repo demonstrates consent-evidence routing and delivery-posture patterns, not a production Klaviyo control plane.
- Any hosted preview or embedded delivery should use read-only scopes, evidence-packet signing, and environment-managed secrets.

## Disclosure guidance

- Please open a private GitHub security advisory or contact the maintainer through the repository security tab if you find a vulnerability in the analyzer, CLI, Pages workflow, or sample artifacts.
- Do not submit real customer exports, message payloads, or tenant identifiers in public issues.
