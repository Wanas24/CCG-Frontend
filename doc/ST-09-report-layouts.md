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
- **`PUT` replaces the whole layout**, including the signature list. There is no partial update: always send every field back, or unsent fields fall back to their DTO defaults.
- **`DELETE` is a soft deactivate**, not a delete. The row stays, `isActive` and `isDefault` become false, and exports stop seeing it. A `PUT` with `isActive: true` brings it back.
- Never ask the user to type a layout id, a colour name or an enum number. Ids come from the list; enums are pickers; colours are swatches.

## 2. Required APIs

Shared: Bearer, `X-Language`, `credentials: include`. **A company is required on the JWT** — without one every call returns 403 with the "company required" message.

Every response is `SimpleResult<T>` = `{ isSuccess, message, data, errorCode }` (camelCase) **except `preview-sample`**, which returns raw PDF bytes on success and `SimpleResult` JSON on failure.

Permission keys are `Controller.Action`, compared case-insensitively. Admins and managers pass every check. "Used" means the prototype page calls it.

### ReportLayoutController — `/api/ReportLayout`

| Client | Verb | Path | `permissions` | Body / query | Success `data` | Used |
|---|---|---|---|---|---|---|
| `api.reportLayout.list` | GET | `/api/ReportLayout` | `['ReportLayout.GetLayouts']` | `includeInactive?` (default `false`) | `Layout[]` — a **plain array**, not `PagedResult` | ✅ |
| `api.reportLayout.get` | GET | `/api/ReportLayout/{layoutId}` | `['ReportLayout.GetById']` | — | `Layout` | ✅ |
| `api.reportLayout.lastUsed` | GET | `/api/ReportLayout/last-used/{reportType}` | `['ReportLayout.GetLastUsedLayout']` | — | `Layout` | ✅ |
| `api.reportLayout.create` | POST | `/api/ReportLayout` | `['ReportLayout.Create']` | `LayoutInput` | `Layout` (with the new `id`) | ✅ |
| `api.reportLayout.update` | PUT | `/api/ReportLayout/{layoutId}` | `['ReportLayout.Update']` | `LayoutInput` | `Layout` | ✅ |
| `api.reportLayout.deactivate` | DELETE | `/api/ReportLayout/{layoutId}` | `['ReportLayout.Deactivate']` | — | — | ✅ |
| `api.reportLayout.preview` | POST | `/api/ReportLayout/preview-sample` | `['ReportLayout.PreviewSample']` | `PreviewInput` | **PDF bytes** (`application/pdf`) | ✅ |

`layoutId` is a GUID. A non-GUID segment doesn't reach the controller (404 from routing).

Notes per endpoint:

- **`list`** always returns the company's layouts **plus** the platform's system layouts, sorted system first, then default, then by name. It also seeds `SYSTEM_DEFAULT` on first call, so the list is never empty. `includeInactive: true` is needed to see deactivated layouts.
- **`get`** only finds the layout when it belongs to this company or is a system layout. Anything else is 400 "layout not found" — treat it as "gone" and reload the list.
- **`lastUsed`** returns 400 when the report type has never been exported, or when the stored layout was deactivated. That is a normal empty state, not an error to shout about.
- **`create`** forces `companyId` to the caller's company and `isSystem` to false. You cannot create a system layout. It fails with 400 when the code is taken (`Layout code 'X' already exists for this company.`) or the quota is full (`Company layout limit reached (10)...`).
- **`update`** fails with 400 on a system layout (`System layouts cannot be modified as company layouts.`) and on an unknown id. It does **not** pre-check the code, so sending a code another layout already owns breaks on the unique index and surfaces as a server error instead of a friendly 400 — keep the duplicate check on the client.
- **`deactivate`** fails with 400 on a system layout (`System layouts cannot be deactivated.`).
- **`preview-sample`** renders a throwaway PDF from the body — nothing is saved, and no `layoutId` is involved. Read the response as a blob **only after checking `content-type`**; on failure the body is `SimpleResult` JSON and `message` carries the render error.

### Both write endpoints ignore some fields

`companyId`, `isSystem` and `razorLayoutKey` are overwritten by the server (`razorLayoutKey` is always `"Document"`). Send them or leave them out — the result is the same. Don't build UI for them.

### Types

```ts
type Layout = LayoutInput & {
  id: string;                  // GUID
  companyId: number | null;    // null on system layouts
  isSystem: boolean;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  signatures: Signature[];     // sorted by displayOrder
};

type LayoutInput = {
  // identity
  code: string; name: string; description?: string | null;
  isDefault: boolean; isActive: boolean;
  defaultContentTemplateKey?: "Table" | "Text" | null;
  defaultTitle?: string | null; defaultSubtitle?: string | null;
  // page
  paperSize: 1 | 2 | 3 | 4;            // A4 | A3 | Letter | Legal
  orientation: 1 | 2;                  // Portrait | Landscape
  direction: 1 | 2;                    // Ltr | Rtl
  marginTopMm: number; marginBottomMm: number; marginLeftMm: number; marginRightMm: number;
  pageBackgroundColor?: string | null;
  fontFamily?: string | null; baseFontSizePt: number;
  // brand
  primaryColor?: string | null; secondaryColor?: string | null; accentColor?: string | null;
  // title band
  showTitleBand: boolean; titleAlign: 1 | 2 | 3;      // Left | Center | Right
  titleFontFamily?: string | null; titleFontSizePt: number; titleFontColor?: string | null;
  // header
  showHeader: boolean; repeatHeaderOnEveryPage: boolean; showHeaderBorder: boolean;
  headerHeightMm: number; headerFontSizePt: number; headerFontFamily?: string | null;
  headerBackgroundColor?: string | null; headerBorderColor?: string | null; headerFontColor?: string | null;
  headerLeftText?: string | null; headerCenterText?: string | null; headerRightText?: string | null;
  showLogo: boolean; logoUrl?: string | null; logoPosition: 1 | 2 | 3; logoWidthMm: number; logoHeightMm: number;
  // table
  tableHeaderBackgroundColor?: string | null; tableHeaderFontColor?: string | null;
  tableHeaderFontSizePt: number; tableHeaderBold: boolean;
  tableRowBackgroundColor?: string | null; tableAltRowBackgroundColor?: string | null;
  tableBorderColor?: string | null; showTableGridLines: boolean; tableCellPaddingMm: number;
  // footer
  showFooter: boolean; repeatFooterOnEveryPage: boolean; showFooterBorder: boolean;
  footerHeightMm: number; footerFontSizePt: number; footerFontFamily?: string | null;
  footerBackgroundColor?: string | null; footerBorderColor?: string | null; footerFontColor?: string | null;
  footerLeftText?: string | null; footerCenterText?: string | null; footerRightText?: string | null;
  showPageNumbers: boolean; pageNumberFormat: string; pageNumberAlign: 1 | 2 | 3;
  showGeneratedAt: boolean; generatedAtLabel?: string | null; generatedAtFormat?: string | null;
  // watermark
  showWatermark: boolean; watermarkText?: string | null; watermarkColor?: string | null;
  watermarkOpacity: number; watermarkFontSizePt: number;
  // signatures
  showSignatureBorder: boolean;
  signatures: Signature[];
};

type Signature = {
  id?: string | null;          // ignored on write — the server always issues new ids
  label: string;               // required
  title?: string | null; name?: string | null; instructions?: string | null;
  imageUrl?: string | null;
  isSignature: boolean;        // draw a signature line
  repeatOnEveryPage: boolean;  // print inside the footer of every page
  displayOrder: number;        // sort key
  align: 1 | 2 | 3;
  widthMm: number; heightMm: number;
  showDateLine: boolean; dateLabel?: string | null; showNameLine: boolean;
};

type PreviewInput = {
  title?: string | null;       // null → defaultTitle → name
  subtitle?: string | null;    // null → defaultSubtitle
  contentKind: 1 | 2;          // Table | PlainText — 3 (Custom) returns 400
  layout: LayoutInput;         // the draft, not saved
  sampleTable?: ReportTable;   // optional, a built-in sample is used otherwise
  sampleText?: ReportTextContent;
  timeZoneId?: string | null;  // defaults to the company time zone
};
```

### Defaults and limits

Send the defaults for a new layout rather than omitting fields, so what the user sees is what is stored.

| Field group | Defaults | Max length |
|---|---|---|
| `code` / `name` / `description` | `""` / `""` / `null` — code and name are **required** | 100 / 250 / 1000 |
| Paper | `paperSize 1`, `orientation 1`, `direction 2` (RTL), margins `15` mm | — |
| Fonts | `fontFamily "Segoe UI"`, `baseFontSizePt 11`, `titleFontSizePt 16` | family 100 |
| Brand | `primaryColor #1F4E79`, `secondaryColor #5B9BD5`, `accentColor #F2F2F2` | colour 20 |
| Header | on, repeating, bordered, `25` mm, `10` pt, logo on at `30 × 18` mm, position `3` (right) | texts 2000, `logoUrl` 1000 |
| Title band | on, centered | `defaultTitle` / `defaultSubtitle` 500 |
| Table | header `#1F4E79` on white text, `10` pt, bold, rows `#FFFFFF` / `#F2F2F2`, border `#D0D0D0`, grid on, padding `2` mm | — |
| Footer | on, repeating, bordered, `20` mm, `9` pt, page numbers `{current} / {total}` centered, generated-at on with `Generated at` / `yyyy-MM-dd HH:mm` | format 50, label 100 |
| Watermark | off, `#E0E0E0`, opacity `0.15`, `48` pt | text 1000 |
| Signature | `isSignature true`, `showNameLine true`, `showDateLine true`, `dateLabel "Date"`, `align 2`, `40 × 20` mm | label / title / name / `imageUrl` 1000, `dateLabel` 200, instructions 2000 |

Over-length values are rejected by the database, not by a friendly validator, so enforce the limits with `maxlength` on the inputs.

### How the stored values turn into a PDF

Build the preview around these rules — they are what makes the page worth looking at:

| Setting | Effect |
|---|---|
| `direction: 2` (RTL) | The whole document is RTL, so the header and footer **cells flip**: "left text" prints on the right, and table columns start from the right. |
| `repeatHeaderOnEveryPage` | On → the header is printed in the top margin of every page, and the usable height is `pageHeight − (marginTop + headerHeightMm) − …`. Off → the header is printed once inside the body of page 1 and the top margin stays `marginTop`. |
| `repeatFooterOnEveryPage` | On → footer in the bottom margin of every page with real page counters. Off → footer printed once after the content, and `{current}`/`{total}` become `1`/`N` because counters only work in repeating chrome. |
| `footerHeightMm` | Only reserved when something repeats there (footer chrome or a repeating signature). A one-shot footer with no repeating signature reserves nothing. |
| `headerCenterText` empty | The report title is printed in the center cell. |
| `showGeneratedAt` | The stamp takes the footer **right** cell and `footerRightText` is ignored. |
| `pageNumberAlign` | Appends the counters to that cell's text instead of replacing it. |
| `titleFontColor`, `headerFontColor`, `headerBorderColor`, `footerBorderColor` empty | Fall back to `primaryColor`. `footerFontColor` falls back to `#475569`; header and footer backgrounds fall back to transparent. |
| `titleFontFamily`, `headerFontFamily`, `footerFontFamily` empty | Fall back to `fontFamily`. The font must exist on the PDF server — an unknown name silently renders with a fallback. |
| `logoUrl` | Downloaded and inlined at render time, so it must be reachable from the server. `logoHeightMm` is clamped to the header height. |
| Signatures | `repeatOnEveryPage: false` → printed after the content on the last page at the **base** font size. `true` → printed in the footer of every page at the **footer** font size. `imageUrl` replaces the signature line. |
| `secondaryColor`, `accentColor` | Stored, but no current PDF template reads them. Label them as reserved instead of pretending they do something. |
| `defaultContentTemplateKey` | Used by real exports when the caller passes no template. The preview ignores it and follows `contentKind`. |

**Placeholders** usable in any header or footer text: `{{Title}}`, `{{Subtitle}}`, `{{Date}}` (also `{{GeneratedAt}}`), `{{Company}}`. Unknown placeholders resolve to an empty string. Offer them as insert buttons — don't make the user remember the syntax.

### Which layout an export uses

Not part of this page's writes, but the page has to explain it, because it's the first thing a user asks:

1. The explicit `layoutId` on the export call (must be active and visible to the company).
2. Otherwise the layout last used for that report type (`last-used/{reportType}`).
3. Otherwise the active company layout flagged `isDefault`, then any active company layout by name.
4. Otherwise the system default.

Known report type keys: `Projects`, `Clients`, `ProjectLocations`, `ProjectResponsibleEngineers`, `Boqs`, `BoqItems`.

## 3. Flows

### Page load

1. `list({ includeInactive })` once. A 403 here means no permission or no company — show the message and stop; there is nothing else to load.
2. Render the gallery from that single response: `list` already returns full layouts including signatures, so cards and thumbnails need no extra calls.
3. Compute from the same data: total, company vs system split, active company count (quota `n / 10`), and the current default.

### Designing

1. **Open** uses `get(id)` so the editor always starts from server state, then keeps a pristine copy as the baseline.
2. Edits only touch the local draft. Show the diff against the baseline ("12 unsaved changes") and a **Revert**.
3. The visual mock is computed on the client and updates on every keystroke. The backend PDF is a separate, explicit action (plus an opt-in "auto" with a debounce of ~700 ms) because every render costs a headless browser page.
4. Show margin, header and footer boundaries as toggleable guides, and render **two pages** so `repeatHeaderOnEveryPage`, `repeatFooterOnEveryPage` and repeating signatures are visible rather than described.
5. Run the checks continuously: required fields, lengths, duplicate code, quota, system-layout read-only, "watermark on with no text", "logo on with no URL", and "only N mm left for content".

### Saving

- **Update** (`update(id, full body)`) is only offered for company layouts, and only when there are no blocking checks. On success, reload the list and re-baseline from the response.
- **Save as new** asks for a code and a name in a small modal (pre-filled with a free code, e.g. `TENANT_BLUE_2`), then `create(full body)`. On success switch the editor to the created layout.
- **Duplicate** loads the source with `get`, suffixes code and name, clears `isDefault`, and leaves the editor in "new layout" mode.
- `Ctrl`/`Cmd` + `S` does the obvious thing: update when a company layout is open, otherwise open "Save as new".

### Default, deactivate, reactivate

All three are a `PUT`/`DELETE` on a layout the page already has in full, so build the body from the stored layout with one flag changed — never from the editor draft:

- **Make default**: `update(id, { ...stored, isDefault: true })`. Warn first that the current default loses the flag.
- **Deactivate**: confirm, then `deactivate(id)`. Say that it is reversible.
- **Reactivate**: `update(id, { ...stored, isActive: true })`.

### Preview

```ts
preview({ title, subtitle, contentKind, layout: draft })  // title/subtitle: null when empty, to exercise the fallbacks
```

Check `content-type` before reading the body. On success show the blob in an iframe and revoke the previous object URL. On failure show `message` in place and stop any auto-preview loop so one bad value doesn't fire a render per keystroke. Mark the rendered PDF **stale** as soon as the draft changes again.

### Report types

Per report type, `lastUsed(type)` on demand (a button, and a "check all" that fans out). A 400 is the "never exported yet" state: show it as a neutral badge with the resolution order next to it, not as a failure.

### Visibility (`canApi`)

| Control | Entry |
|---|---|
| The page itself, gallery | `reportLayout.list` |
| Open / Duplicate | `reportLayout.get` |
| Save as new | `reportLayout.create` |
| Update, Make default, Reactivate | `reportLayout.update` |
| Deactivate | `reportLayout.deactivate` |
| Render PDF, auto preview | `reportLayout.preview` |
| Report types view | `reportLayout.lastUsed` |

A user with only `GetLayouts` and `GetById` gets a read-only browser: thumbnails and the inspector still work, every save control is gone.

## 4. Test cases

- The gallery shows company and system layouts in one list, with the default, inactive and system badges, and the quota reads `n / 10`.
- "Show inactive" off hides deactivated layouts; on, they appear dimmed with a Reactivate action.
- A system layout opens read-only: no Update, no Deactivate, and a hint pointing at Duplicate. Forcing a `PUT` returns 400 with the system-layout message.
- Creating a layout with a code another company layout already uses shows the server's duplicate-code message and changes nothing; on update the same clash is caught by the client before the request leaves.
- With 10 active company layouts, Save as new is blocked with the limit message before the request is sent.
- Update sends every field: reopening the layout shows the same values, and a field the form never touched is unchanged.
- Removing a signature block and updating leaves exactly the remaining blocks; their ids differ from before (the server reissues them).
- Making layout B the default clears the flag on layout A, and the stats card updates after the reload.
- Deactivating the default layout clears `isActive` and `isDefault`; exports then fall back to another layout.
- Switching `direction` to RTL flips the header cells and the table column order in both the mock and the rendered PDF.
- Turning off `repeatHeaderOnEveryPage` moves the header into page 1 only, and page 2 gains the reclaimed space — visible in the mock and the PDF.
- Turning off `showGeneratedAt` makes `footerRightText` take effect; turning it on marks that field as ignored.
- `showWatermark` with an empty text, and `showLogo` with an empty URL, both produce a warning instead of a confusing blank area.
- A preview failure (for example an unreachable `logoUrl`) shows `message` in the preview pane and switches auto-preview off.
- `last-used/Projects` after an export names the layout used; a never-exported type shows the neutral "no preference" state.
- With `GetLayouts` only, the page lists layouts and hides every write control; no 403 toast appears on load.
- No company on the JWT: the page shows the "company required" message once and renders nothing else.
