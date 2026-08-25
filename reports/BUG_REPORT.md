# Bug Report - nesto Signup Page QA

**Page under test:** https://app.qa.nesto.ca/signup  
**Reported by:** QA Automation  
**Last verification date:** 2026-08-24  
**Environment:** QA (`app.qa.nesto.ca`)

---

## Verification Evidence (2026-08-23)

- `npx playwright test tests/signup.labels.spec.ts --project=chromium`
  - `TC-L-17 [BUG-01]` This is a bug as the province select flips from the placeholder to `BC` after the page finishes geolocation-driven initialization without any user interaction. Until the page preserves the empty placeholder state we marked test.fail()
- `npx playwright test tests/signup.negative.spec.ts --project=chromium --grep "TC-N-05|TC-N-18"`
  - `TC-N-05` and `TC-N-18` are intentionally marked `test.fail()` and currently fail at selection step because the placeholder option is disabled (`option being selected is not enabled`).
- Direct page probe (Playwright script):
  - Province value at first render: `""` (placeholder selected)
  - Province value after geolocation initialization (~1s later): `"BC"`

---

## BUG-01 - Province auto-selects `British-Columbia` without user interaction

| Field | Detail |
|---|---|
| **ID** | BUG-01 |
| **Severity** | Medium |
| **Status** | **Open** |
| **Component** | Signup Form - Province field |

### Current Finding
The province field renders the placeholder briefly, then automatically switches to `British-Columbia (BC)` with no user interaction.
This is still a real bug if expected behavior is “force user to choose province”.


This means the defect is still user-visible even though an early automation check may momentarily see `value=""` before client-side initialization completes.

### Evidence
- Manual observation consistently shows `British-Columbia` selected on a fresh page.
- Direct automation probe showed:
  - `0s -> ""`
  - `1s -> "BC"`
  - then remains `BC`

### Expected
The province field should remain on the placeholder (`value=""`) until the user explicitly selects a province.

---

## BUG-02 - Phone field lacks explicit format guidance text

| Field | Detail |
|---|---|
| **ID** | BUG-02 |
| **Severity** | Low |
| **Status** | **Open (Refined)** |
| **Component** | Signup Form - Phone number field |

### Updated Description

The UX gap is that there is no clear helper text describing expected format, digit count, or country-code behavior.

### Recommendation
Add helper text under the phone input, for example:
`e.g. 5141234567 (10 digits, no country code)`

---

## BUG-03 - Province required-path cannot be validated once BC is auto-selected

| Field | Detail                       |
|---|------------------------------|
| **ID** | BUG-03                       |
| **Severity** | Medium                       |
| **Status** | **Open**                     |
| **Component** | Signup Form - Province field |

### Current Finding

Testability/UX consequence bug - Because placeholder is disabled + auto-default happens,  can’t exercise blank-province required path via UI.

The placeholder option is disabled, and after initialization the field is auto-set to `BC`.
Because users cannot re-select the blank placeholder, it is impossible to keep province empty and validate the required-field path through normal UI interaction.

This is a functional/testability gap for province validation behavior in the current UX flow.

### Evidence
- `TC-L-14` passes (placeholder with `value=""` exists and is disabled).
- `TC-N-05` / `TC-N-18` (kept as expected-fail tests) fail at selection step with `option being selected is not enabled`, proving reselection is blocked.

### Expected
Either:
1. province remains empty until user selection (preferred), or
2. if auto-defaulting to `BC` is intentional, product should explicitly confirm province is optional and remove conflicting required-path validation expectations.

---

## BUG-04 - Duplicate of BUG-01 (legacy tracking ID)

| Field | Detail |
|---|---|
| **ID** | BUG-04 |
| **Severity** | Medium |
| **Status** | **Duplicate (See BUG-01)** |
| **Component** | Signup Form - Province field |

### Current Finding
Same root cause as BUG-01: the province field flips from placeholder to `BC` after initialization without user action.

### Evidence
- Refer to BUG-01 timeline evidence (`0s -> ""`, `1s -> "BC"`, then remains `BC`).

### Suggested Automation Strategy
Do not use an arbitrary sleep or open-ended polling assertion. Instead, wait for the deterministic geolocation initialization request (`GET /api/geolocation/all`) and then assert the settled province value.

---

## Automation Follow-ups

1. Keep `TC-L-17` marked as an expected failure until BUG-01 is fixed.
2. Keep `TC-N-05` and `TC-N-18` as known expected failures (or split into dedicated expected-fail coverage) until product/dev clarifies intended province required-path behavior.
3. Keep BUG-02 as a UX improvement ticket unless product confirms current behavior is acceptable.

---

## Summary Table

| ID | Title | Severity | Status |
|---|---|---|---|
| BUG-01 | Province auto-selects British-Columbia without user action | Medium | Open |
| BUG-02 | Phone field lacks explicit format guidance text | Low | Open |
| BUG-03 | Province required-path cannot be validated after auto-default | Medium | Open |
| BUG-04 | Duplicate of BUG-01 (legacy ID) | Medium | Duplicate |

