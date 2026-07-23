// @ts-nocheck — typed gradually
import {
  KW,
  clikeRules,
  jsxRules,
  pyRules,
  rubyRules,
  htmlRules,
  cssRules,
  jsonRules,
  bashRules,
  sqlRules,
  yamlRules,
  mdRules,
  plainRules,
} from '../utils';

/* Tiny dependency-free lexer language map. Not a full parser —
   longest-match-first scanner tuned for screenshot readability. */
export const LANGUAGES = {
  tsx: { label: 'TSX', rules: jsxRules(KW.typescript) },
  jsx: { label: 'JSX', rules: jsxRules(KW.javascript) },
  typescript: { label: 'TypeScript', rules: clikeRules(KW.typescript) },
  javascript: { label: 'JavaScript', rules: clikeRules(KW.javascript) },
  python: { label: 'Python', rules: pyRules() },
  html: { label: 'HTML', rules: htmlRules() },
  css: { label: 'CSS', rules: cssRules() },
  json: { label: 'JSON', rules: jsonRules() },
  bash: { label: 'Bash', rules: bashRules() },
  go: { label: 'Go', rules: clikeRules(KW.go) },
  rust: { label: 'Rust', rules: clikeRules(KW.rust) },
  java: { label: 'Java', rules: clikeRules(KW.java) },
  c: { label: 'C', rules: clikeRules(KW.c) },
  cpp: { label: 'C++', rules: clikeRules(KW.cpp) },
  ruby: { label: 'Ruby', rules: rubyRules() },
  php: { label: 'PHP', rules: clikeRules(KW.php) },
  sql: { label: 'SQL', rules: sqlRules() },
  yaml: { label: 'YAML', rules: yamlRules() },
  markdown: { label: 'Markdown', rules: mdRules() },
  plaintext: { label: 'Plain Text', rules: plainRules() },
};
