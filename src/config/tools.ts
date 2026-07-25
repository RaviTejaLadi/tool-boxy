import type { LucideIcon } from 'lucide-react';
import {
  AudioWaveform,
  Crop,
  FileCode2,
  FileText,
  Globe,
  Grid2X2,
  Image,
  ImagePlus,
  Images,
  Palette,
  Pencil,
} from 'lucide-react';

export type ToolCategory = 'Colour' | 'Developer' | 'Projects';

export type Tool = {
  title: string;
  description: string;
  url: string;
  category: ToolCategory;
  icon: LucideIcon;
  featured?: boolean;
  badge?: 'New' | 'Beta';
};

export const tools: Tool[] = [
  {
    title: 'Palette Generator',
    description: 'Generate beautiful colour palettes',
    url: '/palette-generator',
    category: 'Colour',
    icon: Pencil,
    featured: true,
  },
  {
    title: 'Palette Collection',
    description: 'Browse and pick curated colour palettes',
    url: '/palette-collection',
    category: 'Colour',
    icon: Palette,
    featured: true,
  },
  {
    title: 'Tailwind Shade Generator',
    description: 'Generate Tailwind colour scales from any hex',
    url: '/tailwind-shade-generator',
    category: 'Colour',
    icon: AudioWaveform,
    featured: true,
  },
  {
    title: 'Code Snippet',
    description: 'Create and export styled code screenshots',
    url: '/code-snippet',
    category: 'Developer',
    icon: FileCode2,
    featured: true,
  },
  {
    title: 'Markdown Live Preview',
    description: 'Write markdown and preview it live side by side',
    url: '/markdown-live-preview',
    category: 'Developer',
    icon: FileText,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Placeholder Generator',
    description: 'Generate customisable placeholder images as PNG or SVG',
    url: '/placeholder-generator',
    category: 'Developer',
    icon: Image,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Base64 Image Encoder',
    description: 'Convert images to Base64 strings for CSS/HTML embedding',
    url: '/base64-image-encoder',
    category: 'Developer',
    icon: ImagePlus,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Favicon Generator',
    description: 'Generate favicon sizes and HTML snippets from any image',
    url: '/favicon-generator',
    category: 'Developer',
    icon: Globe,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Image Converter',
    description: 'Convert between PNG, JPEG, WebP and more with resize options',
    url: '/image-converter',
    category: 'Developer',
    icon: Images,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Image Splitter',
    description: 'Split images into a custom grid of downloadable tiles',
    url: '/image-splitter',
    category: 'Developer',
    icon: Grid2X2,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Design Engineering',
    description: 'Design system experiments and prototypes',
    url: '/projects/design',
    category: 'Projects',
    icon: Crop,
  },
];

export const toolCategories: ToolCategory[] = ['Colour', 'Developer', 'Projects'];

export const featuredTools = tools.filter((tool) => tool.featured);

export function toolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}
