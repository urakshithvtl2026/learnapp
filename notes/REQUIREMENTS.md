# Angular Language Learn App — Requirements Document

## Overview

A single-page Angular application that helps users learn vocabulary by presenting words with their descriptions randomly. Users can navigate through words, mark words as already learnt, and skip words they want to revisit later.

---

## Functional Requirements

### 1. Word Data

- A `words.json` file must contain **at least 10 word entries**.
- Each entry must include:
  - `id` — unique identifier (number or string)
  - `word` — the vocabulary word (string)
  - `description` — definition or explanation of the word (string)
- Optional fields per entry:
  - `example` — example sentence using the word (string)
  - `category` — topic/category tag (string)

**Example entry:**
```json
{
  "id": 1,
  "word": "Ephemeral",
  "description": "Lasting for a very short time; transitory.",
  "example": "The ephemeral beauty of cherry blossoms makes them precious.",
  "category": "adjective"
}
```

---

### 2. Skipped Words

- A separate `skipped.json` file stores the IDs of words the user has chosen to skip.
- Skipped words are **excluded** from the random word pool during a session.
- The user can later review or clear skipped words.

**Example structure:**
```json
{
  "skipped": [3, 17, 42, 108]
}
```

---

### 3. Learnt Words

- A separate `learnt.json` file stores the IDs of words marked as already learnt.
- Learnt words are **excluded** from the random word pool by default.
- The user can optionally view learnt words in a review mode.

**Example structure:**
```json
{
  "learnt": [1, 5, 23, 99]
}
```

---

## UI Requirements

### Main Card View

```
┌─────────────────────────────────────────┐
│                                         │
│           [ Word ]                      │
│        Ephemeral                        │
│                                         │
│─────────────────────────────────────────│
│                                         │
│           [ Description ]              │
│  Lasting for a very short time;         │
│  transitory.                            │
│                                         │
│  Example: The ephemeral beauty of       │
│  cherry blossoms makes them precious.   │
│                                         │
│─────────────────────────────────────────│
│                                         │
│  [ Skip ]  [ Already Learnt ]  [ Next ] │
│                                         │
└─────────────────────────────────────────┘
│  Progress: 312 / 1000 remaining         │
└─────────────────────────────────────────┘
```

### UI Elements

| Element | Description |
|---|---|
| **Word display** | Large, prominent heading showing the current word |
| **Description panel** | Text area below the word showing its definition |
| **Example sentence** | Optional field shown below the description |
| **Next button** | Loads the next randomly selected word from the active pool |
| **Already Learnt button** | Marks the current word as learnt and removes it from the pool; loads next word |
| **Skip button** | Marks the current word as skipped and removes it from the pool; loads next word |
| **Progress indicator** | Shows how many words remain in the active pool |

---

## Application Flow

```
App Start
    │
    ▼
Load words.json (10+ entries)
Load skipped.json
Load learnt.json
    │
    ▼
Build active pool
(all words − skipped − learnt)
    │
    ▼
Pick random word from active pool
    │
    ▼
Display word + description
    │
    ├── [Next]          → Pick next random word
    ├── [Skip]          → Save word ID to skipped.json → Next word
    └── [Already Learnt]→ Save word ID to learnt.json  → Next word
    │
    ▼
If active pool is empty
    → Show completion screen
       "You have reviewed all available words!"
       Option: Reset learnt / Reset skipped / Start over
```

---

## Non-Functional Requirements

| Requirement | Detail |
|---|---|
| Framework | Angular 17+ (standalone components preferred) |
| Styling | Angular Material or TailwindCSS |
| State persistence | `localStorage` (browser) to persist skipped/learnt IDs between sessions |
| Responsiveness | Must work on mobile (min 375px) and desktop |
| Performance | Word loading must complete in < 500ms |
| Offline support | App must work without a backend (all data is local JSON) |

---

## Data Persistence Strategy

Since there is no backend, persistence is handled via **browser localStorage**:

| Key | Value |
|---|---|
| `lang_learn_skipped` | JSON array of skipped word IDs |
| `lang_learn_learnt` | JSON array of learnt word IDs |

The `skipped.json` and `learnt.json` files serve as the **initial/default state** loaded on first run. After that, localStorage takes precedence.

---

## Screens / Views

### 1. Main Learning View
- Displays current word card with description
- Shows action buttons (Skip, Already Learnt, Next)
- Shows progress counter

### 2. Completion Screen
- Shown when all words in the active pool have been reviewed
- Options to reset skipped words, reset learnt words, or start completely over

### 3. (Optional) Statistics View
- Total words: 10+
- Words learnt: N
- Words skipped: N
- Words remaining: N

---

## File Structure

```
src/
├── app/
│   ├── app.component.ts
│   ├── components/
│   │   ├── word-card/
│   │   │   ├── word-card.component.ts
│   │   │   ├── word-card.component.html
│   │   │   └── word-card.component.scss
│   │   └── completion/
│   │       ├── completion.component.ts
│   │       └── completion.component.html
│   ├── services/
│   │   ├── word.service.ts       ← loads words.json, manages active pool
│   │   └── progress.service.ts   ← manages skipped/learnt via localStorage
│   └── models/
│       └── word.model.ts         ← TypeScript interfaces
├── assets/
│   ├── data/
│   │   ├── words.json            ← 10+ word entries
│   │   ├── skipped.json          ← initial skipped list (empty array)
│   │   └── learnt.json           ← initial learnt list (empty array)
```

---

## Word Model (TypeScript)

```typescript
export interface Word {
  id: number;
  word: string;
  description: string;
  example?: string;
  category?: string;
}

export interface ProgressData {
  skipped: number[];
  learnt: number[];
}
```

---

## Acceptance Criteria

- [x] App loads and displays a word with description on startup
- [x] "Next" button shows a different random word each time
- [x] "Skip" button removes the word from the current session pool and saves its ID
- [x] "Already Learnt" button removes the word permanently from the pool and saves its ID
- [x] Skipped and learnt word IDs persist after page refresh (localStorage)
- [x] Progress counter updates correctly after each action
- [x] Completion screen appears when active pool is exhausted
- [x] `words.json` contains a minimum of 10 entries (20 entries added; 1,020 planned — see `WORDS_1000_REQUIREMENTS.md`)
- [x] App is responsive on mobile and desktop
- [x] No backend required — fully client-side

---

## Implementation Progress

### Session 1 — Initial Scaffold (pre-existing)
- [x] Angular 19 project created (`language-learn/`)
- [x] `word.model.ts` — TypeScript interfaces for `Word`, `ProgressData`, `AppView`
- [x] `progress.service.ts` — localStorage persistence (skip/learnt IDs)
- [x] `word.service.ts` — word pool management using Angular Signals
- [x] `app.component.ts` / `.html` / `.scss` — root component with toolbar + view routing
- [x] `word-card.component.ts` / `.html` / `.scss` — learning card with reveal, skip, learnt, next
- [x] `completion.component.ts` / `.html` / `.scss` — completion screen with reset options
- [x] `app.config.ts` — `provideHttpClient()` + `provideAnimationsAsync()`
- [x] `assets/data/skipped.json` and `learnt.json` — empty initial state files

### Session 2 — Completion (2026-02-25)
- [x] Created `src/assets/data/words.json` with 20 vocabulary entries (id, word, description, example, category)
- [x] Fixed template bug: signal inputs (`remaining`, `learntCount`, `skippedCount`, `total`) were missing `()` in `word-card.component.html`
- [x] Installed missing `@angular/animations` package (was imported in component but absent from `package.json`)
- [x] Verified clean production build — no errors, bundle ~395 kB initial

### Session 3 — 1,000-Word Expansion (planned)
- [x] Created `WORDS_1000_REQUIREMENTS.md` — full spec for expanding dataset to 1,020 words
- [ ] Generate words in 10 batches of 100 (IDs 21–1020), following spec in `WORDS_1000_REQUIREMENTS.md`
- [ ] Validate final `words.json` — 1,020 entries, no duplicates, correct schema
- [ ] Re-verify app build after dataset expansion
