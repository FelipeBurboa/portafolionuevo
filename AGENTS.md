<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:felipeos-project-rules -->
# FelipeOS project rules

Read `CLAUDE.md` completely before making project changes. It is the source of
truth for editorial-content, visual-system, verification, and Git workflow.

Non-negotiable rules:

- Do not invent portfolio claims, links, contacts, résumés, screenshots, or
  other factual content. Keep placeholders visibly labelled until Felipe
  supplies real material.
- Update UI copy in both `messages/en.json` and `messages/es.json`; keep
  editorial content in paired locale files under `content/`.
- Do not run automated test, build, lint, E2E, Lighthouse, or browser-test
  commands unless Felipe explicitly asks. Felipe verifies the app manually.
- Never push directly to `main`. Use a focused branch and a PR targeting
  `main` for every completed change set.
- Desktop windows remain non-modal; mobile remains a single modal sheet.
<!-- END:felipeos-project-rules -->
