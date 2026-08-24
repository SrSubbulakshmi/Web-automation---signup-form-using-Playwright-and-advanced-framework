import { test, expect } from '../src/fixtures/signup.fixture';
import type { SignupPage } from '../src/pages/SignupPage';
import { type SignupFormData, PROVINCES } from '../src/types';
import { Passwords } from '../src/utils/passwordHelper';

test.describe('Signup – Positive Tests', () => {
  const withOverrides = (
    testData: SignupFormData,
    overrides: Partial<SignupFormData>,
  ): SignupFormData => ({
    ...testData,
    ...overrides,
  });

  const submitAndExpectSuccess = async (
    signupPage: SignupPage,
    data: SignupFormData,
  ): Promise<void> => {
    await test.step('Submit and verify success', async () => {
      const response = await signupPage.fillSubmitAndWaitForApiResponse(data);
      expect(response.ok()).toBe(true);
    });
  };

  test.beforeEach(async ({ signupPage }) => {
    await signupPage.goto();
  });

  // ── TC-P-01 ──────────────────────────────────────────────────────────────
  test('TC-P-01 @smoke successful signup with all valid fields', async ({
    signupPage,
    testData,
  }) => {
    await submitAndExpectSuccess(signupPage, testData);
  });

  // ── TC-P-02 ──────────────────────────────────────────────────────────────
  test('TC-P-02 @smoke signup succeeds with consent checkbox unchecked', async ({
    signupPage,
    testData,
  }) => {
    const data = withOverrides(testData, { consentChecked: false });

    await submitAndExpectSuccess(signupPage, data);
  });

  // ── TC-P-03 ──────────────────────────────────────────────────────────────
  test('TC-P-03 signup succeeds with consent checkbox checked', async ({
    signupPage,
    testData,
  }) => {
    const data = withOverrides(testData, { consentChecked: true });

    await submitAndExpectSuccess(signupPage, data);
  });

  // ── TC-P-04 ──────────────────────────────────────────────────────────────
  test('TC-P-04 signup succeeds with minimum-length password (12 chars)', async ({
    signupPage,
    testData,
  }) => {
    const data = withOverrides(testData, {
      password: Passwords.minLength,
      confirmPassword: Passwords.minLength,
    });

    await submitAndExpectSuccess(signupPage, data);
  });

  // ── TC-P-05 ──────────────────────────────────────────────────────────────
  test('TC-P-05 signup succeeds with maximum-length password (32 chars)', async ({
    signupPage,
    testData,
  }) => {
    const data = withOverrides(testData, {
      password: Passwords.maxLength,
      confirmPassword: Passwords.maxLength,
    });

    await submitAndExpectSuccess(signupPage, data);
  });

  // ── TC-P-06 ──────────────────────────────────────────────────────────────
  test('TC-P-06 signup succeeds with non-Canadian phone country (US)', async ({
    signupPage,
    testData,
  }) => {
    const data = withOverrides(testData, { phoneCountry: 'US', phone: '2025550147' });

    await submitAndExpectSuccess(signupPage, data);
  });

  // ── TC-P-07 ──────────────────────────────────────────────────────────────
  for (const { code, name } of PROVINCES) {
    test(`TC-P-07 signup succeeds with province: ${name} (${code})`, async ({
      signupPage,
      testData,
    }) => {
      const data = withOverrides(testData, { province: code });

      await submitAndExpectSuccess(signupPage, data);
    });
  }

  // ── TC-P-08 ──────────────────────────────────────────────────────────────
  test('TC-P-08 signup succeeds with accented characters in name fields', async ({
    signupPage,
    testData,
  }) => {
    const data = withOverrides(testData, {
      firstName: 'Élodie',
      lastName: 'Désirée-Ñoño',
    });

    await submitAndExpectSuccess(signupPage, data);
  });
});
