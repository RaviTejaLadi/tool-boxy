export const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export type OutputFormat = 'plain' | 'html';

export const PARAGRAPH_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: 'plain', label: 'Plain text' },
  { value: 'html', label: 'HTML (with <p>)' },
];

export const DEFAULT_PARAGRAPH_COUNT = 3;
export const DEFAULT_FORMAT: OutputFormat = 'plain';
