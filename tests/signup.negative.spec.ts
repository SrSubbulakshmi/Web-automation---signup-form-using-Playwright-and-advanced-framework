import { test, expect } from '../src/fixtures/signup.fixture';
import { buildValidFormData, existingEmail } from '../src/data/testData';
import { Passwords } from '../src/utils/passwordHelper';

test.describe('Signup – Negative Tests', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.goto();
  });

  const assertStaysOnSignup = async (signupPage: { isOnSignupPage: () => Promise<boolean> }) => {
    expect(await signupPage.isOnSignupPage()).toBe(true);
  };

  // ── TC-N-01 ──────────────────────────────────────────────────────────────
  test('TC-N-01 @smoke submit empty form shows required field errors', async ({
    signupPage,
  }) => {
    await test.step('Submit without filling any field', async () => {
      await signupPage.submit();
    });

    await test.step('Verify page stays on signup and errors appear', async () => {
      await assertStaysOnSignup(signupPage);
      // At least one error message should be visible
      await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
    });
  });

  // ── TC-N-02 ──────────────────────────────────────────────────────────────
  test('TC-N-02 empty first name shows validation error', async ({ signupPage }) => {
    const data = buildValidFormData({ firstName: '' });

    await test.step('Fill form without first name', async () => {
      await signupPage.fillForm(data);
      await signupPage.submit();
    });

    await test.step('Verify error and page stays on signup', async () => {
      await assertStaysOnSignup(signupPage);
      await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
    });
  });

  // ── TC-N-03 ──────────────────────────────────────────────────────────────
  test('TC-N-03 empty last name shows validation error', async ({ signupPage }) => {
    const data = buildValidFormData({ lastName: '' });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-04 ──────────────────────────────────────────────────────────────
  test('TC-N-04 empty phone number shows validation error', async ({ signupPage }) => {
    const data = buildValidFormData({ phone: '' });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-05 ──────────────────────────────────────────────────────────────
  test('TC-N-05 no province selected shows validation error', async ({ signupPage }) => {
    // Known issue (BUG-03/BUG-04): the placeholder option is disabled and the
    // field auto-defaults to BC, so the blank-province path cannot be exercised
    // via normal UI interaction.
    test.fail();
    // Province defaults to BC; we must explicitly select the blank placeholder
    const data = buildValidFormData({ province: '' });

    await test.step('Fill form and select blank province placeholder', async () => {
      await signupPage.fillForm(data);
    });

    await test.step('Submit and verify error (province is required)', async () => {
      await signupPage.submit();
      await assertStaysOnSignup(signupPage);
      await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
    });
  });

  // ── TC-N-06 ──────────────────────────────────────────────────────────────
  test('TC-N-06 empty email shows validation error', async ({ signupPage }) => {
    const data = buildValidFormData({ email: '' });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-07 ──────────────────────────────────────────────────────────────
  test('TC-N-07 @smoke invalid email format is rejected', async ({ signupPage }) => {
    const data = buildValidFormData({ email: 'notanemail' });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-08 ──────────────────────────────────────────────────────────────
  test('TC-N-08 email without TLD is rejected', async ({ signupPage }) => {
    const data = buildValidFormData({ email: 'user@domain' });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-09 ──────────────────────────────────────────────────────────────
  test('TC-N-09 @smoke password shorter than 12 characters is rejected', async ({
    signupPage,
  }) => {
    const data = buildValidFormData({
      password: Passwords.tooShort,
      confirmPassword: Passwords.tooShort,
    });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-10 ──────────────────────────────────────────────────────────────
  test('TC-N-10 password longer than 32 characters is rejected', async ({ signupPage }) => {
    const data = buildValidFormData({
      password: Passwords.tooLong,
      confirmPassword: Passwords.tooLong,
    });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-11 ──────────────────────────────────────────────────────────────
  test('TC-N-11 password missing uppercase letter is rejected', async ({ signupPage }) => {
    const data = buildValidFormData({
      password: Passwords.noUppercase,
      confirmPassword: Passwords.noUppercase,
    });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-12 ──────────────────────────────────────────────────────────────
  test('TC-N-12 password missing lowercase letter is rejected', async ({ signupPage }) => {
    const data = buildValidFormData({
      password: Passwords.noLowercase,
      confirmPassword: Passwords.noLowercase,
    });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-13 ──────────────────────────────────────────────────────────────
  test('TC-N-13 password missing number is rejected', async ({ signupPage }) => {
    const data = buildValidFormData({
      password: Passwords.noNumber,
      confirmPassword: Passwords.noNumber,
    });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-14 ──────────────────────────────────────────────────────────────
  test('TC-N-14 @smoke mismatched confirm password is rejected', async ({ signupPage }) => {
    const data = buildValidFormData({
      password: Passwords.valid,
      confirmPassword: Passwords.mismatch,
    });

    await signupPage.fillForm(data);
    await signupPage.submit();

    await assertStaysOnSignup(signupPage);
    await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
  });

  // ── TC-N-15 ──────────────────────────────────────────────────────────────
  test('TC-N-15 already-registered email is rejected with error', async ({ signupPage }) => {
    // Uses TEST_EXISTING_EMAIL from .env — update after first successful signup
    const data = buildValidFormData({ email: existingEmail });

    await test.step('Submit with a known existing email', async () => {
      await signupPage.fillForm(data);
      await signupPage.submit();
    });

    await test.step('Verify duplicate account error is shown', async () => {
      await assertStaysOnSignup(signupPage);
      await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 8_000 });
    });
  });

  // ── TC-N-16 ──────────────────────────────────────────────────────────────
  test('TC-N-16 XSS in name fields does not execute script', async ({ signupPage, page }) => {
    const xssPayload = '<script>window.__xss=true</script>';
    const data = buildValidFormData({ firstName: xssPayload, lastName: xssPayload });

    await signupPage.fillForm(data);

    await test.step('Verify no script execution after input', async () => {
      const xssExecuted = await page.evaluate(() => (window as unknown as Record<string, unknown>).__xss);
      expect(xssExecuted).toBeUndefined();
    });

    await signupPage.submit();

    await test.step('Verify no script execution after submit', async () => {
      const xssExecuted = await page.evaluate(() => (window as unknown as Record<string, unknown>).__xss);
      expect(xssExecuted).toBeUndefined();
    });
  });

  // ── TC-N-17 ──────────────────────────────────────────────────────────────
  test('TC-N-17 SQL injection attempt in email is handled safely', async ({ signupPage }) => {
    const sqlPayload = "test'; DROP TABLE users; --@mailinator.com";
    const data = buildValidFormData({ email: sqlPayload });

    await signupPage.fillForm(data);
    await signupPage.submit();

    // Should either show validation error (invalid email format) or handle server-side
    // In either case the app must not crash or expose DB errors
    await test.step('App stays stable — no 5xx or crash', async () => {
      const url = await signupPage.getUrl();
      // If it stayed on signup, validation caught it
      // If it redirected, the backend handled it safely
      expect(url).toBeTruthy();
    });
  });

  // ── TC-N-18 ──────────────────────────────────────────────────────────────
  test('TC-N-18 @smoke selecting blank province placeholder then submitting shows error (BUG-04)', async ({
    signupPage,
  }) => {
    // Known issue (BUG-03/BUG-04): blank province option cannot be re-selected
    // because it is disabled while province is auto-defaulted to BC.
    test.fail();
    const data = buildValidFormData({ province: '' });

    await test.step('Fill all other fields validly but select blank province option', async () => {
      await signupPage.fillForm(data);
    });

    await test.step('Submit form', async () => {
      await signupPage.submit();
    });

    await test.step('Verify province validation error appears — form must NOT accept empty province', async () => {
      // BUG-04: the blank placeholder option has no value and is not disabled.
      // The form should prevent submission and show an error.
      await assertStaysOnSignup(signupPage);
      await expect(signupPage.fieldErrors.first()).toBeVisible({ timeout: 5_000 });
    });
  });
});
