// @ts-nocheck — typed gradually
import { LANGUAGES } from '../constants/languages';

export function tokenize(code, langId) {
  const rules = (LANGUAGES[langId] || LANGUAGES.plaintext).rules;
  const tokens = [];
  let i = 0;
  const n = code.length;
  while (i < n) {
    let matched = false;
    for (const rule of rules) {
      rule.re.lastIndex = i;
      const m = rule.re.exec(code);
      if (m && m.index === i && m[0].length > 0) {
        tokens.push({ text: m[0], type: rule.type });
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      const prev = tokens[tokens.length - 1];
      if (prev && prev.type === 'plain' && code[i] !== '\n' && !prev.text.endsWith('\n')) {
        prev.text += code[i];
      } else {
        tokens.push({ text: code[i], type: 'plain' });
      }
      i += 1;
    }
  }
  return tokens;
}
