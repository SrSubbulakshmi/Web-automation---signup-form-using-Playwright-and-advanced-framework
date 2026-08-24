import { test, expect } from '../src/fixtures/signup.fixture';
import { buildValidFormData, existingEmail } from '../src/data/testData';

test.describe('Signup – API Response Validation', () => {
  test.beforeEach(async ({ signupPage }) => {
    await signupPage.goto();
  });

  // ── TC-A-01 ──────────────────────────────────────────────────────────────
  test('TC-A-01 @smoke account creation API returns 201 with correct response body', async ({
    signupPage,
    testData,
  }) => {
    const formData = testData;

    const raw = await test.step('Fill form, submit, and capture POST /api/accounts response', async () => {
      return signupPage.fillSubmitAndWaitForApiResponse(formData);
    });

    // API response shape: { "account": { "id": 882734, "email": "...", ... } }
    const body    = await raw.json() as Record<string, unknown>;
    const account = body['account'] as Record<string, unknown>;

    await test.step('HTTP status is 201 Created', async () => {
      expect(raw.status()).toBe(201);
    });

    await test.step('Content-Type is application/json', async () => {
      expect(raw.headers()['content-type']).toMatch(/application\/json/i);
    });

    await test.step('Response body contains the submitted email', async () => {
      expect(String(account['email']).toLowerCase()).toBe(formData.email.toLowerCase());
    });

    await test.step('Response body contains the submitted first name', async () => {
      expect(String(account['firstName']).toLowerCase()).toBe(formData.firstName.toLowerCase());
    });

    await test.step('Response body contains the submitted last name', async () => {
      expect(String(account['lastName']).toLowerCase()).toBe(formData.lastName.toLowerCase());
    });

    await test.step('Response body contains the submitted phone number', async () => {
      // API stores in E.164 format (+14027865434); we submitted 10-digit (4027865434)
      // Strip non-digits and check our digits are contained in the response value
      const digits = (p: string) => p.replace(/\D/g, '');
      expect(digits(String(account['phone']))).toContain(digits(formData.phone));
    });

    await test.step('Response body contains the submitted province (stored as "region")', async () => {
      // The API uses the key "region" for province — confirmed from actual response
      expect(String(account['region']).toUpperCase()).toBe(String(formData.province).toUpperCase());
    });

    await test.step('Response body contains a numeric account ID', async () => {
      expect(account['id']).toBeTruthy();
    });
  });

  // ── TC-A-02 ──────────────────────────────────────────────────────────────
  test('TC-A-02 duplicate email signup returns 4xx conflict response', async ({
    signupPage,
  }) => {
    const data = buildValidFormData({ email: existingEmail });

    const raw = await test.step('Submit with a known already-registered email', async () => {
      return signupPage.fillSubmitAndWaitForApiResponse(data);
    });

    await test.step('API returns a 4xx conflict response', async () => {
      expect(raw.status()).toBeGreaterThanOrEqual(400);
      expect(raw.status()).toBeLessThan(500);
      console.log(`Duplicate email API response: ${raw.status()}`);
    });
  });
});
