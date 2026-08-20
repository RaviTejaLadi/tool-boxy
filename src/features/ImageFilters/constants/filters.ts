export type FilterCategoryId =
  | 'essentials'
  | 'default'
  | 'vintage'
  | 'creative'
  | 'soft'
  | 'subtle'
  | 'unicolor'
  | 'too-old'
  | 'nature'
  | 'social'
  | 'hdr'
  | 'glitch'
  | 'colorize';

export interface FilterCategory {
  id: FilterCategoryId;
  label: string;
}

export interface FilterEffect {
  id: string;
  name: string;
  category: FilterCategoryId;
  css: string;
  description: string;
}

/**
 * Categories aligned with Pixlr Express Effect + Filter tools:
 * https://pixlr.com/express/?tool=effect
 * https://pixlr.com/tools/preset-filters/
 */
export const FILTER_CATEGORIES: FilterCategory[] = [
  { id: 'essentials', label: 'Essentials' },
  { id: 'default', label: 'Default' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'creative', label: 'Creative' },
  { id: 'soft', label: 'Soft' },
  { id: 'subtle', label: 'Subtle' },
  { id: 'unicolor', label: 'Unicolor' },
  { id: 'too-old', label: 'Too Old' },
  { id: 'nature', label: 'Nature' },
  { id: 'social', label: 'Social' },
  { id: 'hdr', label: 'HDR' },
  { id: 'glitch', label: 'Glitch' },
  { id: 'colorize', label: 'Colorize' },
];

/**
 * Premium CSS filter presets inspired by Pixlr Express Effects & Filters.
 * Each `css` string is intentionally unique.
 * (Reflect / Dispersion need brush masks — not representable as pure CSS filters.)
 */
export const FILTERS: FilterEffect[] = [
  // ── Essentials ──────────────────────────────────────────────
  {
    id: 'original',
    name: 'Original',
    category: 'essentials',
    css: '',
    description: 'No filter applied',
  },
  {
    id: 'auto',
    name: 'Auto',
    category: 'essentials',
    css: 'brightness(1.06) contrast(1.12) saturate(1.1)',
    description: 'One-click balanced enhancement',
  },
  {
    id: 'pop',
    name: 'Pop',
    category: 'essentials',
    css: 'brightness(1.08) contrast(1.2) saturate(1.35)',
    description: 'Instant color and contrast pop',
  },
  {
    id: 'bw-auto',
    name: 'B&W',
    category: 'essentials',
    css: 'grayscale(1) contrast(1.15) brightness(1.02)',
    description: 'Clean black & white conversion',
  },

  // ── Default (Pixlr Default pack) ────────────────────────────
  {
    id: 'bright',
    name: 'Bright',
    category: 'default',
    css: 'brightness(1.22) contrast(1.05) saturate(1.08)',
    description: 'Lifted exposure for dull shots',
  },
  {
    id: 'contrast',
    name: 'Contrast',
    category: 'default',
    css: 'brightness(1.02) contrast(1.4) saturate(1.05)',
    description: 'Hard light and shadow separation',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    category: 'default',
    css: 'brightness(1.05) contrast(1.15) saturate(1.55)',
    description: 'High-saturation color boost',
  },
  {
    id: 'clarify',
    name: 'Clarify',
    category: 'default',
    css: 'brightness(1.04) contrast(1.25) saturate(1.12)',
    description: 'Midtone clarity and snap',
  },
  {
    id: 'sharp',
    name: 'Sharp',
    category: 'default',
    css: 'brightness(1.03) contrast(1.35) saturate(1.1)',
    description: 'Crisp texture emphasis',
  },
  {
    id: 'style',
    name: 'Style',
    category: 'default',
    css: 'brightness(1.06) contrast(1.28) saturate(1.4) hue-rotate(-6deg)',
    description: 'Dynamic street-style punch',
  },
  {
    id: 'boost',
    name: 'Boost',
    category: 'default',
    css: 'brightness(1.1) contrast(1.18) saturate(1.3)',
    description: 'All-around energy boost',
  },
  {
    id: 'soften',
    name: 'Soften',
    category: 'default',
    css: 'brightness(1.1) contrast(0.88) saturate(0.95) blur(0.3px)',
    description: 'Gentle soft-focus look',
  },

  // ── Vintage (Pixlr Vintage — person names) ──────────────────
  {
    id: 'carl',
    name: 'Carl',
    category: 'vintage',
    css: 'brightness(1.05) contrast(1.1) saturate(0.85) sepia(0.35) hue-rotate(-8deg)',
    description: 'Classic Pixlr vintage warmth',
  },
  {
    id: 'elsa',
    name: 'Elsa',
    category: 'vintage',
    css: 'brightness(1.12) contrast(0.9) saturate(0.75) sepia(0.25) hue-rotate(12deg)',
    description: 'Faded mint-vintage wash',
  },
  {
    id: 'nora',
    name: 'Nora',
    category: 'vintage',
    css: 'brightness(0.98) contrast(1.15) saturate(0.7) sepia(0.4)',
    description: 'Muted brown album print',
  },
  {
    id: 'otto',
    name: 'Otto',
    category: 'vintage',
    css: 'brightness(1.08) contrast(1.2) saturate(0.9) sepia(0.2) hue-rotate(-15deg)',
    description: 'Warm orange-cast retro',
  },
  {
    id: 'vera',
    name: 'Vera',
    category: 'vintage',
    css: 'brightness(1.1) contrast(0.95) saturate(0.8) sepia(0.3) hue-rotate(20deg)',
    description: 'Soft rose-vintage tint',
  },
  {
    id: 'walt',
    name: 'Walt',
    category: 'vintage',
    css: 'brightness(0.95) contrast(1.25) saturate(0.65) sepia(0.45) hue-rotate(-5deg)',
    description: 'Deep ochre film stock',
  },
  {
    id: 'iris',
    name: 'Iris',
    category: 'vintage',
    css: 'brightness(1.06) contrast(1.05) saturate(0.95) sepia(0.18) hue-rotate(35deg)',
    description: 'Lavender-tinted nostalgia',
  },
  {
    id: 'june',
    name: 'June',
    category: 'vintage',
    css: 'brightness(1.14) contrast(0.92) saturate(1.05) sepia(0.22) hue-rotate(-20deg)',
    description: 'Sunny summer-vintage glow',
  },
  {
    id: 'frank',
    name: 'Frank',
    category: 'vintage',
    css: 'brightness(1.05) contrast(1.15) saturate(1.2) sepia(0.15) hue-rotate(25deg)',
    description: 'Retro color-shift story look',
  },

  // ── Creative (Pixlr Creative — person names) ────────────────
  {
    id: 'grayson',
    name: 'Grayson',
    category: 'creative',
    css: 'brightness(1.05) contrast(1.2) saturate(1.35) hue-rotate(-25deg)',
    description: 'Bold creative color twist',
  },
  {
    id: 'hagrid',
    name: 'Hagrid',
    category: 'creative',
    css: 'brightness(0.95) contrast(1.3) saturate(0.9) hue-rotate(40deg) sepia(0.1)',
    description: 'Earthy creative green cast',
  },
  {
    id: 'helena',
    name: 'Helena',
    category: 'creative',
    css: 'brightness(1.1) contrast(1.15) saturate(1.45) hue-rotate(-40deg)',
    description: 'Magenta-pink creative punch',
  },
  {
    id: 'fred',
    name: 'Fred',
    category: 'creative',
    css: 'brightness(1.08) contrast(1.25) saturate(1.5) hue-rotate(55deg)',
    description: 'Electric teal creative shift',
  },
  {
    id: 'luna',
    name: 'Luna',
    category: 'creative',
    css: 'brightness(0.92) contrast(1.2) saturate(0.7) hue-rotate(200deg)',
    description: 'Moonlit creative cool wash',
  },
  {
    id: 'max',
    name: 'Max',
    category: 'creative',
    css: 'brightness(1.12) contrast(1.35) saturate(1.6) hue-rotate(10deg)',
    description: 'Maximum creative intensity',
  },
  {
    id: 'quinn',
    name: 'Quinn',
    category: 'creative',
    css: 'brightness(1.02) contrast(1.1) saturate(0.5) hue-rotate(160deg) sepia(0.15)',
    description: 'Desaturated cyan creative',
  },
  {
    id: 'rex',
    name: 'Rex',
    category: 'creative',
    css: 'brightness(0.98) contrast(1.4) saturate(1.7) hue-rotate(-55deg)',
    description: 'Aggressive red-orange creative',
  },
  {
    id: 'borg',
    name: 'Borg',
    category: 'creative',
    css: 'brightness(0.96) contrast(1.28) saturate(0.85) hue-rotate(185deg)',
    description: 'Futuristic cool steel tint',
  },
  {
    id: 'cement',
    name: 'Cement',
    category: 'creative',
    css: 'brightness(0.95) contrast(1.2) saturate(0.35) hue-rotate(10deg)',
    description: 'Gritty desaturated industrial',
  },
  {
    id: 'mold',
    name: 'Mold',
    category: 'creative',
    css: 'brightness(0.94) contrast(1.15) saturate(0.8) hue-rotate(95deg) sepia(0.2)',
    description: 'Mysterious greenish ambiance',
  },

  // ── Soft ────────────────────────────────────────────────────
  {
    id: 'mist',
    name: 'Mist',
    category: 'soft',
    css: 'brightness(1.15) contrast(0.82) saturate(0.9) blur(0.4px)',
    description: 'Soft misty atmosphere',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'soft',
    css: 'brightness(1.18) contrast(0.85) saturate(0.85) hue-rotate(8deg)',
    description: 'Airy cloud-soft lift',
  },
  {
    id: 'silk',
    name: 'Silk',
    category: 'soft',
    css: 'brightness(1.1) contrast(0.9) saturate(1.05) sepia(0.08)',
    description: 'Silky smooth skin tones',
  },
  {
    id: 'pearl',
    name: 'Pearl',
    category: 'soft',
    css: 'brightness(1.14) contrast(0.88) saturate(0.95) hue-rotate(-8deg)',
    description: 'Pearly soft highlight glow',
  },
  {
    id: 'dove',
    name: 'Dove',
    category: 'soft',
    css: 'brightness(1.08) contrast(0.92) saturate(0.7) grayscale(0.15)',
    description: 'Gentle dove-grey softness',
  },
  {
    id: 'bloom',
    name: 'Bloom',
    category: 'soft',
    css: 'brightness(1.16) contrast(0.86) saturate(1.2) hue-rotate(-12deg) blur(0.25px)',
    description: 'Dreamy floral bloom soft',
  },
  {
    id: 'creamlow',
    name: 'Creamlow',
    category: 'soft',
    css: 'brightness(1.12) contrast(0.9) saturate(0.95) sepia(0.18) hue-rotate(5deg)',
    description: 'Soft dreamy cream overlay',
  },
  {
    id: 'bokeh-soft',
    name: 'Bokeh Soft',
    category: 'soft',
    css: 'brightness(1.08) contrast(0.95) saturate(1.1) blur(1.2px)',
    description: 'Soft-focus bokeh-style blur',
  },

  // ── Subtle ──────────────────────────────────────────────────
  {
    id: 'whisper',
    name: 'Whisper',
    category: 'subtle',
    css: 'brightness(1.03) contrast(1.04) saturate(1.06)',
    description: 'Barely-there enhancement',
  },
  {
    id: 'haze',
    name: 'Haze',
    category: 'subtle',
    css: 'brightness(1.06) contrast(0.96) saturate(0.92) sepia(0.06)',
    description: 'Light atmospheric haze',
  },
  {
    id: 'tint',
    name: 'Tint',
    category: 'subtle',
    css: 'brightness(1.02) contrast(1.05) saturate(1.08) hue-rotate(8deg)',
    description: 'Subtle cool color tint',
  },
  {
    id: 'fade',
    name: 'Fade',
    category: 'subtle',
    css: 'brightness(1.08) contrast(0.92) saturate(0.88)',
    description: 'Gentle faded lift',
  },
  {
    id: 'mute',
    name: 'Mute',
    category: 'subtle',
    css: 'brightness(1.02) contrast(1.02) saturate(0.82)',
    description: 'Quietly muted colors',
  },
  {
    id: 'soft-lite',
    name: 'Soft Lite',
    category: 'subtle',
    css: 'brightness(1.05) contrast(0.97) saturate(1.02) blur(0.15px)',
    description: 'Ultra-light soft touch',
  },
  {
    id: 'rangeen',
    name: 'Rangeen',
    category: 'subtle',
    css: 'brightness(1.04) contrast(1.08) saturate(1.15) hue-rotate(-4deg) sepia(0.05)',
    description: 'Balanced warm-cool tones',
  },

  // ── Unicolor ────────────────────────────────────────────────
  {
    id: 'red-mono',
    name: 'Red Mono',
    category: 'unicolor',
    css: 'grayscale(0.55) brightness(1.02) contrast(1.15) sepia(0.7) hue-rotate(-40deg) saturate(2)',
    description: 'Single-tone red wash',
  },
  {
    id: 'blue-mono',
    name: 'Blue Mono',
    category: 'unicolor',
    css: 'grayscale(0.5) brightness(1.02) contrast(1.15) sepia(0.4) hue-rotate(180deg) saturate(2.2)',
    description: 'Single-tone blue wash',
  },
  {
    id: 'green-mono',
    name: 'Green Mono',
    category: 'unicolor',
    css: 'grayscale(0.5) brightness(1.02) contrast(1.12) sepia(0.45) hue-rotate(70deg) saturate(2)',
    description: 'Single-tone green wash',
  },
  {
    id: 'amber-mono',
    name: 'Amber Mono',
    category: 'unicolor',
    css: 'grayscale(0.4) brightness(1.05) contrast(1.1) sepia(0.8) hue-rotate(-10deg) saturate(1.8)',
    description: 'Single-tone amber wash',
  },
  {
    id: 'violet-mono',
    name: 'Violet Mono',
    category: 'unicolor',
    css: 'grayscale(0.5) brightness(1) contrast(1.18) sepia(0.5) hue-rotate(240deg) saturate(2.1)',
    description: 'Single-tone violet wash',
  },
  {
    id: 'teal-mono',
    name: 'Teal Mono',
    category: 'unicolor',
    css: 'grayscale(0.45) brightness(1.03) contrast(1.12) sepia(0.35) hue-rotate(145deg) saturate(2.2)',
    description: 'Single-tone teal wash',
  },
  {
    id: 'blues',
    name: 'Blues',
    category: 'unicolor',
    css: 'brightness(1.05) contrast(1.12) saturate(1.25) hue-rotate(195deg)',
    description: 'Emphasized denim blue tones',
  },

  // ── Too Old ─────────────────────────────────────────────────
  {
    id: 'ancient',
    name: 'Ancient',
    category: 'too-old',
    css: 'brightness(0.92) contrast(1.2) saturate(0.4) sepia(0.7)',
    description: 'Heavily aged antique print',
  },
  {
    id: 'yellowed',
    name: 'Yellowed',
    category: 'too-old',
    css: 'brightness(1.05) contrast(1.05) saturate(0.6) sepia(0.65) hue-rotate(5deg)',
    description: 'Yellowed newspaper paper',
  },
  {
    id: 'dusty',
    name: 'Dusty',
    category: 'too-old',
    css: 'brightness(0.96) contrast(0.95) saturate(0.5) sepia(0.5) hue-rotate(-5deg)',
    description: 'Dusty attic photo fade',
  },
  {
    id: 'cracked',
    name: 'Cracked',
    category: 'too-old',
    css: 'brightness(0.9) contrast(1.35) saturate(0.45) sepia(0.55)',
    description: 'High-contrast cracked print',
  },
  {
    id: 'faded-print',
    name: 'Faded Print',
    category: 'too-old',
    css: 'brightness(1.15) contrast(0.8) saturate(0.4) sepia(0.35)',
    description: 'Sun-faded old print',
  },
  {
    id: 'sepia-old',
    name: 'Sepia Old',
    category: 'too-old',
    css: 'sepia(0.85) brightness(1.02) contrast(1.15) saturate(0.8)',
    description: 'Deep traditional sepia',
  },
  {
    id: 'very-old',
    name: 'Very Old',
    category: 'too-old',
    css: 'brightness(0.88) contrast(1.1) saturate(0.3) sepia(0.75) hue-rotate(-8deg)',
    description: 'Extremely aged archival look',
  },

  // ── Nature ──────────────────────────────────────────────────
  {
    id: 'beach',
    name: 'Beach',
    category: 'nature',
    css: 'brightness(1.12) contrast(1.08) saturate(1.25) sepia(0.12) hue-rotate(-8deg)',
    description: 'Warm sunlit beach tones',
  },
  {
    id: 'flower',
    name: 'Flower',
    category: 'nature',
    css: 'brightness(1.08) contrast(1.1) saturate(1.45) hue-rotate(-25deg)',
    description: 'Vibrant pink-purple florals',
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'nature',
    css: 'brightness(0.98) contrast(1.15) saturate(1.2) hue-rotate(25deg) sepia(0.08)',
    description: 'Deep lush woodland greens',
  },
  {
    id: 'berry',
    name: 'Berry',
    category: 'nature',
    css: 'brightness(1.05) contrast(1.12) saturate(1.4) hue-rotate(-30deg) sepia(0.1)',
    description: 'Rich berry reds and pinks',
  },
  {
    id: 'ensalat',
    name: 'Ensalat',
    category: 'nature',
    css: 'brightness(1.06) contrast(1.1) saturate(1.35) hue-rotate(40deg)',
    description: 'Fresh salad greens boost',
  },
  {
    id: 'morning',
    name: 'Morning',
    category: 'nature',
    css: 'brightness(1.14) contrast(1.05) saturate(1.15) sepia(0.2) hue-rotate(-5deg)',
    description: 'Cozy golden morning glow',
  },
  {
    id: 'coco',
    name: 'Coco',
    category: 'nature',
    css: 'brightness(1.1) contrast(1.08) saturate(1.2) sepia(0.28) hue-rotate(-12deg)',
    description: 'Sunset-like warm coco glow',
  },

  // ── Social ──────────────────────────────────────────────────
  {
    id: 'vib',
    name: 'Vib',
    category: 'social',
    css: 'brightness(1.1) contrast(1.18) saturate(1.5)',
    description: 'Lively social feed colors',
  },
  {
    id: 'clarendon',
    name: 'Clarendon',
    category: 'social',
    css: 'brightness(1.1) contrast(1.2) saturate(1.35)',
    description: 'Bright vivid social classic',
  },
  {
    id: 'gingham',
    name: 'Gingham',
    category: 'social',
    css: 'brightness(1.05) contrast(0.9) saturate(1) sepia(0.12)',
    description: 'Soft washed pastel feed look',
  },
  {
    id: 'juno',
    name: 'Juno',
    category: 'social',
    css: 'brightness(1.08) contrast(1.22) saturate(1.4) hue-rotate(-8deg)',
    description: 'Warm skin, cool shadow mix',
  },
  {
    id: 'lark',
    name: 'Lark',
    category: 'social',
    css: 'brightness(1.12) contrast(0.95) saturate(1.25) sepia(0.06)',
    description: 'Brightened greens and blues',
  },
  {
    id: 'reyes',
    name: 'Reyes',
    category: 'social',
    css: 'brightness(1.14) contrast(0.85) saturate(0.75) sepia(0.22)',
    description: 'Dusty vintage social wash',
  },
  {
    id: 'valencia',
    name: 'Valencia',
    category: 'social',
    css: 'brightness(1.08) contrast(1.08) saturate(1.2) sepia(0.15) hue-rotate(-5deg)',
    description: 'Warm faded California light',
  },
  {
    id: 'ludwig',
    name: 'Ludwig',
    category: 'social',
    css: 'brightness(1.05) contrast(1.05) saturate(0.85) sepia(0.08)',
    description: 'Desaturated soft pastel',
  },
  {
    id: 'aden',
    name: 'Aden',
    category: 'social',
    css: 'brightness(1.2) contrast(0.9) saturate(0.85) hue-rotate(20deg)',
    description: 'Cool mint faded story look',
  },

  // ── HDR (Pixlr Filter → HDR) ────────────────────────────────
  {
    id: 'hdr',
    name: 'HDR',
    category: 'hdr',
    css: 'brightness(1.08) contrast(1.35) saturate(1.25)',
    description: 'Balanced light/shadow HDR pop',
  },
  {
    id: 'hdr-soft',
    name: 'HDR Soft',
    category: 'hdr',
    css: 'brightness(1.12) contrast(1.2) saturate(1.15)',
    description: 'Gentle HDR without harshness',
  },
  {
    id: 'hdr-punch',
    name: 'HDR Punch',
    category: 'hdr',
    css: 'brightness(1.05) contrast(1.5) saturate(1.4)',
    description: 'Aggressive HDR drama',
  },
  {
    id: 'hdr-nature',
    name: 'HDR Nature',
    category: 'hdr',
    css: 'brightness(1.1) contrast(1.3) saturate(1.45) hue-rotate(8deg)',
    description: 'Landscape HDR color lift',
  },
  {
    id: 'hdr-urban',
    name: 'HDR Urban',
    category: 'hdr',
    css: 'brightness(1.02) contrast(1.42) saturate(1.1) hue-rotate(-5deg)',
    description: 'Cityscape HDR grit',
  },

  // ── Glitch (Pixlr Filter → Glitch) ──────────────────────────
  {
    id: 'gl1',
    name: 'GL1',
    category: 'glitch',
    css: 'brightness(1.05) contrast(1.3) saturate(1.6) hue-rotate(90deg)',
    description: 'Glitch channel shift green',
  },
  {
    id: 'gl2',
    name: 'GL2',
    category: 'glitch',
    css: 'brightness(1.02) contrast(1.35) saturate(1.7) hue-rotate(180deg)',
    description: 'Glitch channel shift cyan',
  },
  {
    id: 'gl3',
    name: 'GL3',
    category: 'glitch',
    css: 'brightness(0.98) contrast(1.4) saturate(1.8) hue-rotate(270deg)',
    description: 'Glitch channel shift magenta',
  },
  {
    id: 'gl4',
    name: 'GL4',
    category: 'glitch',
    css: 'brightness(1.08) contrast(1.45) saturate(1.5) hue-rotate(-90deg) invert(0.08)',
    description: 'Harsh digital glitch cast',
  },
  {
    id: 'scanlines',
    name: 'Scanlines',
    category: 'glitch',
    css: 'brightness(0.95) contrast(1.25) saturate(0.9) grayscale(0.2) hue-rotate(120deg)',
    description: 'CRT scanline-inspired look',
  },
  {
    id: 'split-hue',
    name: 'Split Hue',
    category: 'glitch',
    css: 'brightness(1.05) contrast(1.2) saturate(1.9) hue-rotate(45deg) invert(0.05)',
    description: 'RGB color-split vibe',
  },
  {
    id: 'interference',
    name: 'Interference',
    category: 'glitch',
    css: 'brightness(1.1) contrast(1.5) saturate(0.6) hue-rotate(210deg) invert(0.12)',
    description: 'Signal interference noise look',
  },
  {
    id: 'rst',
    name: 'RST',
    category: 'glitch',
    css: 'brightness(1.15) contrast(0.9) saturate(1.3) hue-rotate(-150deg)',
    description: 'Reset-style wild hue glitch',
  },

  // ── Colorize (Pixlr Filter → Colorize) ──────────────────────
  {
    id: 'colorize-rose',
    name: 'Rose',
    category: 'colorize',
    css: 'grayscale(0.35) brightness(1.05) contrast(1.15) sepia(0.55) hue-rotate(-35deg) saturate(1.7)',
    description: 'Single-tone rose colorize',
  },
  {
    id: 'colorize-teal',
    name: 'Teal',
    category: 'colorize',
    css: 'grayscale(0.4) brightness(1.02) contrast(1.18) sepia(0.3) hue-rotate(150deg) saturate(1.9)',
    description: 'Single-tone teal colorize',
  },
  {
    id: 'colorize-gold',
    name: 'Gold',
    category: 'colorize',
    css: 'grayscale(0.3) brightness(1.08) contrast(1.12) sepia(0.7) hue-rotate(-5deg) saturate(1.6)',
    description: 'Single-tone gold colorize',
  },
  {
    id: 'duo-warm',
    name: 'Duo Warm',
    category: 'colorize',
    css: 'grayscale(0.25) brightness(1.05) contrast(1.2) sepia(0.4) hue-rotate(-20deg) saturate(1.5)',
    description: 'Warm duo-tone colorize',
  },
  {
    id: 'duo-cool',
    name: 'Duo Cool',
    category: 'colorize',
    css: 'grayscale(0.3) brightness(1.02) contrast(1.22) sepia(0.25) hue-rotate(175deg) saturate(1.6)',
    description: 'Cool duo-tone colorize',
  },
  {
    id: 'tri-neon',
    name: 'Tri Neon',
    category: 'colorize',
    css: 'brightness(1.05) contrast(1.35) saturate(1.85) hue-rotate(280deg)',
    description: 'Neon tri-tone inspired cast',
  },
  {
    id: 'colorize-mono-blue',
    name: 'Mono Blue',
    category: 'colorize',
    css: 'grayscale(0.7) brightness(1) contrast(1.2) sepia(0.35) hue-rotate(190deg) saturate(2)',
    description: 'Near-mono blue colorize',
  },
  {
    id: 'colorize-sunset',
    name: 'Sunset',
    category: 'colorize',
    css: 'grayscale(0.2) brightness(1.1) contrast(1.15) sepia(0.45) hue-rotate(-28deg) saturate(1.65)',
    description: 'Sunset duo colorize',
  },
];

export const DEFAULT_FILTER_ID = 'original';
export const DEFAULT_CATEGORY_ID: FilterCategoryId | 'all' = 'all';

export function getFilterById(id: string): FilterEffect {
  return FILTERS.find((f) => f.id === id) ?? FILTERS[0];
}

export function getFiltersByCategory(categoryId: FilterCategoryId | 'all'): FilterEffect[] {
  if (categoryId === 'all') return FILTERS;
  return FILTERS.filter((f) => f.category === categoryId);
}
