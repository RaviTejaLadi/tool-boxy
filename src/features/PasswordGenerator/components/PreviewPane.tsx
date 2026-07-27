import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStrengthInfo } from '../helpers';
import { usePasswordStore } from '../stores';

export function PreviewPane() {
  const password = usePasswordStore((s) => s.password);
  const strength = usePasswordStore((s) => s.strength);
  const copied = usePasswordStore((s) => s.copied);
  const copyToClipboard = usePasswordStore((s) => s.copyToClipboard);
  const includeUppercase = usePasswordStore((s) => s.includeUppercase);
  const includeLowercase = usePasswordStore((s) => s.includeLowercase);
  const includeNumbers = usePasswordStore((s) => s.includeNumbers);
  const includeSymbols = usePasswordStore((s) => s.includeSymbols);

  const hasOptions = includeUppercase || includeLowercase || includeNumbers || includeSymbols;
  const isReady = Boolean(password) && hasOptions;
  const strengthInfo = getStrengthInfo(strength);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 p-6 lg:p-10">
          <div className="w-full max-w-xl space-y-4 text-center">
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Generated password</p>
            <p
              className={`break-all font-mono text-2xl font-semibold tracking-tight sm:text-3xl ${
                isReady ? '' : 'text-muted-foreground/50'
              }`}
            >
              {isReady ? password : hasOptions ? '—' : 'Select at least one character set'}
            </p>

            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={() => void copyToClipboard()} disabled={!isReady}>
                {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          {isReady && (
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                <span className="tracking-wide uppercase">Strength</span>
                <span className="font-medium text-foreground">{strengthInfo.label}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden bg-muted">
                <div
                  className={`h-full transition-all duration-300 ${strengthInfo.color}`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums shadow-sm backdrop-blur-sm">
          {isReady ? `${password.length} characters` : 'Ready'}
        </span>
      </div>
    </div>
  );
}
