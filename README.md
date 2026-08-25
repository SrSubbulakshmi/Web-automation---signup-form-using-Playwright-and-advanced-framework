# Playwright Signup Automation Suite

End-to-end QA automation for the nesto signup page (`https://app.qa.nesto.ca/signup`) with Playwright + TypeScript.

This README is written for a who wants to run, debug, and present this project confidently.

---

## 1) What This Project Covers

- Signup happy-path validations (`tests/signup.positive.spec.ts`)
- Negative validations and error handling (`tests/signup.negative.spec.ts`)
- Labels/UI copy checks (`tests/signup.labels.spec.ts`)
- Localization checks for EN/FR (`tests/signup.i18n.spec.ts`)
- API-level submission behavior (`tests/signup.api.spec.ts`)

### Testing style used
- Page Object Model (`src/pages/`)
- Custom fixtures (`src/fixtures/signup.fixture.ts`)
- Dynamic test data with faker (`src/data/testData.ts`)
- Environment-driven config (`.env`, `playwright.config.ts`)

---

## 2) Prerequisites

| Tool | Minimum Version |
|------|---------------|
| Node.js | 18.x or later |
| npm | 9.x or later |
| macOS/Linux/Windows | |


Install dependencies and browser:

```bash
npm install
npm run install:browsers
```

---

## 3) Initial Setup

Create your local environment file:

```bash
cp .env.example .env
```

Update values in `.env` as needed:

| Variable | Required | Default | Description |
|---|---|---|---|
| `TEST_ENV` | No | `qa` | Target environment (`qa` / `dev` / `staging`) |
| `LOCALE` | No | `en` | App locale (`en` / `fr`) |
| `BASE_URL` | No | `https://app.qa.nesto.ca` | Shared host for locale-specific signup paths |
| `TEST_EXISTING_EMAIL` | **Yes** | — | A registered email for TC-A-02 / TC-N-15 |
| `TEST_COUNTRY_CODE` | No | `CA` | Phone country code |


### Multi-environment support (`TEST_ENV`)

The suite loads environment files in this order:

1. `.env` (shared defaults)
2. `.env.<TEST_ENV>` (environment-specific overrides)

Example: if `TEST_ENV=dev`, values from `.env.dev` override `.env`.

Recommended split:
- Keep **shared values** in `.env` (example: `LOCALE`, `TEST_COUNTRY_CODE`, common email domain)
- Keep **environment-specific values** in `.env.qa`, `.env.dev`, `.env.staging`
  (example: `BASE_URL`, `TEST_EMAIL_PREFIX`, `TEST_EXISTING_EMAIL`)

Locale-specific signup paths come from locale files (`/signup` and `/fr/signup`),
so one shared `BASE_URL` is enough.

Use the provided templates:
- `.env.qa.example`
- `.env.dev.example`
- `.env.staging.example`

Example:

```bash
TEST_ENV=dev npm run test:smoke
TEST_ENV=staging npm run test:positive
```

---

## 4) How To Run Tests

### Run everything

```bash
npm test
```

### Run by locale

```bash
npm run test:en
npm run test:fr
```
Or inline without changing `.env`:

```bash
LOCALE=fr npm test
```

### Run smoke

```bash
npm run test:smoke
```

### Run by suite

```bash
npm run test:positive
npm run test:negative
npm run test:labels
npm run test:i18n
npm run test:api
```
### Run a single test by name

```bash
npx playwright test --grep "TC-P-01"
```

### Run with headed browser (see the browser)

```bash
npx playwright test --headed
```

### Run on a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Open HTML report

```bash
npm run report
```

### `npm run` vs `npx` (recommended usage)

- Use `npm run ...` for standard team/CI flows (`test:positive`, `test:labels`, `test:smoke`).
- Use `npx playwright ...` for ad-hoc debugging (`--grep`, `--headed`, `--repeat-each`).

Examples:

```bash
npm run test:negative
npx playwright test tests/signup.labels.spec.ts --project=chromium --grep "TC-L-17"
```

---

## 5) Current Known Bug Tracking

Primary bug tracking document:
- `reports/BUG_REPORT.md`

### Important status notes
- Province defaulting behavior is an active issue (`BUG-01`, with `BUG-04` as duplicate/legacy tracking).
- Province-required negative path testability issue is tracked as `BUG-03`.

### Expected-fail tests (intentional)
Some tests are intentionally marked `test.fail()` to keep defects visible without making CI noisy. This means:
- test step may show failure details,
- but Playwright considers it expected for that known bug.

---

## 6) Artifacts and Evidence

Generated artifacts:
- `playwright-report/` (HTML report)
- `test-results/` (screenshots, videos, traces, error context)

### Normal engineering practice
- Usually, we do **not** commit generated report artifacts to source control.

### For task/demo submission
- For this assignment, reports are included as **test evidence**.
- This is intentional and documented for reviewer visibility.
- Keep evidence files minimal and relevant to the claimed findings.

Suggested evidence to submit:
1. `reports/BUG_REPORT.md`
2. targeted run output summary (or screenshot)
3. one example failure artifact (trace/screenshot) per active bug

---

## 7) Project Structure (Quick Map)

- `tests/` - test specs
- `src/pages/` - page objects and interaction logic
- `src/fixtures/` - custom fixtures (`test`, `expect`, locale/data wiring)
- `src/data/` - test data builders and locale files
- `src/utils/` - helper utilities
- `reports/` - bug report and documentation assets
- `playwright.config.ts` - runner config and projects



```
├── tests/
│   ├── signup.positive.spec.ts    Happy path
│   ├── signup.negative.spec.ts    Validation / error paths
│   ├── signup.labels.spec.ts      Labels, placeholders, links, UI copy
│   ├── signup.i18n.spec.ts        EN / FR internationalisation
│   └── signup.api.spec.ts         API response validation
│
├── src/
│   ├── pages/
│   │   ├── BasePage.ts            Navigation helpers
│   │   └── SignupPage.ts          Page Object Model — all locators, fill, assertion helpers
│   ├── fixtures/
│   │   └── signup.fixtures.ts     Custom Playwright fixtures (signupPage, testData, locale, strings)
│   ├── data/                      Test data builders and locale files
│   │   ├── testData.ts            buildValidFormData() — faker-driven dynamic test data
│   │   └── locales/
│   │       ├── en.ts              All English strings (labels, placeholders, URLs)
│   │       └── fr.ts              All French strings
│   ├── utils/                     Helper utilities
│   │   └── passwordHelper.ts      Password constants for negative tests
│   └── types/
│       └── index.ts               TypeScript types — SignupFormData, LocaleStrings, Province, PROVINCES
│
├── reports/                       Bug report and documentation assets 
│   └── BUG_REPORT.md              Documented bugs found during test development
│
├── playwright.config.ts           Playwright configuration (projects, reporters, timeouts)
├── .env.example                   Environment variable template — copy to .env
├── .env.qa.example                Environment-specific overrides template — copy to .env.qa
├── .env.dev.example               Environment-specific overrides template — copy to .env.dev
├── .env.staging.example           Environment-specific overrides template — copy to .env.staging
└── README.md                      This file
```

---

## 8) Design Decisions That Improve Stability

- Form-fill routines validate post-fill values to catch UI resets.
- Phone assertions normalize digits to support masked input values.
- Signup navigation waits for deterministic readiness signals instead of blind sleeps.
- Known defects are captured through expected-fail tests rather than hidden/ignored.

### Assertion strategy (hard vs soft)

- Use **hard assertions** (`expect(...)`) for critical flow gates where the test should stop immediately on failure:
  - page/state preconditions (for example, still on signup page),
  - submit/result behavior,
  - API success/failure checks.
- Use **soft assertions** (`expect.soft(...)`) for grouped UI/copy validations where collecting multiple mismatches in one run is useful:
  - placeholders,
  - labels,
  - localized copy text.
- Project convention:
  - `tests/signup.positive.spec.ts`, `tests/signup.negative.spec.ts`, and `tests/signup.api.spec.ts` are mostly hard assertions.
  - `tests/signup.labels.spec.ts` and selected copy checks in `tests/signup.i18n.spec.ts` use soft assertions where batch feedback is more valuable than fail-fast.
- Soft assertions should improve diagnostics, not hide blockers. Keep at least one hard assertion for each test's core behavior.

---

## 9) How To Debug Like a QE

### Re-run only one test

```bash
npx playwright test tests/signup.labels.spec.ts --project=chromium --grep "TC-L-17"
```

### Run headed for visual debugging

```bash
npx playwright test tests/signup.positive.spec.ts --ui
```

### Keep repeating to detect flakiness

```bash
npx playwright test tests/signup.positive.spec.ts --project=chromium --repeat-each=5
```

### Inspect report and traces

```bash
npx playwright show-report
```

---

## 10) KEY Points about this project

1. **Coverage quality**: positive, negative, UX labels, i18n, and API checks.
2. **Bug ownership**: clear bug IDs, reproducible evidence, and current status in `reports/BUG_REPORT.md`.
3. **Technical diagnosis**: identified timing/init behavior (province switching to `BC`) with deterministic evidence.
4. **Automation craftsmanship**: expected-fail strategy for known defects and robust assertion patterns.
5. **Traceability**: bug-to-test mapping (which test demonstrates each issue).
6. **Professional reporting**: clear distinction between fixed defects, open defects, and duplicate/legacy IDs.

---

## 11) Maintenance Checklist For New Contributors

Before raising a PR:

1. Run impacted suite(s).
2. Confirm expected-fail tests are still expected and justified.
3. Update `reports/BUG_REPORT.md` if behavior changed.
4. Include only relevant evidence artifacts for review.
5. Mention any env assumptions (`LOCALE`, `BASE_URL_*`, test data overrides).

### Locale override example (`appLocale` option fixture)

`src/fixtures/signup.fixture.ts` exposes `appLocale` as an option fixture so you can
override locale at test/describe scope.

```ts
import { test, expect } from '../src/fixtures/signup.fixture';

test.describe('French checks', () => {
  test.use({ appLocale: 'fr' });

  test('uses FR strings fixture', async ({ strings }) => {
	expect(strings.submitButton).toBe('Créer votre compte');
  });
});
```

---

## 12) Ownership Note

This repository intentionally includes detailed QA evidence for evaluation purposes. In a production repo, generated report folders should typically be excluded and archived through CI artifacts instead.
