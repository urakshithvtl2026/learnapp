# Exam Feature — Requirements Document

## Overview

An exam module within the Angular Language Learn app that allows an **admin** to assign specific question papers to specific users. Users complete their assigned exam and the system records how many answers they got correct and wrong. All data is stored in local JSON files — no backend or database required.

---

## Key Concepts

| Term | Meaning |
|---|---|
| **Question Paper** | A named set of questions (multiple-choice) created by the admin |
| **Assignment** | A link between one question paper and one user |
| **Attempt** | A completed (or in-progress) exam session by a user |
| **Result** | The scored outcome of a completed attempt |
| **Timer** | An optional countdown clock on a paper; admin can enable/disable it per paper |

---

## JSON Data Files

All persistent data lives under `src/assets/data/exam/`.

### 1. `question-papers.json` — All question papers

```json
[
  {
    "id": "qp_001",
    "title": "Vocabulary Level 1",
    "description": "Basic vocabulary test covering adjectives and nouns.",
    "createdAt": "2026-02-26T10:00:00Z",
    "timer": {
      "enabled": true,
      "durationSeconds": 600,
      "autoSubmit": true
    },
    "questions": [
      {
        "id": "q1",
        "text": "What does 'Ephemeral' mean?",
        "options": [
          { "id": "a", "text": "Lasting forever" },
          { "id": "b", "text": "Lasting for a very short time" },
          { "id": "c", "text": "Very large in size" },
          { "id": "d", "text": "Relating to water" }
        ],
        "correctOptionId": "b"
      },
      {
        "id": "q2",
        "text": "Which word means 'present everywhere'?",
        "options": [
          { "id": "a", "text": "Eloquent" },
          { "id": "b", "text": "Serendipity" },
          { "id": "c", "text": "Ubiquitous" },
          { "id": "d", "text": "Tenacious" }
        ],
        "correctOptionId": "c"
      }
    ]
  },
  {
    "id": "qp_002",
    "title": "Vocabulary Level 2",
    "description": "Intermediate vocabulary — verbs and complex nouns.",
    "createdAt": "2026-02-26T11:00:00Z",
    "timer": {
      "enabled": false,
      "durationSeconds": null,
      "autoSubmit": false
    },
    "questions": []
  }
]
```

**Timer fields:**

| Field | Type | Meaning |
|---|---|---|
| `enabled` | boolean | Whether the countdown timer is active for this paper |
| `durationSeconds` | number \| null | Total seconds for the exam (e.g. `600` = 10 minutes); `null` when disabled |
| `autoSubmit` | boolean | If `true`, exam auto-submits when time runs out; if `false`, timer shows warning only |

**Rules:**
- Minimum 10 question papers (`qp_001` … `qp_010+`).
- Each paper must have at least 5 questions.
- Each question must have exactly 4 options (`a`, `b`, `c`, `d`).
- `correctOptionId` is stored server-side in this file — it is **never sent to the UI** until the exam is submitted.

---

### 2. `users.json` — User registry

```json
[
  {
    "id": "u_001",
    "name": "Alice Johnson",
    "email": "alice@example.com"
  },
  {
    "id": "u_002",
    "name": "Bob Smith",
    "email": "bob@example.com"
  }
]
```

---

### 3. `assignments.json` — Which paper is assigned to which user

```json
[
  {
    "id": "asgn_001",
    "userId": "u_001",
    "questionPaperId": "qp_001",
    "assignedAt": "2026-02-26T12:00:00Z",
    "status": "pending"
  },
  {
    "id": "asgn_002",
    "userId": "u_002",
    "questionPaperId": "qp_003",
    "assignedAt": "2026-02-26T12:05:00Z",
    "status": "completed"
  }
]
```

**`status` values:**

| Value | Meaning |
|---|---|
| `pending` | Assigned but exam not yet started |
| `in_progress` | User has started but not submitted |
| `completed` | Exam submitted and scored |

**Rules:**
- One user can be assigned multiple question papers (separate assignment records).
- A user can only have **one active (`pending` or `in_progress`) assignment per paper** at a time.
- Admin can re-assign the same paper to the same user (creates a new assignment record).

---

### 4. `results.json` — Exam results and answer records

```json
[
  {
    "id": "res_001",
    "assignmentId": "asgn_001",
    "userId": "u_001",
    "questionPaperId": "qp_001",
    "startedAt": "2026-02-26T13:00:00Z",
    "submittedAt": "2026-02-26T13:15:00Z",
    "timeTakenSeconds": 900,
    "timedOut": false,
    "totalQuestions": 10,
    "correct": 7,
    "wrong": 3,
    "score": 70,
    "answers": [
      {
        "questionId": "q1",
        "selectedOptionId": "b",
        "isCorrect": true
      },
      {
        "questionId": "q2",
        "selectedOptionId": "a",
        "isCorrect": false
      }
    ]
  }
]
```

**New result fields:**

| Field | Type | Meaning |
|---|---|---|
| `timeTakenSeconds` | number | Elapsed seconds from `startedAt` to `submittedAt` (wall-clock, always recorded) |
| `timedOut` | boolean | `true` if the exam was auto-submitted because the countdown reached zero |

**Score formula:** `score = Math.round((correct / totalQuestions) * 100)`

---

## Roles

| Role | Capability |
|---|---|
| **Admin** | Create/edit question papers, assign papers to users, view all results |
| **User** | See their assigned exams, take an assigned exam, view their own results |

> Role is stored in `users.json` as a `role` field: `"admin"` or `"user"`.

---

## Functional Requirements

### FR-1: Question Paper Management (Admin)

- [ ] Admin can view a list of all question papers.
- [ ] Admin can create a new question paper with a title and description.
- [ ] Admin can add/edit/delete questions within a paper.
- [ ] Each question must have exactly 4 options with one correct answer marked.
- [ ] Admin can delete a question paper (only if it has no `completed` assignments).
- [ ] Admin can **enable or disable the timer** on any question paper via a toggle.
- [ ] When timer is enabled, admin sets the **total duration in minutes** (e.g. 10 minutes).
- [ ] Admin can choose whether time-up causes **auto-submit** or just shows a warning.

### FR-2: User Management (Admin)

- [ ] Admin can view all registered users.
- [ ] Users are loaded from `users.json` (no sign-up flow required).

### FR-3: Assignment Management (Admin)

- [ ] Admin can assign any question paper to any user.
- [ ] Admin can view all assignments with their current status.
- [ ] Admin can filter assignments by: user, question paper, status.
- [ ] Admin cannot assign the same paper to the same user if an active assignment already exists.

### FR-4: Taking an Exam (User)

- [ ] User logs in by selecting their name from a dropdown (no password required).
- [ ] User sees a list of their assigned exams with statuses.
- [ ] User can start a `pending` exam — status changes to `in_progress`.
- [ ] Exam displays one question at a time with 4 radio-button options.
- [ ] User can navigate forward and backward through questions before submitting.
- [ ] User can submit only when all questions are answered.
- [ ] On submit: answers are scored, result is saved to `results.json`, assignment status → `completed`.
- [ ] Correct answers are **never shown** to the user during the exam.
- [ ] If the paper has `timer.enabled = true`, a **countdown clock** is shown during the exam.
- [ ] The timer starts when the user clicks **Start** and counts down from `durationSeconds`.
- [ ] The remaining time is saved to localStorage every 5 seconds so the timer survives a page refresh.
- [ ] If the timer reaches zero and `autoSubmit = true`: exam is auto-submitted immediately (unanswered questions count as wrong).
- [ ] If the timer reaches zero and `autoSubmit = false`: a warning banner is shown but the user can still submit manually.
- [ ] `timeTakenSeconds` is always recorded regardless of whether the timer was enabled.

### FR-5: Results (User & Admin)

- [ ] After submission, user sees their score: correct count, wrong count, and percentage.
- [ ] User result screen shows **time taken** (formatted as `mm:ss`).
- [ ] If `timedOut = true`, result screen shows a "Time Expired — Auto Submitted" notice.
- [ ] User can see a question-by-question breakdown: which they got right and wrong (but NOT the correct answer for wrong ones, unless admin enables it).
- [ ] Admin can view results for all users.
- [ ] Admin can filter results by user or question paper.
- [ ] Admin results table shows **time taken** and **timed out** flag for each result.
- [ ] Admin can see the full breakdown including correct answers.

### FR-6: Persistence

- [ ] All reads come from JSON files under `src/assets/data/exam/`.
- [ ] All writes (assignment status, results) are saved to `localStorage` under namespaced keys.
- [ ] On app start, localStorage data is merged with the baseline JSON files (localStorage takes precedence).

**localStorage keys:**

| Key | Value |
|---|---|
| `exam_assignments` | Full assignments array (JSON) |
| `exam_results` | Full results array (JSON) |
| `exam_current_user` | Currently selected user ID |
| `exam_in_progress_{assignmentId}` | Draft answers for an in-progress exam |
| `exam_timer_{assignmentId}` | `{ startedAt: ISO string, remainingSeconds: number }` — persisted every 5 s so the timer survives a page refresh |

---

## UI Requirements

### Admin Views

#### 1. Question Papers List
```
┌────────────────────────────────────────────────────────────────┐
│  Question Papers                            [ + New Paper ]    │
├────────────────────────────────────────────────────────────────┤
│  #   Title               Questions   Timer      Assigned To    │
│  ──  ────────────────    ─────────   ────────   ────────────   │
│  1   Vocabulary Level 1     10       10 min ⏱   3 users       │
│  2   Vocabulary Level 2      8       Off         1 user        │
│  3   Advanced Grammar       12       15 min ⏱   0 users       │
│      ...                                                        │
└────────────────────────────────────────────────────────────────┘
```

#### 2. Assign Paper to User
```
┌──────────────────────────────────────────────────┐
│  Assign Exam                                      │
│                                                   │
│  Select User:    [ Alice Johnson      ▼ ]         │
│  Select Paper:   [ Vocabulary Level 1 ▼ ]         │
│                                                   │
│  Timer:  ⏱ 10 minutes  |  Auto-submit: Yes        │
│  (configured on the paper — shown read-only here) │
│                                                   │
│                           [ Cancel ] [ Assign ]   │
└──────────────────────────────────────────────────┘
```

#### 3. Results Dashboard
```
┌────────────────────────────────────────────────────────────────────┐
│  Results                                                           │
│  Filter: [ All Users ▼ ]  [ All Papers ▼ ]                        │
├────────────────────────────────────────────────────────────────────┤
│  User          Paper              Score  Time Taken  Timed Out  Date │
│  ──────────    ────────────────   ─────  ──────────  ─────────  ──── │
│  Alice Johnson Vocabulary Lvl 1   70%    08:32       No         Feb 26 │
│  Bob Smith     Vocabulary Lvl 3   90%    05:14       No         Feb 26 │
│  Carol White   Advanced Grammar   40%    15:00       Yes ⚠      Feb 26 │
└────────────────────────────────────────────────────────────────────┘
```

### User Views

#### 4. My Exams
```
┌──────────────────────────────────────────────────┐
│  My Exams                                         │
├──────────────────────────────────────────────────┤
│  Paper                  Status       Action       │
│  ────────────────────   ──────────   ──────────── │
│  Vocabulary Level 1     Pending      [ Start ]    │
│  Vocabulary Level 2     Completed    [ Results ]  │
│  Advanced Grammar       In Progress  [ Continue ] │
└──────────────────────────────────────────────────┘
```

#### 5. Exam Screen (timer enabled)
```
┌──────────────────────────────────────────────────┐
│  Vocabulary Level 1    Question 3 of 10           │
│                               ⏱  07:42 remaining  │  ← countdown
│  ─────────────────────────────────────────────── │
│  What does 'Ubiquitous' mean?                     │
│                                                   │
│  ○  Lasting forever                               │
│  ○  Present everywhere          ← selected        │
│  ○  Extremely loud                                │
│  ○  Relating to water                             │
│                                                   │
│  [ ← Previous ]              [ Next → ]           │
│                                                   │
│  Progress: ████████░░ 8/10 answered               │
│                               [ Submit Exam ]     │
└──────────────────────────────────────────────────┘
```

**Timer colour states:**

| Remaining time | Colour |
|---|---|
| > 25% of total | Green |
| 10–25% of total | Amber / Orange |
| < 10% of total | Red (pulse animation) |
| 00:00 (expired) | Red — "Time's up!" banner |

#### 5b. Exam Screen (no timer)
```
┌──────────────────────────────────────────────────┐
│  Vocabulary Level 2    Question 3 of 8            │
│  ─────────────────────────────────────────────── │
│  What does 'Eloquent' mean?                       │
│  ...                                             │
│  Progress: ██████░░░░ 5/8 answered                │
│                               [ Submit Exam ]     │
└──────────────────────────────────────────────────┘
```
_(No timer shown when `timer.enabled = false`)_

#### 6. Result Screen
```
┌──────────────────────────────────────────────────┐
│  Exam Complete!                                   │
│                                                   │
│       Score: 70%                                  │
│       ✓  7 Correct                                │
│       ✗  3 Wrong                                  │
│       Total: 10 questions                         │
│       ⏱  Time Taken: 08:32                        │  ← always shown
│                                                   │
│  ─────────────────────────────────────────────── │
│  Q1: What does 'Ephemeral' mean?    ✓ Correct    │
│  Q2: Which word means 'everywhere'? ✗ Wrong      │
│  ...                                             │
│                                                   │
│                           [ Back to My Exams ]   │
└──────────────────────────────────────────────────┘
```

**Auto-submitted (timed out) variant:**
```
┌──────────────────────────────────────────────────┐
│  ⚠  Time Expired — Exam Auto-Submitted            │
│  ─────────────────────────────────────────────── │
│       Score: 40%                                  │
│       ✓  4 Correct                                │
│       ✗  6 Wrong  (2 unanswered = wrong)          │
│       Total: 10 questions                         │
│       ⏱  Time Taken: 15:00  (limit reached)       │
│  ...                                             │
└──────────────────────────────────────────────────┘
```

---

## Application Flow

```
App Start
    │
    ▼
Select User (dropdown — no password)
    │
    ├── Admin selected
    │       ▼
    │   Admin Dashboard
    │       ├── Manage Question Papers (CRUD)
    │       ├── Assign Paper → User
    │       └── View All Results
    │
    └── Regular User selected
            ▼
        My Exams List
            │
            ├── [Start]     → Load paper (questions only, no answers)
            │                → Record startedAt timestamp
            │                → Save in_progress to localStorage
            │                → If timer.enabled:
            │                │   → Save exam_timer_{id} to localStorage
            │                │   → Show countdown clock
            │                │   → Every 5s: update remainingSeconds in localStorage
            │                │   → If time = 0 and autoSubmit = true:
            │                │       → Auto-submit, timedOut = true
            │                │   → If time = 0 and autoSubmit = false:
            │                │       → Show warning banner only
            │                → [Submit] → Calculate timeTakenSeconds
            │                          → Score answers
            │                          → Save result (incl. timeTakenSeconds, timedOut)
            │                          → Clear exam_timer_{id} from localStorage
            │                          → Show Result Screen
            │
            ├── [Continue]  → Resume from localStorage draft answers
            │                → Restore remaining time from exam_timer_{id}
            │                → Resume countdown from saved remainingSeconds
            │
            └── [Results]   → Show past result breakdown (incl. time taken)
```

---

## File Structure

```
src/
├── app/
│   ├── exam/
│   │   ├── admin/
│   │   │   ├── paper-list/              ← list all question papers
│   │   │   ├── paper-editor/            ← create/edit a paper & questions
│   │   │   ├── assign-dialog/           ← assign paper to user dialog
│   │   │   └── results-dashboard/       ← all results with filters
│   │   ├── user/
│   │   │   ├── my-exams/               ← user's assigned exams list
│   │   │   ├── exam-player/            ← question-by-question exam UI
│   │   │   └── result-view/            ← post-submission result screen
│   │   ├── login/                       ← user/role selection screen
│   │   ├── models/
│   │   │   └── exam.model.ts
│   │   └── services/
│   │       ├── exam-data.service.ts     ← loads JSON files
│   │       ├── assignment.service.ts    ← manages assignments in localStorage
│   │       ├── result.service.ts        ← manages results in localStorage
│   │       └── exam-timer.service.ts    ← countdown logic, localStorage persistence
│
├── assets/
│   └── data/
│       └── exam/
│           ├── question-papers.json     ← 10+ papers with questions & answers
│           ├── users.json               ← registered users (incl. admin)
│           ├── assignments.json         ← initial/seed assignments (can be empty [])
│           └── results.json             ← initial/seed results (can be empty [])
```

---

## TypeScript Models

```typescript
// exam.model.ts

export interface Option {
  id: string;           // "a" | "b" | "c" | "d"
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;  // never exposed to exam player UI
}

export interface TimerConfig {
  enabled: boolean;
  durationSeconds: number | null;  // null when disabled
  autoSubmit: boolean;             // auto-submit when time runs out
}

export interface QuestionPaper {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  timer: TimerConfig;
  questions: Question[];
}

export interface ExamUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export type AssignmentStatus = 'pending' | 'in_progress' | 'completed';

export interface Assignment {
  id: string;
  userId: string;
  questionPaperId: string;
  assignedAt: string;
  status: AssignmentStatus;
}

export interface AnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface ExamResult {
  id: string;
  assignmentId: string;
  userId: string;
  questionPaperId: string;
  startedAt: string;
  submittedAt: string;
  timeTakenSeconds: number;  // always set — wall-clock elapsed time
  timedOut: boolean;         // true if auto-submitted by countdown reaching zero
  totalQuestions: number;
  correct: number;
  wrong: number;
  score: number;             // 0–100
  answers: AnswerRecord[];
}

// Used in the exam player — questions WITHOUT correctOptionId
export interface QuestionForPlayer {
  id: string;
  text: string;
  options: Option[];
}

// Persisted to localStorage during active exam (exam_timer_{assignmentId})
export interface TimerState {
  assignmentId: string;
  startedAt: string;         // ISO timestamp when exam started
  remainingSeconds: number;  // updated every 5 seconds
}
```

---

## Scoring Rules

| Rule | Detail |
|---|---|
| Correct answer | +1 point |
| Wrong answer | 0 points (no negative marking) |
| Unanswered (manual submit) | Not allowed — must answer all before submit |
| Unanswered (auto-submit on timeout) | Treated as wrong (0 points) |
| Score % | `Math.round((correct / total) * 100)` |
| Pass mark | Optional: configurable per paper (default: 60%) |
| Time taken | `Math.round((submittedAt - startedAt) / 1000)` seconds |

---

## Non-Functional Requirements

| Requirement | Detail |
|---|---|
| Framework | Angular 17+ (standalone components) |
| Styling | Angular Material or TailwindCSS (match existing app) |
| No backend | All data from JSON assets + localStorage |
| Correct answer security | `correctOptionId` must never appear in the HTTP response during active exam — filter it out in `ExamDataService` before passing questions to the exam player component |
| Responsiveness | Works on mobile (min 375px) and desktop |
| State recovery | If user closes browser mid-exam, `in_progress` draft is recovered from localStorage on next visit |
| Timer accuracy | Timer state is persisted to localStorage every 5 seconds; on resume, remaining time is recalculated from `startedAt` + `durationSeconds` to prevent cheating by restoring an old localStorage snapshot |
| Timer display | Format as `MM:SS` (e.g. `07:42`); use Angular's `interval` or a dedicated `ExamTimerService` with a signal/observable |

---

## Acceptance Criteria

- [ ] At least 10 question papers exist in `question-papers.json`
- [ ] Each paper has at least 5 questions with 4 options and a correct answer
- [ ] Admin can assign any paper to any user
- [ ] A user only sees their own assigned exams
- [ ] Correct answers are hidden from the exam player UI
- [ ] Submitting an exam saves a result with `correct`, `wrong`, and `score`
- [ ] `timeTakenSeconds` is recorded for every submitted exam
- [ ] Admin can enable/disable the timer per question paper
- [ ] Admin can set duration (in minutes) and auto-submit behaviour per paper
- [ ] Countdown clock is shown during the exam when `timer.enabled = true`
- [ ] Timer colour changes to amber below 25% and red below 10% remaining
- [ ] Timer state survives a page refresh (restored from localStorage)
- [ ] On timeout with `autoSubmit = true`: exam is submitted automatically and `timedOut = true` is stored
- [ ] On timeout with `autoSubmit = false`: warning shown, user can still submit manually
- [ ] Result screen displays time taken in `mm:ss` format
- [ ] Result screen shows "Time Expired" notice when `timedOut = true`
- [ ] Admin results table shows time taken and timed-out flag per result
- [ ] User can view their result breakdown after submission
- [ ] Admin can view all results and filter by user/paper
- [ ] All state persists in localStorage across page refreshes
- [ ] App works fully offline with no backend

---

## Implementation Progress

### Phase 1 — Data & Models
- [ ] Create `src/assets/data/exam/` folder with seed JSON files
- [ ] Create `exam.model.ts` with all interfaces
- [ ] Create `ExamDataService` to load and merge JSON + localStorage

### Phase 2 — Admin Features
- [ ] Question paper list view (with Timer column)
- [ ] Paper editor (add/edit/delete questions)
- [ ] Timer toggle + duration + auto-submit setting in paper editor
- [ ] Assign paper to user dialog (shows timer info read-only)
- [ ] Results dashboard with filters (including Time Taken + Timed Out columns)

### Phase 3 — User Features
- [ ] Login screen (user dropdown selection)
- [ ] My Exams list view
- [ ] Exam player (question-by-question, answer tracking)
- [ ] `ExamTimerService` — countdown signal, localStorage persist every 5 s, resume logic
- [ ] Countdown UI in exam player (colour states: green / amber / red)
- [ ] Auto-submit on timeout (`autoSubmit = true` path)
- [ ] Warning banner on timeout (`autoSubmit = false` path)
- [ ] Submit & score logic (record `timeTakenSeconds`, `timedOut`)
- [ ] Result view screen (time taken + timed-out notice)

### Phase 4 — Polish
- [ ] Responsive layout for all screens
- [ ] Guard routes by role (admin vs user)
- [ ] Handle edge cases (empty papers, re-attempting, etc.)
