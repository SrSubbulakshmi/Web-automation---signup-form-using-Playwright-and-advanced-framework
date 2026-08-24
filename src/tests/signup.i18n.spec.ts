import { test, expect } from '../src/fixtures/signup.fixture';

test.describe('Signup – Internationalisation (EN / FR)', () => {
  test.describe('EN locale flows', () => {
    test.use({ appLocale: 'en' });

    test.beforeEach(async ({ signupPage }) => {
      await signupPage.goto();
    });

    // ── TC-I-01 ────────────────────────────────────────────────────────────
    test('TC-I-01 @smoke English signup page URL contains /signup', async ({ signupPage }) => {
      const url = await signupPage.getUrl();
      expect(url).toMatch(/\/signup/);
      await expect(signupPage.heading).toBeVisible();
    });

    // ── TC-I-02 ────────────────────────────────────────────────────────────
    test('TC-I-02 @smoke language switcher on EN page navigates to /fr/signup', async ({
      signupPage,
      page,
    }) => {
      await expect(signupPage.languageSwitcherLink).toBeVisible();
      await signupPage.languageSwitcherLink.click();
      await expect(page).toHaveURL(/\/fr\/signup/, { timeout: 10_000 });
    });
  });

  test.describe('FR locale flows', () => {
    test.use({ appLocale: 'fr' });

    test.beforeEach(async ({ signupPage }) => {
      await signupPage.goto();
    });

    // ── TC-I-01b ───────────────────────────────────────────────────────────
    test('TC-I-01b @smoke French signup page URL contains /fr/signup', async ({ signupPage }) => {
      const url = await signupPage.getUrl();
      expect(url).toMatch(/\/fr\/signup/);
      await expect(signupPage.heading).toBeVisible();
    });

    // ── TC-I-03 ────────────────────────────────────────────────────────────
    test('TC-I-03 language switcher on FR page navigates back to /signup', async ({
      signupPage,
      page,
    }) => {
      await expect(signupPage.languageSwitcherLink).toBeVisible();
      await signupPage.languageSwitcherLink.click();
      await expect(page).toHaveURL(/\/signup/, { timeout: 10_000 });
      await expect(page).not.toHaveURL(/\/fr\/signup/);
    });

    // ── TC-I-04 ────────────────────────────────────────────────────────────
    test('TC-I-04 @smoke French page heading is correct', async ({ signupPage, strings }) => {
      await expect(signupPage.heading).toBeVisible();
      await expect(signupPage.heading).toHaveText(strings.heading);
    });

    // ── TC-I-05 ────────────────────────────────────────────────────────────
    test('TC-I-05 @smoke all French field labels are translated', async ({ signupPage }) => {
      await signupPage.expectAllFieldsAndLabelsVisible();
    });

    // ── TC-I-06 ────────────────────────────────────────────────────────────
    test('TC-I-06 French submit button has the correct French label', async ({ signupPage, strings }) => {
      await expect(signupPage.submitButton).toBeVisible();
      await expect(signupPage.submitButton).toHaveText(strings.submitButton);
    });

    // ── TC-I-07 ────────────────────────────────────────────────────────────
    test('TC-I-07 form submission works in French locale', async ({ signupPage, testData }) => {
      const response = await signupPage.fillSubmitAndWaitForApiResponse(testData);
      expect(response.ok()).toBeTruthy();
    });

    // ── TC-I-08 ────────────────────────────────────────────────────────────
    test('TC-I-08 French page document title is correct', async ({ signupPage, strings }) => {
      const title = await signupPage.getTitle();
      expect(title).toBe(strings.pageTitle);
    });

    // ── TC-I-09 ────────────────────────────────────────────────────────────
    test('TC-I-09 validation error messages appear in French on the FR page', async ({ signupPage }) => {
      await signupPage.submit();
      expect(await signupPage.isOnSignupPage()).toBe(true);
      await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
    });

    // ── TC-I-11 ────────────────────────────────────────────────────────────
    test('TC-I-11 French password hint text is visible and contains key values', async ({ signupPage }) => {
      await expect(signupPage.passwordHint).toBeVisible();
      const hintText = await signupPage.getPasswordHintText();
      expect(hintText).toMatch(/12/);
      expect(hintText).toMatch(/32/);
      expect(hintText).toMatch(/chiffre/i);
    });
  });

  // ── TC-I-10 ──────────────────────────────────────────────────────────────
  test('TC-I-10 English and French pages do not share the same page title', async ({ page }) => {
    await page.goto('/signup');
    const enTitle = await page.title();

    await page.goto('/fr/signup');
    const frTitle = await page.title();

    expect(enTitle).toBeTruthy();
    expect(frTitle).toBeTruthy();
    expect(enTitle).not.toBe(frTitle);
  });
});
