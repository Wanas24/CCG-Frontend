# ST-05 — AI assistant

**Depends on:** ST-03

## 1. What this task is

Add the in-app AI assistant for a **signed-in user with a company on the JWT**. If there is no current company, ST-06 must finish first — do not open AI. Use ST-01 catalog, `handleSimpleResult`, dates, hints, and `canApi`. Do not poll. There is **no AI SignalR** — chat is one HTTP request per turn (it can take several seconds).

Mutating tools run on the server as soon as the model calls them. The model is told to ask the user first; the UI still shows `warnings` and never pretends the action is a dry run.

Two surfaces:

1. **Chat** (`/api/ai`) — compose, history, usage. Hide **send** unless `canApi(api.ai.chat)`.
2. **Subscriptions** (`/api/AiSubscription`) — company admin of who may use AI. Hide unless `canApi` on those entries.

## 2. Required APIs

Shared: Bearer, `X-Language`, `credentials: include`. Company required (400 `message` if missing). Unverified → ST-01 `errorCode: 1`.

Add these catalog entries (do not invent a second client).

### Chat — `AiAssistantController` (`/api/ai`)

| Client | Verb | Path | `permissions` | Body / query | Success `data` |
|---|---|---|---|---|---|
| `api.ai.chat` | POST | `/api/ai/chat` | `['AiAssistant.Chat']` | multipart (below) | `AiAssistantResponse` |
| `api.ai.chats` | GET | `/api/ai/chats` | `[]` (not seeded) | — | `AiChatSummary[]` (max 100, not archived) |
| `api.ai.messages` | GET | `/api/ai/chats/{chatId}/messages` | `[]` | `page` (default 1), `pageSize` (default 10, max 100) | `PagedResult<AiMessageResponse>` |
| `api.ai.archiveChat` | DELETE | `/api/ai/chats/{chatId}` | `[]` | — | — |
| `api.ai.usage` | GET | `/api/ai/usage` | `[]` | — | `AiUsageStatusResponse` |

`AiAssistant.All` / admin / manager also pass `canApi(api.ai.chat)`.

**POST `/api/ai/chat` — multipart/form-data.** Do **not** set `Content-Type: application/json`. Let the browser set the boundary.

| Field | Required | Notes |
|---|---|---|
| `Message` | one of Message or Audio | Max **4000** characters after the server joins transcript + typed text |
| `Audio` | one of Message or Audio | One file. Max **25 MB**. `.flac` `.m4a` `.mp3` `.mp4` `.mpeg` `.mpga` `.oga` `.ogg` `.wav` `.webm` |
| `Attachments` | no | Repeat the field. Max **5** files, **10 MB** each (server defaults) |
| `ChatId` | no | Omit for a new thread. Next turns send the `chatId` from the last response |

Request body limit is ~80 MB. Use `AbortSignal` on unmount / send-cancel.

```ts
type AiAssistantResponse = {
  chatId: string;
  answer: string;
  selectedToolGroups: string[];
  usedTools: string[];
  warnings: string[];
  sources: { type: string; id: string; label?: string }[];
  usage: AiTokenUsage;
  routerUsage: AiTokenUsage;
  quota?: AiQuotaSnapshot;
  artifacts: { fileName: string; contentType: string; contentBase64?: string; url?: string }[];
  transcript?: string;          // if Audio was sent
  transcriptionUsage?: AiTokenUsage;
  audioDurationMinutes?: number;
  tokensPerAudioSecond?: number;
};
type AiTokenUsage = { promptTokens?: number; completionTokens?: number; totalTokens?: number };
type AiQuotaSnapshot = {
  hasUnlimitedUsage: boolean;
  monthlyTokenLimit: number;
  monthlyMessageLimit: number;
  usedTokens: number;
  usedMessages: number;
  remainingTokens?: number | null;
  remainingMessages?: number | null;
  usagePeriodStartedAtUtc: string; // UTC → toClientDateTime
};
type AiChatSummary = {
  id: string; title: string; isArchived: boolean;
  createdAtUtc: string; updatedAtUtc: string; // UTC
};
type AiMessageResponse = {
  id: number;
  role: string;                 // "user" | "assistant"
  content: string;
  totalTokens: number;
  transcriptionTotalTokens: number;
  audioDurationMinutes?: number | null;
  tokensPerAudioSecond?: number | null;
  createdAtUtc: string;
};
type AiUsageStatusResponse = {
  isSubscribed: boolean;
  subscribedFromUtc?: string | null;
  subscribedToUtc?: string | null;
  historyMessageCount: number;
  currentPeriod?: AiQuotaSnapshot | null;
};
```

**Messages paging:** page 1 is the **newest** slice, already reversed into chronological order in `data`. Scroll **up** to load page 2 (older). Do not load the whole thread.

**Archive:** soft-delete. Archived chats disappear from `GET /api/ai/chats`. Confirm first.

**Usage / quota failures:** 400 `message` (not subscribed, expired, monthly token/message cap, audio tokens exceed remaining). Show `message`. After a successful chat, refresh usage from `data.quota` or `GET /api/ai/usage`.

**Company switch (ST-03):** drop `chatId`, reload chats + usage. Chats are per user **and** company.

### Subscriptions — `AiSubscriptionController`

Company-scoped. For managers / `AiSubscription.*`.

| Client | Verb | Path | `permissions` | Notes |
|---|---|---|---|---|
| `api.aiSubscriptions.list` | GET | `/api/AiSubscription` | `['AiSubscription.Get']` | `page`, `pageSize` (max 100), `search?`, `isManager?`, `isFired?`, `isActive?` → `PagedResult<AiCompanyUserSubscriptionResponse>` |
| `api.aiSubscriptions.get` | GET | `/api/AiSubscription/{userId}` | `['AiSubscription.Get']` | one member |
| `api.aiSubscriptions.update` | PUT | `/api/AiSubscription/{userId}` | `['AiSubscription.Update']` | JSON body below |

```ts
type AiSubscriptionUpdateRequest = {
  isSubscribed: boolean;
  subscribedFromUtc?: string | null;
  subscribedToUtc?: string | null;
  hasUnlimitedUsage: boolean;
  monthlyTokenLimit: number;
  monthlyMessageLimit: number;
  historyMessageCount: number; // default 10, clamp 0–100
};
```

`AiCompanyUserSubscriptionResponse` also has `firstName`, `lastName`, `email`, `isActive`, `isFired`, `isManager`, `hasSubscription`, plus the same quota fields. Dates are UTC.

Infinite scroll on the subscription list. Debounce `search`.

Hints (append to ST-01): `ai.composer`, `ai.voice`, `ai.quota`, `ai.archiveChat`, `ai.needsCompany`, `ai.needsPermission`, `ai.mutatingTools`.

## 3. Suggested implementation plan

This is an AI-suggested plan to help. It may not be 100% accurate for this repo — follow existing frontend patterns first.

1. Add the catalog group `api.ai` + `api.aiSubscriptions` with the `permissions` above.
2. Route `/ai` (and `/ai/subscriptions` if the user can manage subscriptions). Nav items use `canApi`.
3. Layout: chat list (desktop side / mobile sheet) + thread + composer. Load chats + usage once after company context exists.
4. Send: FormData. Optimistic user bubble; if `transcript` comes back, replace the voice placeholder. Render `answer` (markdown). Show `warnings`, `usedTools`, `sources`. Offer artifact download from `url` or `contentBase64`.
5. Older messages: sentinel at the **top**. One in-flight send; disable composer until it finishes or abort.
6. Subscriptions page only if `canApi(list)`. PUT then refresh that row.
7. No second token store. No polling. Respect `prefers-reduced-motion`. RTL + ~375 / ~768 / ~1280.

## 4. Test cases

- No company: ST-06 first. If AI is opened anyway, chat/list/usage show `message`; composer stays closed.
- No `AiAssistant.Chat`: send hidden; admin/manager can still send.
- New chat: omit `ChatId`; next send uses returned `chatId`.
- Text, voice, and attachments (1–5). Empty text+audio → `message`. Oversize / bad audio type → `message`.
- Quota / not subscribed → `message` via ST-01 (no `errorCode`).
- Open a thread: page 1 is latest; scroll up loads older. Archive removes it from the list.
- Company switch clears the thread and reloads chats.
- `errorCode: 1` / `2` follow ST-01. Hints from `hint(key)`.
- Subscriptions: hidden without permission; list pages by scroll; update persists.
