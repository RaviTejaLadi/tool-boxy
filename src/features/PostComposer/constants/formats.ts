export type FormatDef = {
  id: string;
  label: string;
  w: number;
  h: number;
};

export type FormatGroup = {
  label: string;
  formats: FormatDef[];
};

export const FORMAT_GROUPS: FormatGroup[] = [
  {
    label: 'Instagram',
    formats: [
      { id: 'square', label: 'Square Post', w: 1080, h: 1080 },
      { id: 'portrait', label: 'Portrait Post (4:5)', w: 1080, h: 1350 },
      { id: 'story', label: 'Story / Reel (9:16)', w: 1080, h: 1920 },
    ],
  },
  {
    label: 'Facebook',
    formats: [
      { id: 'fb-post', label: 'Feed Post', w: 1200, h: 630 },
      { id: 'fb-story', label: 'Story', w: 1080, h: 1920 },
      { id: 'fb-cover', label: 'Cover Photo', w: 820, h: 312 },
    ],
  },
  {
    label: 'LinkedIn',
    formats: [
      { id: 'banner', label: 'Feed Post', w: 1200, h: 627 },
      { id: 'li-banner', label: 'Profile Banner', w: 1584, h: 396 },
      { id: 'li-square', label: 'Square Post', w: 1080, h: 1080 },
    ],
  },
  {
    label: 'X (Twitter)',
    formats: [
      { id: 'x-post', label: 'Post (16:9)', w: 1600, h: 900 },
      { id: 'x-header', label: 'Header', w: 1500, h: 500 },
    ],
  },
  {
    label: 'YouTube',
    formats: [
      { id: 'yt-thumbnail', label: 'Thumbnail', w: 1280, h: 720 },
      { id: 'yt-banner', label: 'Channel Banner', w: 2560, h: 1440 },
    ],
  },
  {
    label: 'Pinterest',
    formats: [
      { id: 'pin-standard', label: 'Standard Pin (2:3)', w: 1000, h: 1500 },
      { id: 'pin-square', label: 'Square Pin', w: 1000, h: 1000 },
    ],
  },
  {
    label: 'TikTok',
    formats: [{ id: 'tiktok-video', label: 'Video (9:16)', w: 1080, h: 1920 }],
  },
  {
    label: 'General',
    formats: [
      { id: 'hd-landscape', label: 'HD Landscape (16:9)', w: 1920, h: 1080 },
      { id: 'hd-portrait', label: 'HD Portrait (9:16)', w: 1080, h: 1920 },
      { id: 'presentation', label: 'Presentation (16:9)', w: 1920, h: 1080 },
      { id: 'a4-portrait', label: 'A4 Portrait', w: 2480, h: 3508 },
    ],
  },
];

export const FORMATS = FORMAT_GROUPS.flatMap((group) => group.formats);

export function findFormat(id: string): FormatDef | undefined {
  return FORMATS.find((f) => f.id === id);
}
