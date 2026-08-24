import * as dotenv from 'dotenv';

type DeploymentEnv = 'qa' | 'dev' | 'staging';
const allowedTargetEnvs: DeploymentEnv[] = ['qa', 'dev', 'staging'];

// Load `.env` first for shared defaults, then overlay `.env.<env>` for
// environment-specific values such as QA/DEV/STAGING URLs or test accounts.
dotenv.config();

const rawTargetEnv = (process.env.TEST_ENV ?? 'qa').toLowerCase();

if (!allowedTargetEnvs.includes(rawTargetEnv as DeploymentEnv)) {
  throw new Error(`Invalid TEST_ENV="${rawTargetEnv}". Use one of: qa, dev, staging.`);
}

export const TARGET_ENV = rawTargetEnv as DeploymentEnv;

dotenv.config({ path: `.env.${TARGET_ENV}`, override: true });

function fromEnv(key: string): string | undefined {
  return process.env[key];
}

function fromEnvOrDefault(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const APP_LOCALE = (process.env.LOCALE ?? 'en') as 'en' | 'fr';

export const BASE_URL = fromEnvOrDefault('BASE_URL', 'https://app.qa.nesto.ca');

export const TEST_EMAIL_PREFIX = fromEnvOrDefault('TEST_EMAIL_PREFIX', 'nesto.qa.test');
export const TEST_EMAIL_DOMAIN = fromEnvOrDefault('TEST_EMAIL_DOMAIN', 'mailinator.com');

export const TEST_FIRST_NAME = fromEnv('TEST_FIRST_NAME');
export const TEST_LAST_NAME = fromEnv('TEST_LAST_NAME');
export const TEST_COUNTRY_CODE = fromEnvOrDefault('TEST_COUNTRY_CODE', 'CA');
export const TEST_PHONE = fromEnv('TEST_PHONE');
export const TEST_PROVINCE = fromEnv('TEST_PROVINCE');

export const TEST_PASSWORD = fromEnv('TEST_PASSWORD');
export const TEST_EXISTING_EMAIL = fromEnvOrDefault('TEST_EXISTING_EMAIL', 'nesto.qa.test+existing@mailinator.com');

function isValidUrl(value: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function validateEnv(): void {
  const issues: string[] = [];

  if (!['en', 'fr'].includes(APP_LOCALE)) {
    issues.push(`LOCALE must be "en" or "fr" (received: "${APP_LOCALE}")`);
  }

  if (!BASE_URL.trim()) {
    issues.push('BASE_URL is required');
  } else if (!isValidUrl(BASE_URL)) {
    issues.push(`BASE_URL must be a valid URL (received: "${BASE_URL}")`);
  }

  if (!TEST_EMAIL_PREFIX.trim()) {
    issues.push('TEST_EMAIL_PREFIX is required');
  }

  if (!TEST_EMAIL_DOMAIN.trim()) {
    issues.push('TEST_EMAIL_DOMAIN is required');
  } else if (!TEST_EMAIL_DOMAIN.includes('.')) {
    issues.push(`TEST_EMAIL_DOMAIN should look like a domain (received: "${TEST_EMAIL_DOMAIN}")`);
  }

  if (!TEST_COUNTRY_CODE.trim()) {
    issues.push('TEST_COUNTRY_CODE is required');
  }

  if (issues.length > 0) {
    throw new Error(
      [
        `Invalid environment configuration for TEST_ENV="${TARGET_ENV}".`,
        ...issues.map((issue) => `- ${issue}`),
        'Fix values in .env and/or .env.<env> (for example: .env.qa, .env.dev, .env.staging).',
      ].join('\n'),
    );
  }
}

validateEnv();

