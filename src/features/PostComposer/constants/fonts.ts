export const FONT_FAMILIES = [
  { id: 'system', label: 'System Sans', value: 'system-ui, sans-serif' },
  { id: 'georgia', label: 'Georgia', value: 'Georgia, serif' },
  { id: 'courier', label: 'Courier', value: "'Courier New', monospace" },
  { id: 'impact', label: 'Impact', value: 'Impact, sans-serif' },
  { id: 'palatino', label: 'Palatino', value: "'Palatino Linotype', serif" },
  { id: 'trebuchet', label: 'Trebuchet', value: "'Trebuchet MS', sans-serif" },
] as const;

export const TEXT_STYLE_PRESETS = [
  { name: 'Heading', fontSize: 72, fontWeight: 800, fontFamily: 'Georgia, serif', text: 'Add a heading' },
  { name: 'Subheading', fontSize: 40, fontWeight: 600, fontFamily: 'system-ui, sans-serif', text: 'Add a subheading' },
  { name: 'Body', fontSize: 26, fontWeight: 400, fontFamily: 'system-ui, sans-serif', text: 'Add body text here' },
  { name: 'Caption', fontSize: 18, fontWeight: 500, fontFamily: 'system-ui, sans-serif', text: 'Small caption text' },
  { name: 'Quote', fontSize: 34, fontWeight: 500, fontFamily: 'Georgia, serif', text: '"Your quote goes here"' },
  { name: 'CTA', fontSize: 24, fontWeight: 700, fontFamily: 'system-ui, sans-serif', text: 'Learn more →' },
  {
    name: 'Label',
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'system-ui, sans-serif',
    text: 'LABEL',
    letterSpacing: 3,
  },
  { name: 'Number', fontSize: 120, fontWeight: 900, fontFamily: 'system-ui, sans-serif', text: '01' },
] as const;

export const QUICK_COLORS = [
  '#FFFFFF',
  '#111827',
  '#14E8B4',
  '#3B82F6',
  '#EF4444',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#6B7280',
  '#F5F1EA',
  '#0B0D12',
] as const;
