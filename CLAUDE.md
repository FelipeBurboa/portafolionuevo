# FelipeOS contribution rules

## Editorial content

- Never invent or publish factual portfolio claims, employers, metrics, client names, screenshots, live URLs, repository URLs, email addresses, social profiles, or résumé files.
- Until Felipe supplies real material, keep all placeholders visibly labelled as sample content and leave unavailable links inactive.
- Put UI/chrome copy in both `messages/en.json` and `messages/es.json`.
- Put editorial content in paired locale files under `content/<slug>/en.ts` and `content/<slug>/es.ts` (MDX is acceptable when rendering support exists). Do not add only one locale.
- Preserve the established typed shapes when editing sample data:
  - Projects: `src/lib/projects/types.ts`
  - About/contact: `src/lib/profile/types.ts`
- Replace a sample project by editing its paired files; preserve its stable `slug` unless its route and links are updated in the same change.
- When real CV PDFs or project images arrive, add only the supplied files under `public/` and update their paired locale data. Never create fake binary assets.
- Keep content concise, concrete, bilingual, and consistent between EN/ES. Translate meaning, not word order.

## Working rules

- Do not run automated unit, build, lint, E2E, Lighthouse, or browser test commands unless Felipe explicitly asks for them. Felipe verifies the app manually.
- Before editing an existing Traycer artifact, read its comment threads.
- Preserve the terminal visual system: dark green-tinted surfaces, phosphor green as the primary accent, amber only for warnings/highlights, no gradients or glassmorphism.
- Desktop windows are non-modal. Mobile uses a single modal sheet. Do not merge those interaction models.

## Git and pull-request workflow

- Never push directly to `main`.
- Create a focused branch for every change: `feat/<topic>`, `fix/<topic>`, `content/<topic>`, or `chore/<topic>`.
- Make commits that describe the user-visible change. Keep unrelated changes out of a PR.
- Push the branch and open a pull request against `main` for every completed change set.
- In the PR description, summarize the visible behavior, note manual verification completed by Felipe, and call out remaining placeholders or release inputs.
