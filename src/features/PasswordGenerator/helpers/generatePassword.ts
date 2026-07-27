export type PasswordOptions = {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
};

const AMBIGUOUS = '{}[]()/\\\'"`~,;:.<>il1O0';

function filterAmbiguous(chars: string) {
  return chars
    .split('')
    .filter((char) => !AMBIGUOUS.includes(char))
    .join('');
}

export function buildCharset(options: Omit<PasswordOptions, 'length'>): string {
  let lower = 'abcdefghijklmnopqrstuvwxyz';
  let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let nums = '0123456789';
  let syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (options.excludeAmbiguous) {
    lower = filterAmbiguous(lower);
    upper = filterAmbiguous(upper);
    nums = filterAmbiguous(nums);
    syms = filterAmbiguous(syms);
  }

  let charset = '';
  if (options.includeLowercase) charset += lower;
  if (options.includeUppercase) charset += upper;
  if (options.includeNumbers) charset += nums;
  if (options.includeSymbols) charset += syms;
  return charset;
}

export function generatePassword(options: PasswordOptions): string {
  const charset = buildCharset(options);
  if (charset.length === 0 || options.length < 1) return '';

  const array = new Uint32Array(options.length);
  window.crypto.getRandomValues(array);

  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }
  return password;
}
