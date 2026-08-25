import type { LocaleStrings } from '../../types';

export const en: LocaleStrings = {
  pageTitle: 'nesto | Signup',
  heading: 'Create a nesto account',
  languageSwitcher: 'FR',
  signupPath: '/signup',
  labels: {
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone number',
    province: 'Province of purchase',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
  },
  placeholders: {
    firstName: 'First name',
    lastName: 'Last name',
    phone: 'Phone number',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
  },
  validationErrors: {
    tooManyCharacters: 'Too many characters',
  },
  passwordHint:
    'Password must be between 12 and 32 characters and contain one uppercase letter, one lowercase letter and one number.',
  submitButton: 'Create your account',
  loginPrompt: 'Already have an account?',
  loginLink: 'Log in',
  consentText: 'By checking this box',
  termsLinkText: 'Terms of Service',
  privacyLinkText: 'Privacy Policy',
  termsUrl: 'https://www.nesto.ca/terms-of-services/',
  privacyUrl: 'https://www.nesto.ca/privacy-policy/',
};
