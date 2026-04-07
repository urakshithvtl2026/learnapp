# Exam Papers Requirement — C#, Angular, SQL

## Overview

Create **55 exam papers total** across three subjects:
- **C#** — 30 papers across 3 groups (Basic × 10, Advanced × 10, SOLID × 10)
- **Angular** — 10 papers across 2 sets (Basic × 5, Advanced × 5)
- **SQL** — 15 papers across 2 sets (Topic-Based × 10, Developer-Mixed × 5)

Each paper follows the **existing JSON structure** (see [papers/advanced-vocabulary.json](language-learn/src/assets/data/exam/papers/advanced-vocabulary.json)).

---

## JSON Structure (per paper file)

```json
{
  "id": "qp_cs_01",
  "title": "C# Basics — Variables & Data Types",
  "description": "Foundational C# concepts: variables, types, and operators.",
  "createdAt": "2026-02-26T09:00:00Z",
  "timer": { "enabled": true, "durationSeconds": 600, "autoSubmit": true },
  "questions": [
    {
      "id": "qp_cs_01_q1",
      "text": "Question text here?",
      "options": [
        { "id": "a", "text": "Option A" },
        { "id": "b", "text": "Option B" },
        { "id": "c", "text": "Option C" },
        { "id": "d", "text": "Option D" }
      ],
      "correctOptionId": "b"
    }
  ]
}
```

**Timer durations by difficulty (Angular & SQL papers):**
| Level        | durationSeconds |
|--------------|----------------|
| Beginner     | 1800 (30 min)  |
| Intermediate | 2700 (45 min)  |
| Advanced     | 3600 (60 min)  |

**Questions per paper:** 30 questions, 4 options each.

---

## Files to Create

All files go in: `language-learn/src/assets/data/exam/papers/`

---

## C# Papers (30 papers across 3 groups)

> **Uniqueness rules (apply per group):**
> - Each group has **20 topic areas × 15 unique questions = 300 total unique questions**
> - Each paper has **30 questions drawn from 10 different topic areas** (3 questions per area)
> - Each topic area's 15 questions are split across exactly 5 different papers (3 per paper) — **no question repeats**
> - Questions within each paper are shuffled (not grouped by topic)

> **Distribution design:** Topics split into two half-pools (T01–T10 and T11–T20).
> Each paper takes 5 consecutive topics (cyclic) from each half-pool.
> Each topic appears in exactly 5 papers; assign Q1–Q3 to 1st paper, Q4–Q6 to 2nd, Q7–Q9 to 3rd, Q10–Q12 to 4th, Q13–Q15 to 5th.

---

### Group 1 — C# Basic Papers (`qp_cs_b01` – `qp_cs_b10`)

All foundational C# concepts, randomly mixed across 10 papers. Timer: **1800 s (30 min)**.

#### File List

| # | File Name | Paper ID |
|---|-----------|----------|
| 1 | `csharp-basic-01.json` | `qp_cs_b01` |
| 2 | `csharp-basic-02.json` | `qp_cs_b02` |
| 3 | `csharp-basic-03.json` | `qp_cs_b03` |
| 4 | `csharp-basic-04.json` | `qp_cs_b04` |
| 5 | `csharp-basic-05.json` | `qp_cs_b05` |
| 6 | `csharp-basic-06.json` | `qp_cs_b06` |
| 7 | `csharp-basic-07.json` | `qp_cs_b07` |
| 8 | `csharp-basic-08.json` | `qp_cs_b08` |
| 9 | `csharp-basic-09.json` | `qp_cs_b09` |
| 10 | `csharp-basic-10.json` | `qp_cs_b10` |

#### Topic Pool — 20 Basic Topic Areas

| Code | Topic Area | Sample Sub-topics |
|------|-----------|-------------------|
| BT01 | Variables & Primitive Data Types | int, float, bool, char, decimal, var, const, readonly |
| BT02 | String Operations & Text Handling | interpolation, Format, Substring, Replace, Split, Trim, Compare |
| BT03 | Nullable Types & Null Operators | `int?`, `??`, `??=`, `?.`, null checks |
| BT04 | Type Casting & Conversion | implicit/explicit cast, Convert class, Parse, TryParse, boxing/unboxing |
| BT05 | Operators & Expressions | arithmetic, comparison, logical, bitwise, ternary, precedence |
| BT06 | Conditional Statements | if/else, nested if, switch statement, fall-through |
| BT07 | Switch Expressions & Basic Pattern Matching | `switch {}`, `is` keyword, `when` guard, type patterns |
| BT08 | Loops | for, while, do-while, foreach, nested loops |
| BT09 | Loop Control & Jump Statements | break, continue, return, goto (and why to avoid) |
| BT10 | Arrays | 1D, 2D, jagged, Array.Length, Array.Sort, Array.Copy |
| BT11 | Enums | declaration, underlying type, Flags attribute, casting, Enum.Parse |
| BT12 | Structs vs Classes | value vs reference semantics, stack vs heap, when to use struct |
| BT13 | Methods & Overloading | signatures, optional params, named args, params keyword |
| BT14 | ref, out & in Parameters | difference between ref/out/in, use cases, returning multiple values |
| BT15 | Classes & Object Instantiation | new keyword, fields, object initializer syntax |
| BT16 | Constructors | default, parameterized, constructor chaining (`:this()`), static constructors |
| BT17 | Access Modifiers & Encapsulation | public, private, protected, internal, protected internal, private protected |
| BT18 | Properties | auto-properties, expression-bodied, get/set/init, backing fields |
| BT19 | Static Members & Static Classes | static fields, static methods, static constructors, utility classes |
| BT20 | Inheritance, Abstract & Interfaces Basics | base keyword, virtual/override, abstract, interface, sealed, `is`/`as` |

#### Distribution Matrix

| Paper | Topics from BT01–BT10 | Topics from BT11–BT20 |
|-------|-----------------------|-----------------------|
| `qp_cs_b01` | BT01, BT02, BT03, BT04, BT05 | BT11, BT12, BT13, BT14, BT15 |
| `qp_cs_b02` | BT02, BT03, BT04, BT05, BT06 | BT12, BT13, BT14, BT15, BT16 |
| `qp_cs_b03` | BT03, BT04, BT05, BT06, BT07 | BT13, BT14, BT15, BT16, BT17 |
| `qp_cs_b04` | BT04, BT05, BT06, BT07, BT08 | BT14, BT15, BT16, BT17, BT18 |
| `qp_cs_b05` | BT05, BT06, BT07, BT08, BT09 | BT15, BT16, BT17, BT18, BT19 |
| `qp_cs_b06` | BT06, BT07, BT08, BT09, BT10 | BT16, BT17, BT18, BT19, BT20 |
| `qp_cs_b07` | BT07, BT08, BT09, BT10, BT01 | BT17, BT18, BT19, BT20, BT11 |
| `qp_cs_b08` | BT08, BT09, BT10, BT01, BT02 | BT18, BT19, BT20, BT11, BT12 |
| `qp_cs_b09` | BT09, BT10, BT01, BT02, BT03 | BT19, BT20, BT11, BT12, BT13 |
| `qp_cs_b10` | BT10, BT01, BT02, BT03, BT04 | BT20, BT11, BT12, BT13, BT14 |

> Each topic appears in exactly **5 papers**, contributing **3 questions per paper** (15 questions per topic total).
> Assign Q1–Q3 to the 1st paper, Q4–Q6 to the 2nd, Q7–Q9 to the 3rd, Q10–Q12 to the 4th, Q13–Q15 to the 5th (in the paper-ID order from above).
> Example: BT01 appears in b01, b07, b08, b09, b10 → Q1–Q3 go to b01, Q4–Q6 to b07, Q7–Q9 to b08, Q10–Q12 to b09, Q13–Q15 to b10.

---

### Group 2 — C# Advanced Papers (`qp_cs_a01` – `qp_cs_a10`)

Advanced C# topics, randomly mixed across 10 papers. Timer: **3600 s (60 min)**.

#### File List

| # | File Name | Paper ID |
|---|-----------|----------|
| 1 | `csharp-advanced-01.json` | `qp_cs_a01` |
| 2 | `csharp-advanced-02.json` | `qp_cs_a02` |
| 3 | `csharp-advanced-03.json` | `qp_cs_a03` |
| 4 | `csharp-advanced-04.json` | `qp_cs_a04` |
| 5 | `csharp-advanced-05.json` | `qp_cs_a05` |
| 6 | `csharp-advanced-06.json` | `qp_cs_a06` |
| 7 | `csharp-advanced-07.json` | `qp_cs_a07` |
| 8 | `csharp-advanced-08.json` | `qp_cs_a08` |
| 9 | `csharp-advanced-09.json` | `qp_cs_a09` |
| 10 | `csharp-advanced-10.json` | `qp_cs_a10` |

#### Topic Pool — 20 Advanced Topic Areas

| Code | Topic Area | Sample Sub-topics |
|------|-----------|-------------------|
| AT01 | Generics — Classes & Methods | `List<T>`, constraints (`where T : class/new()`), generic methods |
| AT02 | Generic Variance | covariance (`out`), contravariance (`in`), `IEnumerable<T>` vs `IEnumerable` |
| AT03 | LINQ — Core Operators | Where, Select, OrderBy, GroupBy, Join — method & query syntax |
| AT04 | LINQ — Advanced Operators | SelectMany, GroupJoin, Zip, Aggregate, deferred vs immediate execution |
| AT05 | Lambda & Functional Patterns | closures, capturing variables, currying, higher-order functions |
| AT06 | Delegates, Func<>, Action<>, Predicate<> | declaration, multicast, chaining, anonymous methods |
| AT07 | Events & Event Patterns | EventHandler, custom event args, weak events, memory leaks |
| AT08 | Async/Await & Task Basics | async/await, Task<T>, ConfigureAwait, Task.WhenAll/WhenAny |
| AT09 | Task Parallel Library | Parallel.For/ForEach, PLINQ, Task.Run, thread pool |
| AT10 | Async Patterns & CancellationToken | CancellationToken, ValueTask<T>, IAsyncEnumerable<T>, async streams |
| AT11 | Advanced Exception Handling | AggregateException, ExceptionDispatchInfo, try/catch/when, checked/unchecked |
| AT12 | Memory Management & IDisposable | GC, finalizers, IDisposable, using statement, object lifetimes |
| AT13 | Span<T>, Memory<T> & ref Structs | stack-only types, stackalloc, unsafe contexts |
| AT14 | Reflection | Type, MethodInfo, PropertyInfo, Activator.CreateInstance, dynamic invocation |
| AT15 | Attributes | built-in attributes, custom attributes, AttributeUsage, reading at runtime |
| AT16 | Extension Methods & Fluent APIs | `this` parameter, static class, fluent builder pattern |
| AT17 | Expression Trees | `Expression<Func<T>>`, building/compiling trees, use in LINQ providers |
| AT18 | Dynamic Types & ExpandoObject | `dynamic` keyword, DLR, ExpandoObject, interop use cases |
| AT19 | Advanced Pattern Matching | positional, property, list, `and`/`or`/`not` patterns (C# 8–12) |
| AT20 | Records, Tuples & Deconstruction | `record`, `record struct`, `with` expression, value tuples, `Deconstruct` |

#### Distribution Matrix

| Paper | Topics from AT01–AT10 | Topics from AT11–AT20 |
|-------|-----------------------|-----------------------|
| `qp_cs_a01` | AT01, AT02, AT03, AT04, AT05 | AT11, AT12, AT13, AT14, AT15 |
| `qp_cs_a02` | AT02, AT03, AT04, AT05, AT06 | AT12, AT13, AT14, AT15, AT16 |
| `qp_cs_a03` | AT03, AT04, AT05, AT06, AT07 | AT13, AT14, AT15, AT16, AT17 |
| `qp_cs_a04` | AT04, AT05, AT06, AT07, AT08 | AT14, AT15, AT16, AT17, AT18 |
| `qp_cs_a05` | AT05, AT06, AT07, AT08, AT09 | AT15, AT16, AT17, AT18, AT19 |
| `qp_cs_a06` | AT06, AT07, AT08, AT09, AT10 | AT16, AT17, AT18, AT19, AT20 |
| `qp_cs_a07` | AT07, AT08, AT09, AT10, AT01 | AT17, AT18, AT19, AT20, AT11 |
| `qp_cs_a08` | AT08, AT09, AT10, AT01, AT02 | AT18, AT19, AT20, AT11, AT12 |
| `qp_cs_a09` | AT09, AT10, AT01, AT02, AT03 | AT19, AT20, AT11, AT12, AT13 |
| `qp_cs_a10` | AT10, AT01, AT02, AT03, AT04 | AT20, AT11, AT12, AT13, AT14 |

> Same uniqueness rule: each AT topic appears in 5 papers, contributing 3 questions per paper (15 total).
> Assign Q1–Q3 to 1st paper, Q4–Q6 to 2nd, Q7–Q9 to 3rd, Q10–Q12 to 4th, Q13–Q15 to 5th (in the paper-ID order from above).

---

### Group 3 — C# SOLID Principles Papers (`qp_cs_s01` – `qp_cs_s10`)

SOLID principles, supporting patterns, code smells and refactoring — randomly mixed. Timer: **2700 s (45 min)**.

#### File List

| # | File Name | Paper ID |
|---|-----------|----------|
| 1 | `csharp-solid-01.json` | `qp_cs_s01` |
| 2 | `csharp-solid-02.json` | `qp_cs_s02` |
| 3 | `csharp-solid-03.json` | `qp_cs_s03` |
| 4 | `csharp-solid-04.json` | `qp_cs_s04` |
| 5 | `csharp-solid-05.json` | `qp_cs_s05` |
| 6 | `csharp-solid-06.json` | `qp_cs_s06` |
| 7 | `csharp-solid-07.json` | `qp_cs_s07` |
| 8 | `csharp-solid-08.json` | `qp_cs_s08` |
| 9 | `csharp-solid-09.json` | `qp_cs_s09` |
| 10 | `csharp-solid-10.json` | `qp_cs_s10` |

#### Topic Pool — 20 SOLID Topic Areas

| Code | Topic Area | Sample Sub-topics |
|------|-----------|-------------------|
| ST01 | SRP — Concept & Recognition | definition, "one reason to change", identifying violations in code |
| ST02 | SRP — Refactoring & Application | splitting classes, separating concerns, service extraction |
| ST03 | OCP — Concept & Recognition | open for extension / closed for modification, identifying violations |
| ST04 | OCP — Refactoring & Application | abstract base classes, interfaces for extension points, plug-in patterns |
| ST05 | LSP — Concept & Recognition | substitutability rule, Liskov definition, identifying LSP violations |
| ST06 | LSP — Refactoring & Fixes | preconditions/postconditions, broken overrides, fixing LSP violations |
| ST07 | ISP — Concept & Recognition | fat interfaces, role interfaces, identifying ISP violations |
| ST08 | ISP — Refactoring & Application | splitting interfaces, cohesion, applying ISP in C# |
| ST09 | DIP — Concept & Recognition | abstractions over concretions, high-level vs low-level modules |
| ST10 | DIP — Implementation in C# | constructor injection, interface-based DIP, DI containers overview |
| ST11 | Dependency Injection Patterns | constructor / property / method injection, DI containers (Microsoft.Extensions.DI) |
| ST12 | Strategy Pattern | intent, structure, replacing conditionals, OCP/SRP alignment |
| ST13 | Factory & Abstract Factory | intent, when to use, decoupling object creation, OCP support |
| ST14 | Decorator Pattern | wrapping objects, adding behavior, SRP/OCP in practice |
| ST15 | Observer Pattern | event-based design, publisher/subscriber, EventHandler in C# |
| ST16 | Repository Pattern | data access abstraction, DIP alignment, testability |
| ST17 | Code Smells & SOLID Violations | God class, feature envy, long method, shotgun surgery, divergent change |
| ST18 | Refactoring Techniques | Extract Method, Extract Class, Move Method, Replace Conditional with Polymorphism |
| ST19 | Unit Testing & SOLID | why SOLID improves testability, mocking, test doubles (mock/stub/spy/fake) |
| ST20 | SOLID — Real C# Scenarios | recognising which principle is violated in given C# code snippets |

#### Distribution Matrix

| Paper | Topics from ST01–ST10 | Topics from ST11–ST20 |
|-------|-----------------------|-----------------------|
| `qp_cs_s01` | ST01, ST02, ST03, ST04, ST05 | ST11, ST12, ST13, ST14, ST15 |
| `qp_cs_s02` | ST02, ST03, ST04, ST05, ST06 | ST12, ST13, ST14, ST15, ST16 |
| `qp_cs_s03` | ST03, ST04, ST05, ST06, ST07 | ST13, ST14, ST15, ST16, ST17 |
| `qp_cs_s04` | ST04, ST05, ST06, ST07, ST08 | ST14, ST15, ST16, ST17, ST18 |
| `qp_cs_s05` | ST05, ST06, ST07, ST08, ST09 | ST15, ST16, ST17, ST18, ST19 |
| `qp_cs_s06` | ST06, ST07, ST08, ST09, ST10 | ST16, ST17, ST18, ST19, ST20 |
| `qp_cs_s07` | ST07, ST08, ST09, ST10, ST01 | ST17, ST18, ST19, ST20, ST11 |
| `qp_cs_s08` | ST08, ST09, ST10, ST01, ST02 | ST18, ST19, ST20, ST11, ST12 |
| `qp_cs_s09` | ST09, ST10, ST01, ST02, ST03 | ST19, ST20, ST11, ST12, ST13 |
| `qp_cs_s10` | ST10, ST01, ST02, ST03, ST04 | ST20, ST11, ST12, ST13, ST14 |

> Same uniqueness rule: each ST topic appears in 5 papers, contributing 3 questions per paper (15 total).
> Assign Q1–Q3 to 1st paper, Q4–Q6 to 2nd, Q7–Q9 to 3rd, Q10–Q12 to 4th, Q13–Q15 to 5th (in the paper-ID order from above).

---

## Angular Papers (10 papers across 2 sets)

> **Structure:** 2 sets of 5 papers each — Basic and Advanced.
> **Uniqueness rules (per set):**
> - Each set has **10 topic areas × 15 unique questions = 150 total unique questions**
> - Every paper in the set covers **all 10 topic areas** (3 questions per area = 30 questions per paper)
> - Questions within each area are split: Q1–Q3 → paper 1, Q4–Q6 → paper 2, Q7–Q9 → paper 3, Q10–Q12 → paper 4, Q13–Q15 → paper 5
> - **No question repeats** across all 5 papers in a set; questions within each paper are shuffled by topic

---

### Set 1 — Angular Basic Papers (`qp_ng_b01` – `qp_ng_b05`)

Every paper covers **all 10 basic topic areas** with 3 different questions each. Timer: **1800 s (30 min)**.

#### File List

| # | File Name | Paper ID |
|---|-----------|----------|
| 1 | `angular-basic-01.json` | `qp_ng_b01` |
| 2 | `angular-basic-02.json` | `qp_ng_b02` |
| 3 | `angular-basic-03.json` | `qp_ng_b03` |
| 4 | `angular-basic-04.json` | `qp_ng_b04` |
| 5 | `angular-basic-05.json` | `qp_ng_b05` |

#### Topic Pool — 10 Basic Topic Areas (15 questions each)

| Code | Topic Area | Sub-topics to Cover |
|------|-----------|---------------------|
| NAB01 | Components & Templates | `@Component` decorator, selector, templateUrl/template, styleUrls, `ViewEncapsulation`, standalone components (Angular 14+) |
| NAB02 | Data Binding | interpolation `{{ }}`, property binding `[prop]`, event binding `(event)`, two-way `[(ngModel)]`, template reference variables `#ref`, attribute binding |
| NAB03 | Built-in Directives | `*ngIf` / `@if`, `*ngFor` / `@for`, `*ngSwitch` / `@switch`, `ngClass`, `ngStyle`, `trackBy`, `@empty` block |
| NAB04 | Component Communication | `@Input()`, `@Output()`, `EventEmitter`, parent→child data flow, child→parent events, `@ViewChild`, `ng-content` |
| NAB05 | Lifecycle Hooks | hook order, `ngOnChanges`, `ngOnInit`, `ngDoCheck`, `ngAfterViewInit`, `ngAfterContentInit`, `ngOnDestroy`, use cases |
| NAB06 | Services & Basic DI | `@Injectable`, `providedIn: 'root'`, constructor injection, singleton scope, providing in component, `inject()` function |
| NAB07 | Modules & Standalone | `@NgModule` (declarations, imports, exports, providers, bootstrap), `CommonModule`, `FormsModule`, standalone vs module-based |
| NAB08 | Template-driven Forms | `ngForm`, `ngModel`, `ngSubmit`, `required` / `minlength` / `pattern` validators, form state (`valid`, `dirty`, `touched`, `pristine`) |
| NAB09 | Built-in Pipes | `date`, `number`, `currency`, `uppercase`, `lowercase`, `titlecase`, `json`, `slice`, `async`, pipe chaining, locale |
| NAB10 | Angular CLI & Project Structure | `ng new`, `ng generate component/service/module/pipe`, `ng serve`, `ng build`, `ng test`, `angular.json`, `main.ts`, `app.config.ts` |

#### Question Distribution

> All 5 papers cover all 10 topic areas. Questions are assigned per topic as follows:

| Topic | Paper b01 | Paper b02 | Paper b03 | Paper b04 | Paper b05 |
|-------|-----------|-----------|-----------|-----------|-----------|
| NAB01 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB02 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB03 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB04 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB05 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB06 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB07 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB08 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB09 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAB10 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |

> Each paper = 10 topics × 3 questions = **30 questions**, shuffled so topics are not grouped.

---

### Set 2 — Angular Advanced Papers (`qp_ng_a01` – `qp_ng_a05`)

Every paper covers **all 10 advanced topic areas** with 3 different questions each. Timer: **3600 s (60 min)**.

> **Code-based questions:** Advanced papers may embed short TypeScript / HTML snippets inside the question text
> (e.g., "Given this component code, what is the output?", "What is wrong with this interceptor?").

#### File List

| # | File Name | Paper ID |
|---|-----------|----------|
| 1 | `angular-advanced-01.json` | `qp_ng_a01` |
| 2 | `angular-advanced-02.json` | `qp_ng_a02` |
| 3 | `angular-advanced-03.json` | `qp_ng_a03` |
| 4 | `angular-advanced-04.json` | `qp_ng_a04` |
| 5 | `angular-advanced-05.json` | `qp_ng_a05` |

#### Topic Pool — 10 Advanced Topic Areas (15 questions each)

| Code | Topic Area | Sub-topics & Question Styles |
|------|-----------|------------------------------|
| NAA01 | Reactive Forms | `FormGroup`, `FormControl`, `FormArray`, `FormBuilder`, `patchValue` vs `setValue`, `getRawValue`, nested groups — includes code-read questions |
| NAA02 | Custom Validators & Async Validators | `ValidatorFn`, `AbstractControl`, `AsyncValidatorFn`, cross-field validators, debounce in async — includes code-fix questions |
| NAA03 | Routing & Navigation | `RouterModule.forRoot/forChild`, `ActivatedRoute`, `Router.navigate`, route params, query params, child routes, `router-outlet` |
| NAA04 | Route Guards & Lazy Loading | `CanActivateFn`, `CanDeactivateFn`, `ResolveFn`, `loadChildren`, `PreloadAllModules`, `QuicklinkStrategy` |
| NAA05 | HTTP Client & Interceptors | `HttpClient`, `HttpInterceptorFn`, `catchError`, `retry`, `finalize`, request/response transformation — includes code-read questions |
| NAA06 | RxJS Operators & Subjects | `switchMap`, `mergeMap`, `concatMap`, `exhaustMap`, `forkJoin`, `combineLatest`, `BehaviorSubject`, `Subject`, `takeUntilDestroyed` — code-based |
| NAA07 | Change Detection & Performance | `ChangeDetectionStrategy.OnPush`, `ChangeDetectorRef`, `NgZone.runOutsideAngular`, `trackBy`, virtual scrolling, signal-based detection |
| NAA08 | Custom Directives & Pipes | `@Directive`, `HostListener`, `HostBinding`, `Renderer2`, `ElementRef`, `@Pipe` (pure/impure), `ng-content`, content projection — code-read |
| NAA09 | State Management & Signals | NgRx (`createAction`, `createReducer`, `createSelector`, `createEffect`), `Signal`, `computed()`, `effect()`, `toSignal`, `toObservable` |
| NAA10 | Testing & Security | `TestBed.configureTestingModule`, `ComponentFixture`, `jasmine.createSpyObj`, `fakeAsync`/`tick`, `HttpTestingController`, `DomSanitizer`, XSS/CSRF — code-read |

#### Question Distribution

> All 5 papers cover all 10 topic areas. Questions are assigned per topic as follows:

| Topic | Paper a01 | Paper a02 | Paper a03 | Paper a04 | Paper a05 |
|-------|-----------|-----------|-----------|-----------|-----------|
| NAA01 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA02 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA03 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA04 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA05 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA06 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA07 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA08 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA09 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NAA10 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |

> Each paper = 10 topics × 3 questions = **30 questions**, shuffled so topics are not grouped.
> For code-based questions, embed short snippets inside `"text"` using escaped newlines or a concise inline format.

---

## SQL Papers (15 papers across 2 sets)

> **Set 1** — 10 concept-focused papers, each dedicated to one SQL topic (beginner to advanced progression).
> **Set 2** — 5 developer-perspective papers, all SQL concepts mixed, scenario-based, moderately challenging.

---

### Set 1 — SQL Topic-Based Papers (`qp_sql_01` – `qp_sql_10`)

Concept-focused, one topic per paper. Timer: 1800 s (Beginner) / 2700 s (Intermediate) / 3600 s (Advanced).

| # | File Name | Paper ID | Title | Difficulty |
|---|-----------|----------|-------|------------|
| 1 | `sql-basics-select.json` | `qp_sql_01` | SQL Basics — SELECT & WHERE | Beginner |
| 2 | `sql-filtering-sorting.json` | `qp_sql_02` | SQL Filtering, Sorting & Limiting | Beginner |
| 3 | `sql-joins.json` | `qp_sql_03` | SQL Joins — INNER, LEFT, RIGHT, FULL | Beginner |
| 4 | `sql-aggregations.json` | `qp_sql_04` | SQL Aggregations & GROUP BY | Intermediate |
| 5 | `sql-subqueries-cte.json` | `qp_sql_05` | SQL Subqueries & CTEs | Intermediate |
| 6 | `sql-indexes-performance.json` | `qp_sql_06` | SQL Indexes & Query Performance | Intermediate |
| 7 | `sql-transactions.json` | `qp_sql_07` | SQL Transactions & ACID Properties | Intermediate |
| 8 | `sql-stored-procedures.json` | `qp_sql_08` | SQL Stored Procedures & Functions | Advanced |
| 9 | `sql-window-functions.json` | `qp_sql_09` | SQL Window Functions | Advanced |
| 10 | `sql-advanced-optimization.json` | `qp_sql_10` | SQL Advanced Optimization & Execution Plans | Advanced |

### SQL Paper Topics Detail

#### `qp_sql_01` — Beginner — SQL Basics
- `SELECT`, `FROM`, `WHERE`
- `SELECT *` vs specific columns
- Column aliases (`AS`)
- `DISTINCT`
- Comparison operators (`=`, `<>`, `>`, `<`, `>=`, `<=`)
- `NULL` handling (`IS NULL`, `IS NOT NULL`)
- `BETWEEN`
- `IN` and `NOT IN`
- `LIKE` with `%` and `_` wildcards
- Comments in SQL

#### `qp_sql_02` — Beginner — Filtering, Sorting & Limiting
- `ORDER BY ASC/DESC`
- `TOP` / `LIMIT` / `FETCH FIRST`
- `OFFSET` pagination
- `AND`, `OR`, `NOT` logical operators
- Operator precedence
- `CASE WHEN THEN ELSE END`
- `COALESCE` and `ISNULL`
- `NULLIF`
- String functions (`UPPER`, `LOWER`, `LEN`, `TRIM`)
- Date functions (`GETDATE`, `NOW`, `DATEPART`)

#### `qp_sql_03` — Beginner — SQL Joins
- `INNER JOIN` — matching rows only
- `LEFT JOIN` — all from left, matched from right
- `RIGHT JOIN` — all from right
- `FULL OUTER JOIN`
- `CROSS JOIN`
- Self join
- Multi-table joins
- Join on multiple conditions
- Difference between `JOIN` and subquery
- Aliases in joins

#### `qp_sql_04` — Intermediate — Aggregations & GROUP BY
- `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- `GROUP BY` single and multiple columns
- `HAVING` vs `WHERE`
- Grouping NULLs
- `ROLLUP`, `CUBE`, `GROUPING SETS`
- `COUNT(*)` vs `COUNT(column)`
- `DISTINCT` inside aggregates
- Aggregate with joins
- Filtering after aggregation
- `GROUP BY` with expressions

#### `qp_sql_05` — Intermediate — Subqueries & CTEs
- Scalar subqueries
- Correlated subqueries
- `EXISTS` and `NOT EXISTS`
- `IN` with subquery
- Derived tables (inline views)
- `WITH` CTE syntax
- Recursive CTEs
- CTE vs subquery readability
- Multiple CTEs chained
- `EXCEPT` and `INTERSECT`

#### `qp_sql_06` — Intermediate — Indexes & Performance
- Clustered vs non-clustered index
- Composite indexes
- Index covering (included columns)
- Index seek vs index scan
- When indexes hurt performance (inserts/updates)
- `EXPLAIN` / `SET STATISTICS` / execution plan
- Missing index suggestions
- Index fragmentation and `REBUILD`/`REORGANIZE`
- Filtered indexes
- Column store indexes

#### `qp_sql_07` — Intermediate — Transactions & ACID
- `BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`
- ACID properties (Atomicity, Consistency, Isolation, Durability)
- Isolation levels (`READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ`, `SERIALIZABLE`)
- Dirty reads, phantom reads, non-repeatable reads
- Deadlocks and how to avoid
- `SAVEPOINT`
- Optimistic vs pessimistic locking
- `NOLOCK` hint
- Implicit vs explicit transactions
- `SET XACT_ABORT ON`

#### `qp_sql_08` — Advanced — Stored Procedures & Functions
- Creating stored procedures (`CREATE PROCEDURE`)
- Input and output parameters
- `EXEC` / `EXECUTE`
- Scalar user-defined functions (`CREATE FUNCTION`)
- Table-valued functions (inline vs multi-statement)
- `RETURN` vs output parameters
- Error handling (`TRY...CATCH`, `THROW`, `RAISERROR`)
- `@@ROWCOUNT`, `@@ERROR`
- Recompile hints
- Stored procedure vs ad-hoc SQL performance

#### `qp_sql_09` — Advanced — Window Functions
- `OVER()` clause
- `PARTITION BY` and `ORDER BY` in window
- `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `NTILE()`
- `LAG()` and `LEAD()`
- `FIRST_VALUE()`, `LAST_VALUE()`
- `SUM() OVER`, `AVG() OVER` (running totals)
- Frame specification (`ROWS BETWEEN`, `RANGE BETWEEN`)
- Window functions vs GROUP BY
- Filtering window function results
- Practical use cases (pagination, top-N per group)

#### `qp_sql_10` — Advanced — Optimization & Execution Plans
- Reading execution plans (operators, cost %)
- Table scan vs index scan vs seek
- Key lookup and how to eliminate
- Parameter sniffing
- Query hints (`OPTION RECOMPILE`, `MAXDOP`)
- Statistics (`UPDATE STATISTICS`)
- Tempdb usage and temp tables vs table variables
- `NOLOCK`, `READPAST`, `UPDLOCK`
- Query Store overview
- Identifying blocking and long-running queries

---

### Set 2 — SQL Developer-Perspective Papers (`qp_sql_d01` – `qp_sql_d05`)

All SQL topics randomly mixed across 5 papers. Questions are **scenario-based and developer-focused** — slightly harder than Set 1 but not overly complex. No raw-theory questions; every question connects to a real development situation. Timer: **2700 s (45 min)**.

> **Question style examples:**
> - "A developer runs the following query on a 2M-row table — what is the performance concern?"
> - "Which JOIN type should be used to include unmatched rows from the left table?"
> - "Given this stored procedure, which line causes the SQL injection vulnerability?"
> - "What will `ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC)` return for tied salaries?"
> - "A transaction updates 3 rows then fails — what happens to the previously committed rows?"

#### File List

| # | File Name | Paper ID |
|---|-----------|----------|
| 1 | `sql-dev-01.json` | `qp_sql_d01` |
| 2 | `sql-dev-02.json` | `qp_sql_d02` |
| 3 | `sql-dev-03.json` | `qp_sql_d03` |
| 4 | `sql-dev-04.json` | `qp_sql_d04` |
| 5 | `sql-dev-05.json` | `qp_sql_d05` |

#### Topic Pool — 10 Developer Topic Areas (15 questions each)

| Code | Topic Area | Developer Focus & Sub-topics |
|------|-----------|------------------------------|
| NSQ01 | Efficient Query Writing | Avoiding `SELECT *`, column aliasing, filtering early, query readability, `DISTINCT` vs `GROUP BY`, avoiding functions on indexed columns in `WHERE` |
| NSQ02 | JOIN Strategy in Practice | Choosing correct join for the scenario, multi-table joins, self-joins, recognising accidental cartesian products, join vs subquery performance |
| NSQ03 | Filtering, NULLs & CASE Logic | Complex `WHERE` with `AND`/`OR`/`NOT`, operator precedence bugs, `NULL` in joins & aggregates, `COALESCE`/`ISNULL` in real data, `CASE WHEN` in SELECT/WHERE/ORDER |
| NSQ04 | Aggregations in Context | `GROUP BY` with JOINs, `HAVING` vs `WHERE` on aggregates, `COUNT(*)` vs `COUNT(col)`, `DISTINCT` inside aggregates, spotting incorrect aggregation in given code |
| NSQ05 | CTEs, Subqueries & Set Ops | Choosing CTE vs subquery vs JOIN for a given task, correlated subquery cost, `EXISTS` vs `IN` in large datasets, `EXCEPT`/`INTERSECT` use cases, recursive CTE tracing |
| NSQ06 | Indexes for Developers | Which queries benefit from an index, composite index column order decisions, covering index vs key lookup, when NOT to add an index, spotting missing-index hints |
| NSQ07 | Transactions in Application Code | `TRY…CATCH` + `ROLLBACK` patterns, choosing isolation level for common scenarios (concurrent reads, inventory updates), deadlock cause & avoidance, `SET XACT_ABORT ON` |
| NSQ08 | Window Functions for Reporting | `ROW_NUMBER` for pagination, `RANK` vs `DENSE_RANK` with ties, `LAG`/`LEAD` for period-over-period comparison, running totals with `SUM() OVER`, top-N per group |
| NSQ09 | Stored Procedures & Parameterisation | Parameterised queries vs string concatenation (SQL injection), SP output parameters, `TRY…CATCH` in procs, `@@ROWCOUNT` checks, SP vs inline SQL trade-offs |
| NSQ10 | Data Safety & Schema Decisions | Safe `UPDATE`/`DELETE` patterns (always `WHERE`), constraints (`PK`, `FK`, `UNIQUE`, `CHECK`), data type selection impact, soft delete vs hard delete, normalisation trade-offs |

#### Question Distribution

> All 5 papers cover all 10 topic areas. Questions are assigned per topic as follows:

| Topic | Paper d01 | Paper d02 | Paper d03 | Paper d04 | Paper d05 |
|-------|-----------|-----------|-----------|-----------|-----------|
| NSQ01 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ02 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ03 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ04 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ05 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ06 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ07 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ08 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ09 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |
| NSQ10 | Q01–Q03 | Q04–Q06 | Q07–Q09 | Q10–Q12 | Q13–Q15 |

> Each paper = 10 topics × 3 questions = **30 questions**, shuffled so topics are not grouped.
> Questions may include short SQL snippets in the question text for output-prediction or bug-spotting tasks.

---

## Files to Register

After creating each paper file, add its path to:
[question-papers-index.json](language-learn/src/assets/data/exam/question-papers-index.json)

```json
[
  "assets/data/exam/papers/csharp-basic-01.json",
  "assets/data/exam/papers/csharp-basic-02.json",
  "assets/data/exam/papers/csharp-basic-03.json",
  "assets/data/exam/papers/csharp-basic-04.json",
  "assets/data/exam/papers/csharp-basic-05.json",
  "assets/data/exam/papers/csharp-basic-06.json",
  "assets/data/exam/papers/csharp-basic-07.json",
  "assets/data/exam/papers/csharp-basic-08.json",
  "assets/data/exam/papers/csharp-basic-09.json",
  "assets/data/exam/papers/csharp-basic-10.json",
  "assets/data/exam/papers/csharp-advanced-01.json",
  "assets/data/exam/papers/csharp-advanced-02.json",
  "assets/data/exam/papers/csharp-advanced-03.json",
  "assets/data/exam/papers/csharp-advanced-04.json",
  "assets/data/exam/papers/csharp-advanced-05.json",
  "assets/data/exam/papers/csharp-advanced-06.json",
  "assets/data/exam/papers/csharp-advanced-07.json",
  "assets/data/exam/papers/csharp-advanced-08.json",
  "assets/data/exam/papers/csharp-advanced-09.json",
  "assets/data/exam/papers/csharp-advanced-10.json",
  "assets/data/exam/papers/csharp-solid-01.json",
  "assets/data/exam/papers/csharp-solid-02.json",
  "assets/data/exam/papers/csharp-solid-03.json",
  "assets/data/exam/papers/csharp-solid-04.json",
  "assets/data/exam/papers/csharp-solid-05.json",
  "assets/data/exam/papers/csharp-solid-06.json",
  "assets/data/exam/papers/csharp-solid-07.json",
  "assets/data/exam/papers/csharp-solid-08.json",
  "assets/data/exam/papers/csharp-solid-09.json",
  "assets/data/exam/papers/csharp-solid-10.json",
  "assets/data/exam/papers/angular-basic-01.json",
  "assets/data/exam/papers/angular-basic-02.json",
  "assets/data/exam/papers/angular-basic-03.json",
  "assets/data/exam/papers/angular-basic-04.json",
  "assets/data/exam/papers/angular-basic-05.json",
  "assets/data/exam/papers/angular-advanced-01.json",
  "assets/data/exam/papers/angular-advanced-02.json",
  "assets/data/exam/papers/angular-advanced-03.json",
  "assets/data/exam/papers/angular-advanced-04.json",
  "assets/data/exam/papers/angular-advanced-05.json",
  "assets/data/exam/papers/sql-basics-select.json",
  "assets/data/exam/papers/sql-filtering-sorting.json",
  "assets/data/exam/papers/sql-joins.json",
  "assets/data/exam/papers/sql-aggregations.json",
  "assets/data/exam/papers/sql-subqueries-cte.json",
  "assets/data/exam/papers/sql-indexes-performance.json",
  "assets/data/exam/papers/sql-transactions.json",
  "assets/data/exam/papers/sql-stored-procedures.json",
  "assets/data/exam/papers/sql-window-functions.json",
  "assets/data/exam/papers/sql-advanced-optimization.json",
  "assets/data/exam/papers/sql-dev-01.json",
  "assets/data/exam/papers/sql-dev-02.json",
  "assets/data/exam/papers/sql-dev-03.json",
  "assets/data/exam/papers/sql-dev-04.json",
  "assets/data/exam/papers/sql-dev-05.json"
]
```

---

## Summary

### C# Papers Breakdown

| Group | Papers | Questions per Paper | Total Unique Questions | Timer |
|-------|--------|--------------------|-----------------------|-------|
| Basic (`qp_cs_b01`–`b10`) | 10 | 30 (3 per topic × 10 areas) | 300 | 1800 s (30 min) |
| Advanced (`qp_cs_a01`–`a10`) | 10 | 30 (3 per topic × 10 areas) | 300 | 3600 s (60 min) |
| SOLID (`qp_cs_s01`–`s10`) | 10 | 30 (3 per topic × 10 areas) | 300 | 2700 s (45 min) |
| **C# Total** | **30** | | **900** | |

### Overall Totals

| Topic | Set | Papers | Qs/Paper | Total Unique Qs | Timer |
|-------|-----|--------|----------|-----------------|-------|
| C# | Basic | 10 | 30 | 300 | 1800 s |
| C# | Advanced | 10 | 30 | 300 | 3600 s |
| C# | SOLID | 10 | 30 | 300 | 2700 s |
| Angular | Basic | 5 | 30 | 150 | 1800 s |
| Angular | Advanced (code Qs) | 5 | 30 | 150 | 3600 s |
| SQL | Set 1 — Topic-Based | 10 | 30 | 300 | 1800–3600 s |
| SQL | Set 2 — Developer Mixed | 5 | 30 | 150 | 2700 s |
| **Grand Total** | | **55** | **30** | **1650** | |
