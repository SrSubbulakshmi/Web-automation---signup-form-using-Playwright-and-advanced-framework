export type Locale = 'en' | 'fr';

export type Province =
  | 'ON'
  | 'QC'
  | 'AB'
  | 'BC'
  | 'MB'
  | 'NB'
  | 'NS'
  | 'NL'
  | 'PE'
  | 'SK'
  | 'NT'
  | 'YT'
  | 'NU';

export interface SignupFormData {
  firstName: string;
  lastName: string;
  phoneCountry?: string;
  phone: string;
  province: Province | '';
  email: string;
  password: string;
  confirmPassword: string;
  consentChecked?: boolean;
}

export interface LocaleStrings {
  pageTitle: string;
  heading: string;
  languageSwitcher: string;
  signupPath: string;
  labels: {
    firstName: string;
    lastName: string;
    phone: string;
    province: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  placeholders: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  validationErrors: {
    tooManyCharacters: string;
  };
  passwordHint: string;
  submitButton: string;
  loginPrompt: string;
  loginLink: string;
  consentText: string;
  termsLinkText: string;
  privacyLinkText: string;
  termsUrl: string;
  privacyUrl: string;
}

export const PROVINCES: Array<{ code: Province; name: string }> = [
  { code: 'ON', name: 'Ontario' },
  { code: 'QC', name: 'Quebec' },
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British-Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'YT', name: 'Yukon' },
  { code: 'NU', name: 'Nunavut' },
];
