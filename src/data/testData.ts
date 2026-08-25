import { faker } from '@faker-js/faker';
import { type SignupFormData, type Province, PROVINCES } from '../types';
import {
  TEST_COUNTRY_CODE,
  TEST_EMAIL_DOMAIN,
  TEST_EMAIL_PREFIX,
  TEST_EXISTING_EMAIL,
  TEST_FIRST_NAME,
  TEST_LAST_NAME,
  TEST_PASSWORD,
  TEST_PHONE,
  TEST_PROVINCE,
} from '../config/env';

// All active Canadian area codes (NANP — Canada-only, no US overlap)
const CANADIAN_AREA_CODES = [
  '204', '226', '249', '250', '263', '289',
  '306', '343', '354', '365', '367', '368', '382',
  '403', '416', '418', '428', '431', '437', '438', '450',
  '506', '514', '519', '548', '579', '581', '587',
  '604', '613', '639', '647', '672',
  '705', '709', '742', '778', '780', '782',
  '807', '819', '825', '867', '873', '902', '905', '942',
];

function generateCanadianPhone(): string {
  const area  = faker.helpers.arrayElement(CANADIAN_AREA_CODES);
  const local = faker.string.numeric({ length: 7 });
  return `${area}${local}`;
}

function generateValidPassword(): string {
  const upper  = faker.string.alpha({ length: 3, casing: 'upper' });
  const lower  = faker.string.alpha({ length: 3, casing: 'lower' });
  const digits = faker.string.numeric({ length: 3 });
  const extra  = faker.string.alphanumeric({ length: 4 });
  const chars  = [...upper, ...lower, ...digits, ...extra];
  return faker.helpers.shuffle(chars).join('');
}

export function buildOverlongName(length = 80): string {
  return faker.string.alpha({ length, casing: 'lower' });
}

export function buildValidFormData(overrides: Partial<SignupFormData> = {}): SignupFormData {
  // casing: 'lower' — nesto's email validator rejects uppercase in the local part
  const uniqueSuffix = `${faker.string.alphanumeric({ length: 6, casing: 'lower' })}${Date.now()}`;
  const password     = TEST_PASSWORD ?? generateValidPassword();

  return {
    firstName:      TEST_FIRST_NAME ?? faker.person.firstName(),
    lastName:       TEST_LAST_NAME ?? faker.person.lastName(),
    phoneCountry:   TEST_COUNTRY_CODE,
    phone:          TEST_PHONE ?? generateCanadianPhone(),
    province:       (TEST_PROVINCE ?? faker.helpers.arrayElement(PROVINCES).code) as Province,
    email:          `${TEST_EMAIL_PREFIX}+${uniqueSuffix}@${TEST_EMAIL_DOMAIN}`,
    password,
    confirmPassword: password,
    consentChecked: false,
    ...overrides,
  };
}

export const existingEmail = TEST_EXISTING_EMAIL;
