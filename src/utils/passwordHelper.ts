import { TEST_PASSWORD } from '../config/env';

export const Passwords = {
  valid: TEST_PASSWORD ?? 'TestPass123!@#',

  withSpecialCharacters: 'TestPass12!@#',
  // valid length and complexity; explicitly includes special characters

  minLength: 'TestPass12Ab',
  // exactly 12 chars: T-e-s-t-P-a-s-s-1-2-A-b
  // has uppercase (T, P, A), lowercase (e, s, t, a, s, s, b), number (1, 2)

  maxLength: 'TestPass123456ABCDEFGHIJKLMNOPmn',
  // exactly 32 chars: TestPass=8, 123456=6, ABCDEFGHIJKLMNOP=16, mn=2

  tooShort: 'Test1Ab',
  // 7 chars — valid complexity but too short (< 12)

  tooLong: 'TestPass1234567890ABCDEFGHIJKLMNOPm',
  // 36 chars — valid complexity but too long (> 32)

  noUppercase: 'testpassword123abc',
  // all lowercase + numbers — missing uppercase

  noLowercase: 'TESTPASSWORD123ABC',
  // all uppercase + numbers — missing lowercase

  noNumber: 'TestPassWordABCabc',
  // uppercase + lowercase — missing number

  mismatch: 'DifferentPass123!',
  // valid format but different from `valid` — for confirm password mismatch
} as const;
