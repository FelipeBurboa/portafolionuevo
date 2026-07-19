# Editorial content — locale pairing convention

Two kinds of copy live in this project, split by ownership:

| Kind | Lives in | Format | Examples |
|---|---|---|---|
| **UI labels / chrome** | `messages/{en,es}.json` | next-intl catalogs (ICU) | button text, menu labels, "start", "ready", errors |
| **Editorial content** | `content/<slug>/` | one file per locale | project write-ups, About bio, résumé prose |

## Editorial content rule

Each editorial document is a directory under `content/` with **one file per
locale**:

```
content/
  about/
    en.mdx
    es.mdx
  projects/
    dashboard-iram/
      en.mdx
      es.mdx
```

- Every slug **must** have an `en` and an `es` variant (`.mdx` preferred; `.ts`
  allowed for structured data).
- A missing variant **fails the build** via `scripts/check-content.mjs` (runs
  before `next build`). This prevents shipping a page that silently falls back
  to the wrong language.

Do not put editorial prose in the JSON catalogs, and do not put UI labels in
`content/`. MDX rendering is wired up in a later ticket (T8); this ticket
establishes the convention and the guard.

> `_example/` is a template pair demonstrating the convention. Delete it once
> real content exists.

## Current project sample

`content/portfolio-demo/{en,es}.ts` is a deliberately fictional, bilingual
case-study fixture used to build the Projects app before Felipe supplies a
showable private project. It is labelled as sample content in the UI and has
no fabricated public links. Replace its two records (or the whole directory)
with a real project while preserving the `Project` shape in
`src/lib/projects/types.ts`.
