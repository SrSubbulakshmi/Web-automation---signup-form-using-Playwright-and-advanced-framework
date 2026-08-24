import { test, expect } from '../src/fixtures/signup.fixture';
import { PROVINCES } from '../src/types';

test.describe('Signup – Field Labels & UI Copy Tests', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.goto();
  });

  // ── TC-L-01 ──────────────────────────────────────────────────────────────
  test('TC-L-01 @smoke page heading text is correct', async ({ signupPage, strings }) => {
    await expect(signupPage.heading).toHaveText(strings.heading);
  });

  // ── TC-L-02 ──────────────────────────────────────────────────────────────
  test('TC-L-02 @smoke all field labels are visible', async ({ signupPage }) => {
    await signupPage.expectAllFieldsAndLabelsVisible();
  });

  // ── TC-L-03 ──────────────────────────────────────────────────────────────
  test('TC-L-03 all input placeholders are correct', async ({ signupPage, strings }) => {
    await expect.soft(signupPage.firstNameInput).toHaveAttribute('placeholder', strings.placeholders.firstName);
    await expect.soft(signupPage.lastNameInput).toHaveAttribute('placeholder', strings.placeholders.lastName);
    await expect.soft(signupPage.phoneInput).toHaveAttribute('placeholder', strings.placeholders.phone);
    await expect.soft(signupPage.emailInput).toHaveAttribute('placeholder', strings.placeholders.email);
    await expect.soft(signupPage.passwordInput).toHaveAttribute('placeholder', strings.placeholders.password);
    await expect.soft(signupPage.confirmPasswordInput).toHaveAttribute('placeholder', strings.placeholders.confirmPassword);
  });

  // ── TC-L-04 ──────────────────────────────────────────────────────────────
  test('TC-L-04 password hint text is visible below the password field', async ({ signupPage }) => {
    await expect(signupPage.passwordHint).toBeVisible();
    const hintText = await signupPage.getPasswordHintText();
    // Verify the hint at least contains the key numbers (12 and 32)
    expect(hintText).toMatch(/12/);
    expect(hintText).toMatch(/32/);
  });

  // ── TC-L-05 ──────────────────────────────────────────────────────────────
  test('TC-L-05 submit button has correct label', async ({ signupPage, strings }) => {
    await expect(signupPage.submitButton).toBeVisible();
    await expect(signupPage.submitButton).toHaveText(strings.submitButton);
  });

  // ── TC-L-06 ──────────────────────────────────────────────────────────────
  test('TC-L-06 login link is present and points to login page', async ({ signupPage, strings, page }) => {
    await expect.soft(page.getByText(strings.loginPrompt)).toBeVisible();
    await expect.soft(signupPage.loginLink).toBeVisible();
    const href = await signupPage.loginLink.getAttribute('href');
    expect(href).toBeTruthy();
  });

  // ── TC-L-07 ──────────────────────────────────────────────────────────────
  test('TC-L-07 Terms of Service link is present and has correct href [BUG-05]', async ({
    signupPage,
    strings,
  }) => {
    // BUG-05 is fixed in QA; keep this as a regression guard.
    await expect(signupPage.termsLink).toBeVisible();
    await expect(signupPage.termsLink).toHaveAttribute('href', strings.termsUrl);
  });

  // ── TC-L-08 ──────────────────────────────────────────────────────────────
  test('TC-L-08 Privacy Policy link is present and has correct href', async ({
    signupPage,
    strings,
  }) => {
    await expect(signupPage.privacyLink).toBeVisible();
    await expect(signupPage.privacyLink).toHaveAttribute('href', strings.privacyUrl);
  });

  // ── TC-L-09 ──────────────────────────────────────────────────────────────
  test('TC-L-09 province dropdown contains all 13 Canadian provinces and territories', async ({
    signupPage,
  }) => {
    // Province display text is locale-dependent (EN: "Quebec", FR: "Québec") so we check
    // option values (the province codes), which are locale-agnostic.
    // evaluate() reads option.value directly from the DOM — avoids Playwright's innerText
    // limitation on layout-invisible <option> elements inside a closed <select>.
    const actualValues = await signupPage.provinceSelect.evaluate(
      (el: HTMLSelectElement) => Array.from(el.options).map(o => o.value),
    );

    for (const { code } of PROVINCES) {
      expect.soft(
        actualValues.includes(code),
        `province code "${code}" not found in province select`,
      ).toBe(true);
    }
  });

  // ── TC-L-10 ──────────────────────────────────────────────────────────────
  test('TC-L-10 document title matches expected value', async ({ signupPage, strings }) => {
    const title = await signupPage.getTitle();
    expect(title).toBe(strings.pageTitle);
  });

  test.describe('French locale label checks', () => {
    test.use({ appLocale: 'fr' });

    // ── TC-L-11 ────────────────────────────────────────────────────────────
    test('TC-L-11 all French field labels are visible on the FR page', async ({ signupPage }) => {
      await signupPage.expectAllFieldsAndLabelsVisible();
    });

    // ── TC-L-12 ────────────────────────────────────────────────────────────
    test('TC-L-12 French submit button has correct label', async ({ signupPage, strings }) => {
      await expect(signupPage.submitButton).toBeVisible();
      await expect(signupPage.submitButton).toHaveText(strings.submitButton);
    });
  });

  // ── TC-L-13 ──────────────────────────────────────────────────────────────
  test('TC-L-13 consent checkbox and text are visible', async ({ signupPage, strings, page }) => {
    await expect(signupPage.consentCheckbox).toBeVisible();
    await expect(page.getByText(strings.consentText, { exact: false })).toBeVisible();
  });

  // ── TC-L-14 ──────────────────────────────────────────────────────────────
  test('TC-L-14 province placeholder option exists with correct text and is disabled', async ({
    signupPage, strings,
  }) => {
    // DOM: <option disabled="" value="" selected="">Province of purchase</option>
    // The placeholder has value="" and disabled="" — correct: user cannot re-select it
    const placeholder = signupPage.provinceSelect.locator('option[value=""]');
    await expect(placeholder).toHaveText(strings.labels.province);
    await expect(placeholder).toHaveAttribute('disabled', '');
  });

  // ── TC-L-17 ──────────────────────────────────────────────────────────────
  test('TC-L-17 province select shows only the placeholder on page load [BUG-04]', async ({
    signupPage,
  }) => {
    // BUG-04 is still open: after the page finishes its geolocation-driven
    // initialization, the province select flips from the placeholder to `BC`
    // without any user interaction. Keep this as an expected failure until the
    // app preserves the empty placeholder state.
    test.fail();
    await expect(signupPage.provinceSelect).toHaveValue('');
  });

  // ── TC-L-15 ──────────────────────────────────────────────────────────────
  test('TC-L-15 nesto logo is displayed in the header', async ({ page }) => {
    const logo = page.getByRole('img', { name: 'nesto', exact: true });
    await expect(logo).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-L-16 ──────────────────────────────────────────────────────────────
  test('TC-L-16 nesto secure badge is displayed on the signup form', async ({ page }) => {
    const badge = page.getByRole('img', { name: 'nesto secure' });
    await expect(badge).toBeVisible();
  });

});
