import { atomDark, oneLight, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/components/theme/theme-provider';

export type SyntaxThemeVariant = 'default' | 'panel';

export function useSyntaxTheme(variant: SyntaxThemeVariant = 'default') {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return {
    isDark,
    style: isDark ? atomDark : variant === 'panel' ? oneLight : prism,
  };
}
