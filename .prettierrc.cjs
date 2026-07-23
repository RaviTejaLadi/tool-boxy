 module.exports = 
{

  // Basic formatting
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  bracketSpacing: true,
  jsxBracketSameLine: false, // Deprecated - use bracketSameLine instead
  bracketSameLine: false, // Replacement for jsxBracketSameLine
  arrowParens: 'always',
  endOfLine: 'lf',

  // Additional useful properties
  useTabs: false, // Use spaces instead of tabs
  quoteProps: 'as-needed', // Only add quotes around object properties when needed
  jsxSingleQuote: false, // Use single quotes in JSX (matches singleQuote)
  proseWrap: 'preserve', // How to wrap prose (markdown, etc.)
  htmlWhitespaceSensitivity: 'css', // How to handle whitespace in HTML
  vueIndentScriptAndStyle: false, // Don't indent <script> and <style> in Vue files
  embeddedLanguageFormatting: 'auto', // Format embedded code (like CSS in JS)
  singleAttributePerLine: false, // Whether to put each HTML/JSX attribute on its own line
  
  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
        tabWidth: 2,
      },
    },
    {
      files: '*.{md,mdx}',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
    {
      files: '*.{css,scss,less}',
      options: {
        singleQuote: false,
        tabWidth: 2,
      },
    },
    {
      files: '*.{ts,tsx}',
      options: {
        parser: 'typescript',
      },
    },
  ],

   }