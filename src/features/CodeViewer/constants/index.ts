export const LANGUAGE_BY_EXT: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  tsx: 'tsx',
  json: 'json',
  html: 'markup',
  htm: 'markup',
  css: 'css',
  scss: 'scss',
  less: 'less',
  md: 'markdown',
  mdx: 'markdown',
  svg: 'markup',
  txt: 'markup',
  yml: 'yaml',
  yaml: 'yaml',
  py: 'python',
  rb: 'ruby',
  go: 'go',
  rs: 'rust',
  java: 'java',
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  hpp: 'cpp',
  php: 'php',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash',
  xml: 'markup',
  toml: 'toml',
  env: 'bash',
  vue: 'markup',
  svelte: 'markup',
  graphql: 'graphql',
  gql: 'graphql',
  dockerfile: 'docker',
  conf: 'nginx',
  ini: 'markup',
  log: 'markup',
};

export const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'bmp', 'avif']);
export const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac']);
export const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov', 'mkv', 'avi']);
export const FONT_EXTENSIONS = new Set(['woff', 'woff2', 'ttf', 'eot', 'otf']);

/** Non-previewable binaries (assets handled separately). */
export const BINARY_EXTENSIONS = new Set([
  'zip',
  'gz',
  'tar',
  '7z',
  'rar',
  'exe',
  'dll',
  'so',
  'dylib',
  'bin',
  'wasm',
  ...FONT_EXTENSIONS,
]);

export const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  '.svn',
  '.hg',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  '.turbo',
  '.cache',
  '__pycache__',
  '.venv',
  'venv',
]);

export const MAX_TEXT_BYTES = 512 * 1024;
export const MAX_ASSET_BYTES = 8 * 1024 * 1024;
export const MAX_FILES = 2000;

export const FONT_SIZE_OPTIONS = [12, 13, 14, 16, 18] as const;
export const DEFAULT_FONT_SIZE = 13;
