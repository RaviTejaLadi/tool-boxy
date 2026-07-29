import { generateGlassStyle } from '../helpers';
import { useGlassmorphismStore } from '../stores';

export function PreviewPane() {
  const bgColor = useGlassmorphismStore((s) => s.bgColor);
  const bgOpacity = useGlassmorphismStore((s) => s.bgOpacity);
  const borderColor = useGlassmorphismStore((s) => s.borderColor);
  const borderOpacity = useGlassmorphismStore((s) => s.borderOpacity);
  const blur = useGlassmorphismStore((s) => s.blur);
  const borderRadius = useGlassmorphismStore((s) => s.borderRadius);
  const shadowIntensity = useGlassmorphismStore((s) => s.shadowIntensity);
  const borderWidth = useGlassmorphismStore((s) => s.borderWidth);
  const enableBorder = useGlassmorphismStore((s) => s.enableBorder);
  const enableShadow = useGlassmorphismStore((s) => s.enableShadow);
  const gradient1 = useGlassmorphismStore((s) => s.gradient1);
  const gradient2 = useGlassmorphismStore((s) => s.gradient2);
  const gradientAngle = useGlassmorphismStore((s) => s.gradientAngle);

  const glassStyle = generateGlassStyle({
    bgColor,
    bgOpacity,
    borderColor,
    borderOpacity,
    blur,
    borderRadius,
    shadowIntensity,
    borderWidth,
    enableBorder,
    enableShadow,
  });
  const previewBg = `linear-gradient(${gradientAngle}deg, ${gradient1}, ${gradient2})`;

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
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-6 lg:p-10">
          <div
            className="relative w-full max-w-xl overflow-hidden border border-border"
            style={{ background: previewBg, minHeight: 320 }}
          >
            <div
              className="absolute inset-4 flex items-center justify-center transition-all duration-300"
              style={glassStyle}
            >
              <div className="p-6 text-center text-white">
                <h2 className="text-xl font-semibold drop-shadow-md">Glassmorphism</h2>
                <p className="mt-2 text-sm opacity-80">Adjust controls in the sidebar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2">
        <span className="rounded-none border border-border bg-background/90 px-2 py-1 font-mono text-[11px] text-muted-foreground shadow-sm backdrop-blur-sm">
          blur {blur}px · bg {bgOpacity}% · {bgColor}
        </span>
      </div>
    </div>
  );
}
