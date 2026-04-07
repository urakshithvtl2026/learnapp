# Words Dataset — 1000-Word Expansion Requirements

## Overview

Expand the vocabulary dataset from **20 words** (current) to **1,020 words** (target) by adding 1,000 new entries to `src/assets/data/words.json`. The new words must represent **B2–C1 CEFR level** — practical, intermediate-to-upper-intermediate vocabulary that educated speakers genuinely use in daily conversation, workplace communication, media, and writing. Words must be neither too simple (basic A1–A2) nor too academic/archaic.

**Target file:** `language-learn/src/assets/data/words.json`
**ID range for new entries:** `21` → `1020`
**Total entries after expansion:** `1,020`

---

## Target Vocabulary Level

| Level | Description | Examples |
|---|---|---|
| ❌ Too simple (A1–A2) | Basic words every learner knows | happy, sad, big, walk, eat |
| ✅ **Target (B2–C1)** | Words educated speakers use daily but learners may struggle with | articulate, resilient, concise, deduce, subtle |
| ❌ Too advanced (C2+) | Rare, archaic, or hyper-specialist | pusillanimous, defenestrate, solipsistic |

**Ideal profile of a qualifying word:**
- Appears in mainstream newspapers, podcasts, and non-fiction books
- A non-native speaker at B1 level might not know it but would benefit greatly from learning it
- A native English speaker would use it naturally without sounding pretentious
- Has a clear, concrete definition (not highly abstract philosophical terms)

---

## Category Distribution (1,000 new words)

| Category | Count | Notes |
|---|---|---|
| Adjective | 320 | Personality, emotion, situation, appearance, attitude |
| Noun | 300 | Concepts, people, places, abstract ideas, everyday objects |
| Verb | 250 | Actions, communication, cognition, emotional response |
| Adverb | 80 | Manner, degree, frequency, hedging |
| Phrasal Verb | 50 | High-frequency phrasal verbs used in everyday speech |

> The existing 20 entries are heavily skewed toward adjectives. The new batch should rebalance toward verbs and nouns.

---

## Thematic Domains

Distribute words across the following 12 domains. Each domain contributes words across all grammar categories.

| Domain | Target Words | Examples of sub-topics |
|---|---|---|
| **Communication & Language** | 90 | articulate, ramble, concise, rhetoric, paraphrase |
| **Emotions & Psychology** | 110 | anxious, empathy, apprehensive, resentment, cope |
| **Work & Professional Life** | 120 | delegate, collaborate, initiative, accountability, deadline |
| **Relationships & Social Life** | 100 | companionship, friction, reconcile, reciprocal, boundaries |
| **Critical Thinking & Reasoning** | 80 | deduce, refute, infer, contradict, premise |
| **Health & Wellbeing** | 80 | chronic, fatigue, recuperate, nourish, sedentary |
| **Daily Routine & Lifestyle** | 90 | organise, prioritise, routine, commute, frugal |
| **Technology & Modern Life** | 70 | automate, algorithm, integrate, disruptive, obsolete |
| **Money & Finance** | 60 | budget, expenditure, invest, surplus, liability |
| **Education & Learning** | 70 | curriculum, comprehend, elaborate, retention, revise |
| **Society & Culture** | 80 | diversity, norm, stereotype, perception, influence |
| **Nature & Environment** | 50 | sustainable, ecosystem, scarce, renewable, adapt |

---

## JSON Schema

Each entry must conform exactly to the existing schema:

```json
{
  "id": 21,
  "word": "Articulate",
  "description": "Able to express thoughts and ideas clearly and effectively in speech or writing.",
  "example": "She was so articulate in the interview that the panel offered her the job on the spot.",
  "category": "Adjective"
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `id` | `number` | Yes | Sequential, starting from 21, no gaps, no duplicates |
| `word` | `string` | Yes | Title Case. Single word or compound word only (no phrases for regular entries) |
| `description` | `string` | Yes | One to two sentences. Plain English. No dictionary abbreviations. |
| `example` | `string` | Yes | One realistic sentence showing the word used naturally in context |
| `category` | `string` | Yes | Must be exactly one of: `"Adjective"`, `"Noun"`, `"Verb"`, `"Adverb"`, `"Phrasal Verb"` |

### Phrasal Verb entries

For `"Phrasal Verb"` entries, the `word` field contains the full phrasal verb:

```json
{
  "id": 512,
  "word": "Carry out",
  "description": "To perform or complete a task, plan, or action.",
  "example": "The team was asked to carry out a full audit of the department's spending.",
  "category": "Phrasal Verb"
}
```

---

## Description Quality Standards

- **Length:** 1–2 sentences, 10–35 words
- **Style:** Plain, direct explanation. Avoid dictionary jargon like "pertaining to" or "of or relating to"
- **Clarity:** If a word has multiple senses, describe the most common everyday usage
- **No recursion:** Do not use the word itself in its own description

| ❌ Poor description | ✅ Good description |
|---|---|
| "The state of being frugal." | "Careful about spending money; avoiding waste without being miserly." |
| "Of or relating to ambiguity." | "Open to more than one interpretation; unclear or having a double meaning." |
| "Verbose: using verbose language." | "Using far more words than necessary to express an idea; unnecessarily long-winded." |

---

## Example Sentence Quality Standards

- **Length:** 1 sentence, 10–25 words
- **Context:** Must be realistic and set in an everyday scenario (work, home, conversation, news)
- **Naturalness:** Sentence should sound like something a real person would say or write
- **No triviality:** The sentence must demonstrate the word's meaning clearly, not just use it in passing
- **Variety:** Avoid reusing the same sentence templates. Vary subject, setting, and tone

| ❌ Poor example | ✅ Good example |
|---|---|
| "She was very frugal." | "Living alone on an entry-level salary, she became frugal — buying only what she truly needed." |
| "He made an ambiguous statement." | "The contract clause was so ambiguous that both parties interpreted it to their own advantage." |

---

## Word Selection Criteria

### Must-have criteria (all must be true):
- [ ] The word is used in mainstream British or American English media (BBC, NYT, podcasts)
- [ ] The word adds real communicative value — a learner using it would sound natural, not forced
- [ ] The word has a stable, widely agreed-upon meaning (not slang that shifts rapidly)
- [ ] The word is not already in the dataset (check existing 20 entries before adding)

### Preferred criteria (most entries should have these):
- [ ] The word appears across multiple domains (e.g., "concise" applies to work, writing, speech)
- [ ] The word has commonly confused synonyms or near-synonyms (good teaching opportunity)
- [ ] The word is productive — it has related forms (persist → persistence, persistent, persistently)

### Exclusion criteria (none of these):
- [ ] Pure A1–A2 vocabulary (go, come, big, small, nice, good, bad)
- [ ] Highly technical jargon limited to one profession (hepatocellular, eigenvalue)
- [ ] Archaic or literary-only words (thou, henceforth, forsooth)
- [ ] Words already in the existing 20-entry dataset
- [ ] Offensive, slang, or culturally insensitive words
- [ ] Proper nouns (names, cities, brands)

---

## Recommended Word List by Category

The following lists are a starting guide. Word selection should draw from these and expand further.

### Adjectives (target: 320)

**Personality & Character**
> accountable, adaptable, assertive, attentive, cautious, compassionate, competitive, composed, conscientious, consistent, courageous, decisive, dependable, determined, disciplined, empathetic, enthusiastic, flexible, forthright, genuine, grounded, humble, impartial, independent, industrious, insightful, intuitive, level-headed, loyal, methodical, motivated, objective, opinionated, optimistic, patient, perceptive, persistent, proactive, prudent, rational, reasonable, reliable, resourceful, responsible, self-aware, self-disciplined, sensible, sincere, tactful, thoughtful, transparent, trustworthy, versatile, vigilant

**Emotions & States**
> agitated, alarmed, alienated, anxious, apprehensive, bewildered, bittersweet, burned-out, conflicted, content, dejected, despondent, devastated, disheartened, disoriented, distressed, drained, eager, elated, embarrassed, energised, envious, exasperated, exhausted, frustrated, fulfilled, grateful, grieving, guilty, hopeful, humiliated, indifferent, insecure, irritable, joyful, lonely, motivated, nervous, nostalgic, numb, overwhelmed, pessimistic, reluctant, resentful, restless, satisfied, self-conscious, sentimental, startled, stressed, tense, uneasy, vulnerable, wistful, worried

**Situation & Quality**
> abstract, acute, adequate, ambivalent, arbitrary, broad, coherent, complex, comprehensive, concise, conditional, consistent, controversial, covert, critical, cumulative, deliberate, dense, derivative, distinct, dominant, evident, excessive, explicit, feasible, fundamental, gradual, implicit, inevitable, informed, inherent, intensive, intricate, marginal, mutual, nuanced, objective, obscure, optional, parallel, partial, passive, plausible, predominant, preliminary, profound, prominent, proportional, relevant, rigid, rigorous, robust, sequential, significant, straightforward, substantial, subtle, sufficient, systematic, tangible, temporary, theoretical, transparent, trivial, underlying, universal, valid, viable, volatile

**Describing People (appearance/manner)**
> abrasive, affable, aloof, arrogant, assertive, charismatic, conciliatory, condescending, courteous, cynical, defiant, demanding, detached, diplomatic, domineering, evasive, gregarious, guarded, imposing, impulsive, indiscreet, passive-aggressive, persuasive, reserved, sarcastic, stubborn, tactless, vain, warm, withdrawn

### Nouns (target: 300)

**Abstract concepts**
> accountability, ambivalence, apprehension, aspiration, assumption, awareness, benchmark, boundary, burnout, capability, clarity, commitment, complacency, compromise, conflict, consequence, contradiction, conviction, credibility, criterion, deadline, dependency, determination, dilemma, discrepancy, expectation, expertise, framework, frustration, grievance, habit, hesitation, implication, incentive, initiative, insight, integrity, limitation, mindset, momentum, nuance, obligation, outcome, pattern, perception, perspective, potential, precedent, priority, privilege, proactivity, rationale, repercussion, resilience, responsibility, self-esteem, shortcoming, stereotype, strategy, tendency, tension, threshold, transparency, uncertainty, vulnerability

**People & Roles**
> accomplice, advocate, bystander, collaborator, critic, delegate, dissenter, facilitator, intermediary, mediator, mentor, peer, predecessor, recipient, referee, rival, scapegoat, sceptic, stakeholder, subordinate, successor, veteran, volunteer, witness

**Daily Life & Concrete Nouns**
> allowance, appliance, commute, correspondence, downtime, draft, estimate, feedback, groceries, habit, invoice, itinerary, junction, lease, maintenance, memo, mortgage, newsletter, notification, obligation, outline, overtime, payslip, penalty, quota, receipt, refund, reminder, renovation, routine, schedule, shortcut, subscription, surplus, timetable, transcript, upgrade, warrant, workload

**Emotions & Mental States (noun form)**
> anguish, apprehension, compassion, contentment, despair, determination, discomfort, dread, empathy, envy, exasperation, exhaustion, gratitude, guilt, humiliation, indifference, loneliness, motivation, nostalgia, numbness, optimism, regret, resentment, restlessness, satisfaction, self-doubt, sorrow, sympathy, unease, vulnerability

### Verbs (target: 250)

**Communication**
> acknowledge, address, clarify, collaborate, communicate, concede, confront, contradict, convey, debate, decline, delegate, elaborate, emphasise, facilitate, justify, negotiate, notify, paraphrase, persuade, present, rephrase, request, respond, specify, summarise, underline

**Cognitive & Analytical**
> analyse, assess, assume, classify, comprehend, conclude, consider, deduce, determine, distinguish, evaluate, examine, identify, imply, infer, justify, predict, presume, prioritise, reconsider, reflect, revise, scrutinise, speculate, synthesise, verify

**Work & Action**
> accelerate, allocate, assign, audit, budget, compile, coordinate, deploy, draft, execute, generate, implement, integrate, manage, optimise, outline, oversee, plan, process, produce, report, resolve, restructure, review, schedule, streamline, supervise, track

**Emotional & Social**
> adapt, alienate, appreciate, avoid, challenge, commit, cope, discourage, empathise, encourage, engage, express, forgive, hesitate, inspire, intimidate, judge, motivate, neglect, oppose, overcome, persist, reassure, reconcile, regret, reject, rely, struggle, support, tolerate, undermine, withdraw

**Change & State**
> accumulate, adjust, alter, cease, convert, decline, deteriorate, dissolve, emerge, erode, evolve, expand, fluctuate, generate, intensify, maintain, modify, recover, reduce, reinforce, reverse, shift, stabilise, sustain, transform, trigger, update

### Adverbs (target: 80)

> abruptly, accordingly, adequately, barely, broadly, cautiously, chronically, clearly, collectively, considerably, consistently, continuously, critically, deliberately, directly, drastically, effectively, efficiently, explicitly, extensively, gradually, genuinely, heavily, implicitly, inadvertently, independently, indirectly, inevitably, initially, intentionally, largely, loosely, marginally, merely, minimally, moderately, mutually, notably, occasionally, overwhelmingly, partially, passively, potentially, predominantly, primarily, progressively, proportionally, rapidly, reasonably, reluctantly, repeatedly, roughly, significantly, simultaneously, slightly, strictly, subsequently, subtly, sufficiently, systematically, temporarily, thoroughly, typically, ultimately, uniformly, unnecessarily, vaguely, virtually, voluntarily, wholly

### Phrasal Verbs (target: 50)

> back down, back up, break down, bring up, burn out, call off, carry out, catch up, come across, come up with, cut back, deal with, draw on, figure out, follow through, follow up, get across, give in, give up, go over, hold back, keep up, lay off, leave out, let down, look into, make up for, move on, narrow down, opt out, phase out, pick up on, point out, put off, rule out, run out of, scale back, set aside, set out, settle for, show up, sign up, stand out, step back, take on, think through, tie up, turn down, weigh up, work out

---

## Validation Checklist

Before finalising the 1,000 new entries, verify:

- [ ] Total count is exactly 1,000 new entries (IDs 21–1020)
- [ ] No duplicate words (case-insensitive check)
- [ ] No duplicate IDs
- [ ] Every entry has all 5 fields: `id`, `word`, `description`, `example`, `category`
- [ ] All `category` values are exactly one of the five allowed strings
- [ ] No word from the existing 20-entry dataset is repeated
- [ ] Category counts match the distribution targets (±10%)
- [ ] Domain coverage spans all 12 thematic domains
- [ ] No A1–A2 words included (the "too simple" filter)
- [ ] No C2+ archaic or hyper-specialist words included
- [ ] All descriptions are 10–35 words and avoid using the word itself
- [ ] All example sentences are 10–25 words and feel natural and realistic
- [ ] Valid JSON — array of objects, no trailing commas

---

## Implementation Notes

### File update strategy
- Append the 1,000 new entries to the existing `words.json` array (after entry id=20)
- IDs must be sequential with no gaps: 21, 22, 23 … 1020
- Do not modify existing entries 1–20

### Generating in batches
Due to the size (1,000 entries), generate in batches of 100. After each batch:
1. Validate JSON syntax
2. Check for duplicate words against cumulative list
3. Check ID sequence is unbroken

### Suggested batch plan

| Batch | ID Range | Primary Domain Focus |
|---|---|---|
| Batch 1 | 21–120 | Emotions & Psychology + Communication |
| Batch 2 | 121–220 | Work & Professional Life |
| Batch 3 | 221–320 | Daily Routine & Relationships |
| Batch 4 | 321–420 | Critical Thinking & Reasoning + Education |
| Batch 5 | 421–520 | Health & Wellbeing + Nature |
| Batch 6 | 521–620 | Society & Culture + Finance |
| Batch 7 | 621–720 | Technology & Modern Life |
| Batch 8 | 721–820 | Mixed: cross-domain adjectives |
| Batch 9 | 821–920 | Mixed: cross-domain verbs & adverbs |
| Batch 10 | 921–1020 | Phrasal Verbs + remaining nouns |

---

## Acceptance Criteria

- [ ] `words.json` contains exactly **1,020** entries after the update
- [ ] The Angular app loads the expanded dataset without errors
- [ ] The word card displays all fields (word, description, example, category) correctly
- [ ] Progress counter reflects the full 1,020 total
- [ ] No regression in skip, learnt, or next functionality
- [ ] App build succeeds with no TypeScript or lint errors

---

## Progress Tracker

| Batch | Status | Entries Added | Verified |
|---|---|---|---|
| Existing | ✅ Done | 20 (id 1–20) | ✅ |
| Batch 1 (21–120) | 🔄 In Progress — Step 1/10 done (id 21–30) | 10 | — |
| Batch 2 (121–220) | ⬜ Pending | — | — |
| Batch 3 (221–320) | ⬜ Pending | — | — |
| Batch 4 (321–420) | ⬜ Pending | — | — |
| Batch 5 (421–520) | ⬜ Pending | — | — |
| Batch 6 (521–620) | ⬜ Pending | — | — |
| Batch 7 (621–720) | ⬜ Pending | — | — |
| Batch 8 (721–820) | ⬜ Pending | — | — |
| Batch 9 (821–920) | ⬜ Pending | — | — |
| Batch 10 (921–1020) | ⬜ Pending | — | — |
| **Total** | **1/11 batches** | **30 / 1020** | — |

### Step-level tracker (10 words per step)

| Step | ID Range | Domain Focus | Words Added | Status |
|---|---|---|---|---|
| Step 1 | 21–30 | Emotions & Psychology + Communication | Articulate, Empathy, Apprehensive, Resentment, Concise, Cope, Anxious, Rhetoric, Paraphrase, Acknowledge | ✅ Done |
| Step 2 | 31–40 | Emotions & Psychology + Communication | — | ⬜ Pending |
| Step 3 | 41–50 | Emotions & Psychology + Communication | — | ⬜ Pending |
| Step 4 | 51–60 | Emotions & Psychology + Communication | — | ⬜ Pending |
| Step 5 | 61–70 | Emotions & Psychology + Communication | — | ⬜ Pending |
| Step 6 | 71–80 | Emotions & Psychology + Communication | — | ⬜ Pending |
| Step 7 | 81–90 | Emotions & Psychology + Communication | — | ⬜ Pending |
| Step 8 | 91–100 | Emotions & Psychology + Communication | — | ⬜ Pending |
| Step 9 | 101–110 | Emotions & Psychology + Communication | — | ⬜ Pending |
| Step 10 | 111–120 | Emotions & Psychology + Communication | — | ⬜ Pending |
