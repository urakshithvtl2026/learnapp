# Signup Feature — Requirements

## Overview

Add a user self-registration (signup) flow to the Language Learn app. New users can create an account only if they provide a valid **Accept Key** (registration key). This key acts as an invitation/access control mechanism managed separately from user accounts.

---

## Data Files

### `src/assets/data/users.json` _(existing — updated)_

Add a `role` field to every user entry.

| Field      | Type              | Notes                              |
|------------|-------------------|------------------------------------|
| `username` | `string`          | Unique, case-sensitive             |
| `password` | `string`          | Plaintext for now (JSON prototype) |
| `role`     | `"admin" \| "user"` | `"admin"` for admin user, `"user"` for everyone else |

**Known users after update:**

```json
[
  { "username": "admin",  "password": "Admin123",  "role": "admin" },
  { "username": "john",   "password": "John@456",  "role": "user"  },
  { "username": "sarah",  "password": "Sarah@789", "role": "user"  }
]
```

> **Note:** users.json is a static asset — the browser cannot write to it. New users registered via the signup form are stored in `localStorage` (key: `lang_learn_local_users`). The auth service merges both sources on every login.

---

### `src/assets/data/registration-keys.json` _(new)_

A list of valid Accept Keys. Each key can be used **only once**. Used keys are tracked in `localStorage` (key: `lang_learn_used_keys`).

| Field   | Type     | Notes                        |
|---------|----------|------------------------------|
| `key`   | `string` | Unique registration key code |
| `label` | `string` | Human-readable description   |

**Initial keys (change or extend before distributing):**

```json
[
  { "key": "LEARN-2024",   "label": "Batch 1 — General Access" },
  { "key": "STUDENT-A1",   "label": "Student Group A"          },
  { "key": "BETA-ACCESS",  "label": "Beta Users"               },
  { "key": "LANG-OPEN01",  "label": "Open Enrollment 1"        }
]
```

> **Future:** Replace this file + localStorage with a backend API that manages keys (create, revoke, track usage).

---

## Auth Service Changes (`auth.service.ts`)

| Method / Property | Description |
|---|---|
| `login(username, password)` | Checks both `users.json` and `localStorage` users. Stores `{username, role}` in session. |
| `signup(username, password, acceptKey)` | Validates key (exists + not used), checks username uniqueness, saves new user to localStorage, marks key used. Returns `{success, error?}`. |
| `getRole()` | Returns `"admin" \| "user" \| null` from session. |
| `isAdmin()` | Returns `true` if current user role is `"admin"`. |
| `getUsername()` | Returns username string from session (unchanged API). |

**Session storage key:** `lang_learn_user` — value is now JSON `{"username":"…","role":"…"}` instead of a plain string. Backwards-compatible fallback included.

---

## Signup Page (`/signup`)

### Route
```
/signup  →  SignupComponent  (no auth guard — public route)
```

### Form Fields

| Field           | Validation                                      |
|-----------------|-------------------------------------------------|
| Username        | Required, min 3 chars, no spaces                |
| Password        | Required, min 6 chars                           |
| Confirm Password| Required, must match Password                   |
| Accept Key      | Required, must exist in `registration-keys.json` and not already used |

### UX Flow

1. User fills in the form and submits.
2. Client validates accept key against `registration-keys.json` (HTTP GET).
3. If key is invalid or already used → show inline error on the Accept Key field.
4. If username is already taken → show inline error on the Username field.
5. On success → show a success banner, then navigate to `/login` after 2 seconds.
6. A "Already have an account? Sign in" link is shown at the bottom.

### Login Page Change

Add a "Don't have an account? Sign up" link below the Sign In button, navigating to `/signup`.

---

## Constraints & Known Limitations

- **Static JSON, no real persistence:** Users registered via signup exist only in the current browser's localStorage. Clearing browser data removes them. This is intentional for the prototype phase.
- **Plaintext passwords:** Stored as-is in JSON and localStorage. Acceptable for a local prototype only.
- **Accept Keys are front-end validated:** Keys and their "used" state live in the browser. A user who clears localStorage can reuse a key. This is by design for now — to be replaced with backend validation.
- **No email verification.** Registration is immediate on valid key + unique username.

---

## Future Work (out of scope for now)

- [ ] Backend API for user storage (replace users.json)
- [ ] Backend API for key management (create, revoke, single-use enforcement)
- [ ] Password hashing
- [ ] Email verification step
- [ ] Admin panel to manage users and registration keys
- [ ] Role-based route guards (`adminGuard`)
