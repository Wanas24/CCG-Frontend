# ST-09 — Report layouts (gallery, designer, preview, defaults)

**Depends on:** ST-03 (signed in, company on the JWT, permissions loaded)

Reference prototype: `Alharmeen/wwwroot/HtmlTestPages/report-layout-studio.html`.

## 1. What this task is

One page where a manager controls how exported PDFs look. A layout is a saved set of page, header, footer, table, watermark and signature settings, and every PDF export uses one.

1. **Gallery**: every layout the company can use (its own plus the platform's system layouts), with a visual thumbnail, the default flag, the active flag and the quota.
2. **Designer**: edit one layout field by field with a live visual page mock next to it, then render the real PDF from the backend to confirm.
3. **Save**: update an existing company layout, or save the current draft as a new one.
4. **Lifecycle**: make a layout the company default, deactivate it, bring it back.
5. **Report types**: show which layout each report type used last, so it's obvious what an export will pick.

Use the ST-01 catalog, `handleSimpleResult`, hints and `canApi`. Do not poll. **No backend changes**: everything below already exists.

Rules that affect the UI:

- **System layouts** (`isSystem: true`, `companyId: null`) are seeded by the platform. They can be read, previewed and used, but `PUT` and `DELETE` on them return 400. Hide save and deactivate for them and offer **Duplicate** instead.
- **The company can own 10 active layouts.** Creating the eleventh returns 400. Show the quota before the user starts designing.
- `PUT` **replaces the whole layout**, including the signature list. There is no partial update: always send every field back, or unsent fields fall back to their DTO defaults.
- `DELETE` **is a soft deactivate**, not a delete. The row stays, `isActive` and `isDefault` become false, and exports stop seeing it. A `PUT` with `isActive: true` brings it back.
- Never ask the user to type a layout id, a colour name or an enum number. Ids come from the list; enums are pickers; colours are swatches.

