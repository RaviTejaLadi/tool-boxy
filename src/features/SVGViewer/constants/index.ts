export const MIN_SCALE = 0.25;
export const MAX_SCALE = 3;
export const SCALE_STEP = 0.25;
export const HISTORY_LIMIT = 50;

export const EDITOR_FONT_SIZE = 13;
export const EDITOR_LINE_HEIGHT = 24;
export const EDITOR_GUTTER_BG = 'color-mix(in oklab, var(--muted) 60%, var(--background))';

/** Highlighting is skipped past this size so typing stays responsive. */
export const MAX_HIGHLIGHT_LENGTH = 120_000;

export type PreviewTab = 'preview' | 'react' | 'react-native' | 'png' | 'data-uri';
export type PreviewBackground = 'surface' | 'white' | 'black' | 'checker';

export const PREVIEW_TABS: { id: PreviewTab; label: string }[] = [
  { id: 'preview', label: 'Preview' },
  { id: 'react', label: 'React' },
  { id: 'react-native', label: 'React Native' },
  { id: 'png', label: 'PNG' },
  { id: 'data-uri', label: 'Data URI' },
];

export const PREVIEW_BACKGROUNDS: { id: PreviewBackground; label: string }[] = [
  { id: 'surface', label: 'Default' },
  { id: 'white', label: 'White' },
  { id: 'black', label: 'Black' },
  { id: 'checker', label: 'Transparent' },
];

export const DEFAULT_SVG = `<!-- Colorful 3D-style Toolbox with Tools -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>

    <!-- Shadow Filter -->
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="8" flood-color="#000000" flood-opacity="0.4"/>
    </filter>

    <!-- Metallic Gradients -->
    <linearGradient id="metalSilver" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="50%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#94a3b8"/>
    </linearGradient>

    <linearGradient id="metalDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#64748b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>

    <!-- Color Gradients -->
    <linearGradient id="boxRed" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff4b4b"/>
      <stop offset="100%" stop-color="#dc2626"/>
    </linearGradient>

    <linearGradient id="boxRedDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#991b1b"/>
      <stop offset="100%" stop-color="#7f1d1d"/>
    </linearGradient>

    <linearGradient id="handleYellow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="100%" stop-color="#eab308"/>
    </linearGradient>

    <linearGradient id="accentBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>

    <linearGradient id="accentGreen" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4ade80"/>
      <stop offset="100%" stop-color="#16a34a"/>
    </linearGradient>

    <linearGradient id="accentOrange" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
  </defs>

  <!-- Dark Background -->
  <rect width="800" height="600" fill="url(#bgGrad)"/>

  <!-- Floor Shadow -->
  <ellipse cx="400" cy="510" rx="280" ry="25" fill="#000000" opacity="0.6" filter="blur(10px)"/>

  <!-- TOOLBOX BACK LAYER (Inside background) -->
  <g id="toolbox-back">
    <rect x="220" y="270" width="360" height="150" rx="12" fill="url(#boxRedDark)"/>
  </g>

  <!-- TOOLS INSIDE THE BOX -->
  <g id="tools">
    <!-- Wrench (Left angled) -->
    <g transform="translate(260, 170) rotate(-25)">
      <!-- Handle -->
      <rect x="20" y="60" width="24" height="130" rx="5" fill="url(#accentBlue)"/>
      <!-- Metallic Open End -->
      <path d="M 12 60 C 0 40 5 15 32 10 C 55 5 65 30 52 55 L 40 50 C 48 35 40 20 28 22 C 18 24 15 38 24 48 Z" fill="url(#metalSilver)"/>
      <!-- Ring detail -->
      <circle cx="32" cy="175" r="12" fill="url(#metalSilver)"/>
      <circle cx="32" cy="175" r="7" fill="#1e293b"/>
    </g>

    <!-- Handsaw (Center-Left) -->
    <g transform="translate(320, 120) rotate(-8)">
      <!-- Blade -->
      <polygon points="30,80 110,20 120,180 30,180" fill="url(#metalSilver)"/>
      <!-- Teeth -->
      <path d="M 120 180 L 115 175 L 110 180 L 105 175 L 100 180 L 95 175 L 90 180 L 85 175 L 80 180 L 75 175 L 70 180 L 65 175 L 60 180 L 55 175 L 50 180 L 45 175 L 40 180 L 35 175 L 30 180" stroke="url(#metalSilver)" stroke-width="2" fill="none"/>
      <!-- Handle -->
      <path d="M 10 130 C 10 100 35 90 50 90 L 50 120 C 40 120 30 125 30 140 C 30 155 40 160 50 160 L 50 190 C 35 190 10 180 10 130 Z" fill="url(#accentOrange)"/>
      <circle cx="40" cy="110" r="3" fill="#334155"/>
      <circle cx="40" cy="170" r="3" fill="#334155"/>
    </g>

    <!-- Hammer (Center) -->
    <g transform="translate(390, 100) rotate(12)">
      <!-- Wood/Rubber Handle -->
      <rect x="22" y="80" width="20" height="170" rx="6" fill="url(#handleYellow)"/>
      <rect x="22" y="190" width="20" height="60" rx="4" fill="#0f172a" opacity="0.8"/> <!-- Grip -->
      <!-- Metal Head -->
      <path d="M -10 60 L 20 65 L 20 85 L -10 85 Z" fill="url(#metalDark)"/> <!-- Claw left -->
      <path d="M -20 50 C -5 52 10 58 20 65 L -10 85 C -15 75 -20 60 -20 50 Z" fill="url(#metalSilver)"/>
      <rect x="20" y="62" width="45" height="25" rx="2" fill="url(#metalSilver)"/> <!-- Center block -->
      <rect x="65" y="59" width="12" height="31" rx="2" fill="url(#metalDark)"/> <!-- Striking Head -->
    </g>

    <!-- Screwdriver (Right angled) -->
    <g transform="translate(480, 140) rotate(30)">
      <!-- Shaft -->
      <rect x="18" y="20" width="8" height="110" fill="url(#metalSilver)"/>
      <!-- Flat Head Tip -->
      <polygon points="18,20 26,20 24,8 20,8" fill="url(#metalDark)"/>
      <!-- Handle -->
      <path d="M 10 130 L 34 130 L 38 210 C 38 220 28 225 22 225 C 16 225 6 220 6 210 Z" fill="url(#accentGreen)"/>
      <!-- Handle Rubber Grips -->
      <rect x="12" y="145" width="4" height="50" rx="2" fill="#0f172a" opacity="0.3"/>
      <rect x="28" y="145" width="4" height="50" rx="2" fill="#0f172a" opacity="0.3"/>
    </g>

    <!-- Ruler / Square Tool (Tucked behind right side) -->
    <g transform="translate(450, 210) rotate(-15)">
      <rect x="0" y="0" width="140" height="26" rx="3" fill="url(#handleYellow)"/>
      <!-- Ruler Ticks -->
      <line x1="10" y1="0" x2="10" y2="10" stroke="#0f172a" stroke-width="1.5"/>
      <line x1="20" y1="0" x2="20" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="30" y1="0" x2="30" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="40" y1="0" x2="40" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="50" y1="0" x2="50" y2="10" stroke="#0f172a" stroke-width="1.5"/>
      <line x1="60" y1="0" x2="60" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="70" y1="0" x2="70" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="80" y1="0" x2="80" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="90" y1="0" x2="90" y2="10" stroke="#0f172a" stroke-width="1.5"/>
      <line x1="100" y1="0" x2="100" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="110" y1="0" x2="110" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="120" y1="0" x2="120" y2="6" stroke="#0f172a" stroke-width="1"/>
      <line x1="130" y1="0" x2="130" y2="10" stroke="#0f172a" stroke-width="1.5"/>
    </g>
  </g>

  <!-- TOOLBOX FRONT LAYER (Covers lower half of tools) -->
  <g id="toolbox-front" filter="url(#dropShadow)">
    <!-- Main Body Front Base -->
    <rect x="200" y="300" width="400" height="180" rx="16" fill="url(#boxRed)"/>

    <!-- Bottom Rim/Base Reinforcement -->
    <path d="M 200 460 L 600 460 L 600 468 C 600 477 593 484 584 484 L 216 484 C 207 484 200 477 200 468 Z" fill="#991b1b"/>

    <!-- Front Metal Latches -->
    <!-- Left Latch -->
    <rect x="280" y="310" width="30" height="45" rx="4" fill="url(#metalSilver)"/>
    <rect x="285" y="320" width="20" height="25" rx="2" fill="url(#metalDark)"/>
    <circle cx="295" cy="315" r="2.5" fill="#334155"/>
    
    <!-- Right Latch -->
    <rect x="490" y="310" width="30" height="45" rx="4" fill="url(#metalSilver)"/>
    <rect x="495" y="320" width="20" height="25" rx="2" fill="url(#metalDark)"/>
    <circle cx="505" cy="315" r="2.5" fill="#334155"/>

    <!-- Center Handle / Grip -->
    <path d="M 320 300 L 340 250 L 460 250 L 480 300 Z" fill="none" stroke="url(#metalDark)" stroke-width="14" stroke-linejoin="round"/>
    <path d="M 320 300 L 340 250 L 460 250 L 480 300 Z" fill="none" stroke="url(#metalSilver)" stroke-width="8" stroke-linejoin="round"/>
    <!-- Yellow Handle Grip Center -->
    <rect x="360" y="242" width="80" height="16" rx="4" fill="url(#handleYellow)"/>

    <!-- Decorative Front Label / Badge -->
    <rect x="350" y="380" width="100" height="35" rx="6" fill="#1e293b" stroke="url(#metalSilver)" stroke-width="2"/>
    <text x="400" y="402" font-family="system-ui, sans-serif" font-weight="800" font-size="14" fill="#38bdf8" text-anchor="middle" letter-spacing="1.5">BUILD</text>

    <!-- Corner Metallic Protectors -->
    <!-- Top Left -->
    <path d="M 200 316 C 200 307 207 300 216 300 L 225 300 L 200 325 Z" fill="url(#metalSilver)"/>
    <!-- Top Right -->
    <path d="M 600 316 C 600 307 593 300 584 300 L 575 300 L 600 325 Z" fill="url(#metalSilver)"/>
    <!-- Bottom Left -->
    <path d="M 200 464 C 200 473 207 480 216 480 L 225 480 L 200 455 Z" fill="url(#metalSilver)"/>
    <!-- Bottom Right -->
    <path d="M 600 464 C 600 473 593 480 584 480 L 575 480 L 600 455 Z" fill="url(#metalSilver)"/>
  </g>

  <!-- FOREGROUND ACCENTS (Floating Sparks / Vibrant Details) -->
  <g id="sparks">
    <circle cx="210" cy="220" r="4" fill="#38bdf8" opacity="0.8"/>
    <circle cx="610" cy="200" r="3" fill="#fde047" opacity="0.8"/>
    <circle cx="580" cy="130" r="5" fill="#4ade80" opacity="0.7"/>
    <polygon points="230,120 234,128 242,130 234,132 230,140 226,132 218,130 226,128" fill="#fde047" opacity="0.9"/>
    <polygon points="550,260 553,265 560,266 553,268 550,274 547,268 540,266 547,265" fill="#38bdf8" opacity="0.9"/>
  </g>
</svg>`;
