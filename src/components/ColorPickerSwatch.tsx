import { cn } from '@/lib/utils';

/** Normalizes a colour string for `<input type="color">` (#rrggbb). */
export function toHexColorInputValue(color: string): string {
  const trimmed = color.trim();
  const full = /^#?([a-f\d]{6})$/i.exec(trimmed);
  if (full) return `#${full[1].toLowerCase()}`;
  const short = /^#?([a-f\d]{3})$/i.exec(trimmed);
  if (short) {
    const [r, g, b] = short[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return '#000000';
}

type ColorPickerSwatchProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaLabel: string;
};

export function ColorPickerSwatch({ value, onChange, className, ariaLabel }: ColorPickerSwatchProps) {
  const inputValue = toHexColorInputValue(value);

  return (
    <label className={cn('relative shrink-0 cursor-pointer overflow-hidden border border-border', className)}>
      <span className="absolute inset-0" style={{ backgroundColor: value }} aria-hidden />
      <input
        type="color"
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
        aria-label={ariaLabel}
      />
    </label>
  );
}
