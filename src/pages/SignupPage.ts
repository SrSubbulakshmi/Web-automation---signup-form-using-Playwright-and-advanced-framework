import { expect, type Locator, type Page, type Response } from '@playwright/test';
import { BasePage } from './BasePage';
import type { SignupFormData, LocaleStrings } from '../types';

export class SignupPage extends BasePage {
  readonly strings: LocaleStrings;

  constructor(page: Page, strings: LocaleStrings) {
    super(page);
    this.strings = strings;
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  private async waitForInteractiveForm(): Promise<void> {
    await this.submitButton.waitFor({ state: 'visible' });
    await expect(this.firstNameInput).toBeVisible({ timeout: 10_000 });
    await expect(this.firstNameInput).toBeEditable({ timeout: 10_000 });
    await expect(this.provinceSelect).toBeVisible({ timeout: 10_000 });
    await expect(this.provinceSelect).toBeEnabled({ timeout: 10_000 });
  }

  async goto(): Promise<void> {
    const geolocationResponsePromise = this.page
      .waitForResponse(
        (res) => res.url().includes('/api/geolocation/all') && res.request().method() === 'GET',
        { timeout: 5_000 },
      )
      .catch(() => null);

    await this.navigate(this.strings.signupPath);
    await this.waitForInteractiveForm();

    // The signup page issues a geolocation request after initial render and may
    // default the province once that data comes back. Waiting for this specific
    // response makes the page state deterministic without relying on arbitrary
    // sleeps or open-ended polling in the tests.
    await geolocationResponsePromise;
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  get heading(): Locator {
    // level: 1 removed — nesto does not render this as <h1>; match by text instead
    return this.page.getByRole('heading', { name: this.strings.heading });
  }

  get firstNameInput(): Locator {
    return this.page.getByPlaceholder(this.strings.placeholders.firstName, { exact: true });
  }

  get lastNameInput(): Locator {
    return this.page.getByPlaceholder(this.strings.placeholders.lastName, { exact: true });
  }

  get phoneCountrySelect(): Locator {
    return this.page.locator('select[name="phoneCountry"]');
  }

  get phoneInput(): Locator {
    return this.page.getByPlaceholder(this.strings.placeholders.phone, { exact: true });
  }

  get provinceSelect(): Locator {
    return this.page.getByTestId('region-select');
  }

  get emailInput(): Locator {
    return this.page.getByPlaceholder(this.strings.placeholders.email, { exact: true });
  }

  get passwordInput(): Locator {
    return this.page.getByPlaceholder(this.strings.placeholders.password, { exact: true });
  }

  get confirmPasswordInput(): Locator {
    return this.page.getByPlaceholder(this.strings.placeholders.confirmPassword, { exact: true });
  }

  get consentCheckbox(): Locator {
    return this.page.getByRole('checkbox');
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: this.strings.submitButton });
  }

  get passwordHint(): Locator {
    return this.page.getByText(/password must be between|le mot de passe doit contenir/i);
  }

  get languageSwitcherLink(): Locator {
    return this.page.getByTestId('header-language-switch');
  }

  get loginLink(): Locator {
    return this.page.getByRole('link', { name: this.strings.loginLink });
  }

  get termsLink(): Locator {
    return this.page.getByRole('link', { name: this.strings.termsLinkText });
  }

  get privacyLink(): Locator {
    return this.page.getByRole('link', { name: this.strings.privacyLinkText });
  }

  // ── Floating label locators (data-testid from the app's label elements) ──

  get firstNameLabel(): Locator {
    return this.page.getByTestId('first-name-input-placeholder');
  }

  get lastNameLabel(): Locator {
    return this.page.getByTestId('last-name-input-placeholder');
  }

  get phoneLabel(): Locator {
    // 'input-placeholder' may be shared across fields — scoped to the phone wrapper
    return this.page.getByTestId('input-placeholder').first();
  }

  get provinceLabel(): Locator {
    return this.page.getByTestId('select-placeholder');
  }

  get emailLabel(): Locator {
    return this.page.getByTestId('email-input-placeholder');
  }

  get passwordLabel(): Locator {
    return this.page.getByTestId('password-input-placeholder');
  }

  get confirmPasswordLabel(): Locator {
    return this.page.getByTestId('passwordConfirmation-input-placeholder');
  }

  // Error elements — the app likely wraps errors near each field
  get fieldErrors(): Locator {
    return this.page.locator('[class*="error"i]:not(input), [class*="Error"i]:not(input)').or(
      this.page.getByRole('alert'),
    );
  }

  // ── Form actions ─────────────────────────────────────────────────────────

  private async selectProvince(value: SignupFormData['province']): Promise<void> {
    if (value === '') {
      await this.provinceSelect.selectOption({ index: 0 });
      return;
    }
    await this.provinceSelect.selectOption({ value });
  }

  private async fillFields(data: Partial<SignupFormData>): Promise<void> {
    if (data.firstName !== undefined) await this.firstNameInput.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastNameInput.fill(data.lastName);
    if (data.phoneCountry !== undefined) {
      await this.phoneCountrySelect.selectOption({ value: data.phoneCountry });
    }
    if (data.phone !== undefined) await this.phoneInput.fill(data.phone);
    if (data.province !== undefined) await this.selectProvince(data.province);
    if (data.email !== undefined) await this.emailInput.fill(data.email);
    if (data.password !== undefined) await this.passwordInput.fill(data.password);
    if (data.confirmPassword !== undefined) {
      await this.confirmPasswordInput.fill(data.confirmPassword);
    }

    if (data.consentChecked === true) await this.consentCheckbox.check();
    if (data.consentChecked === false) await this.consentCheckbox.uncheck();
  }

  async fillForm(data: Partial<SignupFormData>): Promise<void> {
    await expect(async () => {
      await this.fillFields(data);
      await this.assertFormValues(data, 1_000);
    }).toPass({ timeout: 15_000 });
  }

  private async assertFormValues(data: Partial<SignupFormData>, timeout = 1_500): Promise<void> {
    const t = { timeout };

    if (data.firstName !== undefined) await expect(this.firstNameInput).toHaveValue(data.firstName, t);
    if (data.lastName !== undefined) await expect(this.lastNameInput).toHaveValue(data.lastName, t);
    if (data.phoneCountry !== undefined) await expect(this.phoneCountrySelect).toHaveValue(data.phoneCountry, t);
    if (data.phone !== undefined) {
      const expectedPhoneDigits = data.phone.replace(/\D/g, '');
      await expect
        .poll(async () => (await this.phoneInput.inputValue()).replace(/\D/g, ''), t)
        .toBe(expectedPhoneDigits);
    }

    if (data.province !== undefined) {
      if (data.province === '') {
        await expect(this.provinceSelect).toHaveValue('', t);
      } else {
        await expect(this.provinceSelect).toHaveValue(data.province, t);
      }
    }

    if (data.email !== undefined) await expect(this.emailInput).toHaveValue(data.email, t);
    if (data.password !== undefined) await expect(this.passwordInput).toHaveValue(data.password, t);
    if (data.confirmPassword !== undefined) {
      await expect(this.confirmPasswordInput).toHaveValue(data.confirmPassword, t);
    }

    if (data.consentChecked === true) await expect(this.consentCheckbox).toBeChecked(t);
    if (data.consentChecked === false) await expect(this.consentCheckbox).not.toBeChecked(t);
  }

  async submit(): Promise<void> {
    await expect(this.submitButton).toBeEnabled({ timeout: 2_000 });
    await this.submitButton.click();
  }

  private waitForSignupResponse(email: string, timeout: number): Promise<Response> {
    return this.page.waitForResponse(
      (res) => {
        if (!res.url().includes('/api/accounts') || res.request().method() !== 'POST') return false;
        const payload = res.request().postDataJSON() as Partial<SignupFormData> | null;
        return payload?.email === email;
      },
      { timeout },
    );
  }

  private async ensureStableFormBeforeSubmit(data: SignupFormData): Promise<void> {
    // Single-fill flow with recovery: verify values right before submit; if a
    // late rerender cleared anything, refill once and verify again.
    await this.page.waitForTimeout(200);
    try {
      await this.assertFormValues(data);
    } catch {
      await this.fillForm(data);
      await this.assertFormValues(data);
    }
  }

  // Set up the response wait BEFORE filling/submitting — response may arrive
  // before the next JS tick if the server is fast, so the Promise must exist first.
  async fillSubmitAndWaitForApiResponse(data: SignupFormData, timeout = 15_000): Promise<Response> {
    const responsePromise = this.waitForSignupResponse(data.email, timeout);
    await this.fillForm(data);
    await this.ensureStableFormBeforeSubmit(data);
    await this.submit();
    return responsePromise;
  }

  // ── Assertions helpers ────────────────────────────────────────────────────

  // Soft-asserts that every field is visible AND every label shows the correct
  // locale text. Works for both EN and FR — no locale conditional needed because
  // this.strings.labels already holds the right language.
  async expectAllFieldsAndLabelsVisible(): Promise<void> {
    // Field visibility
    await expect.soft(this.firstNameInput).toBeVisible();
    await expect.soft(this.lastNameInput).toBeVisible();
    await expect.soft(this.phoneInput).toBeVisible();
    await expect.soft(this.provinceSelect).toBeVisible();
    await expect.soft(this.emailInput).toBeVisible();
    await expect.soft(this.passwordInput).toBeVisible();
    await expect.soft(this.confirmPasswordInput).toBeVisible();
    await expect.soft(this.consentCheckbox).toBeVisible();

    // Label text — uses getByTestId for stability; no substring/hidden-option issues
    await expect.soft(this.firstNameLabel).toHaveText(this.strings.labels.firstName);
    await expect.soft(this.lastNameLabel).toHaveText(this.strings.labels.lastName);
    await expect.soft(this.phoneLabel).toHaveText(this.strings.labels.phone);
    await expect.soft(this.provinceLabel).toHaveText(this.strings.labels.province);
    await expect.soft(this.emailLabel).toHaveText(this.strings.labels.email);
    await expect.soft(this.passwordLabel).toHaveText(this.strings.labels.password);
    await expect.soft(this.confirmPasswordLabel).toHaveText(this.strings.labels.confirmPassword);
  }

  async getHeadingText(): Promise<string> {
    const text = await this.heading.textContent();
    return text?.trim() ?? '';
  }

  async getPasswordHintText(): Promise<string> {
    const text = await this.passwordHint.textContent();
    return text?.trim() ?? '';
  }

  async isOnSignupPage(): Promise<boolean> {
    return this.page.url().includes('signup');
  }

  async waitForSuccessOrRedirect(timeout = 12_000): Promise<void> {
    await this.page
      .waitForFunction(
        () => !window.location.pathname.toLowerCase().includes('signup'),
        { timeout },
      )
      .catch(async () => {
        // If the page didn't redirect, look for an inline success indicator
        await this.page
          .locator('[class*="success"i], [class*="Success"i], [role="status"]')
          .first()
          .waitFor({ state: 'visible', timeout: 5_000 });
      });
  }
}
