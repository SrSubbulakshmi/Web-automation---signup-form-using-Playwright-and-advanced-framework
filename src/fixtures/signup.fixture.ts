import { test as base } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { buildValidFormData } from '../data/testData';
import { en } from '../data/locales/en';
import { fr } from '../data/locales/fr';
import { APP_LOCALE } from '../config/env';
import type { Locale, SignupFormData, LocaleStrings } from '../types';

type SignupFixtures = {
  /** App locale for test strings — defaults to 'en'. Override with test.use({ appLocale: 'fr' }). */
  appLocale: Locale;
  /** Locale strings for the current locale */
  strings: LocaleStrings;
  /** SignupPage POM bound to the current page + locale strings (navigation is explicit in tests/hooks). */
  signupPage: SignupPage;
  /** Fresh unique user data for the current test */
  testData: SignupFormData;
};

export const test = base.extend<SignupFixtures>({
  // Option fixture: supports per-test/per-describe override via test.use({ appLocale: 'fr' }).
  appLocale: [APP_LOCALE as Locale, { option: true }],

  strings: async ({ appLocale }, use) => {
    await use(appLocale === 'fr' ? fr : en);
  },

  signupPage: async ({ page, strings }, use) => {
    const signup = new SignupPage(page, strings);
    await use(signup);
  },

  testData: async ({}, use) => {
    await use(buildValidFormData());
  },
});

export { expect } from '@playwright/test';


