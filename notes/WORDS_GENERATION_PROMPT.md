# Vocabulary Words Generation Prompt

Use this prompt to generate 1000 unique vocabulary words in batches of 50 (20 batches total).

---

## Base Prompt (Copy & Fill In Variables)

```
You are a vocabulary expert creating a comprehensive English vocabulary learning dataset.

TASK: Generate [BATCH_SIZE] unique English vocabulary words in JSON format.

REQUIREMENTS:
1. Words should be intermediate to advanced level (suitable for language learners)
2. Include a mix of categories: Nouns, Verbs, Adjectives, Adverbs
3. Each word must be unique and NOT in the existing list below
4. Words should be commonly used in academic, professional, or literary contexts

OUTPUT FORMAT (JSON array):
[
  {
    "id": [START_ID],
    "word": "WordHere",
    "description": "Clear, concise definition.",
    "example": "A natural sentence demonstrating usage.",
    "category": "Noun|Verb|Adjective|Adverb"
  }
]

BATCH INFO:
- Batch Number: [BATCH_NUMBER] of 20
- Start ID: [START_ID]
- Generate exactly [BATCH_SIZE] words (IDs [START_ID] to [END_ID])

EXISTING WORDS TO AVOID (do not duplicate):
[PASTE_EXISTING_WORD_NAMES_HERE]

Generate words [START_ID] through [END_ID] now. Output ONLY valid JSON, no explanations.
```

---

## Batch Schedule

| Batch | Start ID | End ID | Notes                        |
|-------|----------|--------|------------------------------|
| 1     | 1        | 50     | No existing words to avoid   |
| 2     | 51       | 100    | Avoid words from batch 1     |
| 3     | 101      | 150    | Avoid words from batches 1-2 |
| 4     | 151      | 200    | Avoid words from batches 1-3 |
| 5     | 201      | 250    | Avoid words from batches 1-4 |
| 6     | 251      | 300    | Avoid words from batches 1-5 |
| 7     | 301      | 350    | Avoid words from batches 1-6 |
| 8     | 351      | 400    | Avoid words from batches 1-7 |
| 9     | 401      | 450    | Avoid words from batches 1-8 |
| 10    | 451      | 500    | Avoid words from batches 1-9 |
| 11    | 501      | 550    | Avoid words from batches 1-10|
| 12    | 551      | 600    | Avoid words from batches 1-11|
| 13    | 601      | 650    | Avoid words from batches 1-12|
| 14    | 651      | 700    | Avoid words from batches 1-13|
| 15    | 701      | 750    | Avoid words from batches 1-14|
| 16    | 751      | 800    | Avoid words from batches 1-15|
| 17    | 801      | 850    | Avoid words from batches 1-16|
| 18    | 851      | 900    | Avoid words from batches 1-17|
| 19    | 901      | 950    | Avoid words from batches 1-18|
| 20    | 951      | 1000   | Avoid words from batches 1-19|

---

## Workflow Per Batch

1. Fill in `[BATCH_NUMBER]`, `[START_ID]`, `[END_ID]`, and set `[BATCH_SIZE]` to `50`
2. Paste the comma-separated list of all previously generated word names into `[PASTE_EXISTING_WORD_NAMES_HERE]`
3. Submit the prompt and receive JSON output
4. Append the new JSON entries into `words.json`
5. Add the new word names to your running "avoid" list
6. Repeat for the next batch

---

## Running Word List (update after each batch)

Paste generated word names here as a comma-separated list to use in the next batch:

```
Ephemeral, Serendipity, Ubiquitous, Eloquent, Resilient, Ambiguous, Pragmatic
```

> Keep appending new words here after each batch to avoid duplicates.
