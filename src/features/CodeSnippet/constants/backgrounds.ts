// @ts-nocheck — typed gradually
/* Backgrounds behind the card. "transparent" ships no fill at all. */
export const BACKGROUNDS = [
  {
    id: 'violet',
    type: 'gradient',
    label: 'Violet Dusk',
    stops: [
      { offset: '0%', color: '#8b5cf6' },
      { offset: '100%', color: '#d8b4fe' },
    ],
  },
  {
    id: 'sunset',
    type: 'gradient',
    label: 'Sunset',
    stops: [
      { offset: '0%', color: '#f97316' },
      { offset: '100%', color: '#fbcfe8' },
    ],
  },
  {
    id: 'ocean',
    type: 'gradient',
    label: 'Ocean',
    stops: [
      { offset: '0%', color: '#0ea5e9' },
      { offset: '100%', color: '#1e3a8a' },
    ],
  },
  {
    id: 'forest',
    type: 'gradient',
    label: 'Forest',
    stops: [
      { offset: '0%', color: '#22c55e' },
      { offset: '100%', color: '#064e3b' },
    ],
  },
  {
    id: 'candy',
    type: 'gradient',
    label: 'Candy',
    stops: [
      { offset: '0%', color: '#ec4899' },
      { offset: '100%', color: '#60a5fa' },
    ],
  },
  { id: 'mono-dark', type: 'solid', label: 'Charcoal', color: '#18181b' },
  { id: 'mono-light', type: 'solid', label: 'Paper', color: '#e4e4e7' },
  { id: 'transparent', type: 'transparent', label: 'Transparent' },
];
