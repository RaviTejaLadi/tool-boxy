import type { LucideIcon } from 'lucide-react';
import {
  AudioWaveform,
  Binary,
  CodeXml,
  Crop,
  FileCode2,
  FileText,
  FileType,
  Globe,
  Grid2X2,
  Image,
  ImagePlus,
  Images,
  Palette,
  Pencil,
  Ruler,
} from 'lucide-react';

export type ToolCategory = 'Colour' | 'Image' | 'Text' | 'Converters' | 'Projects';

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
    title: 'Placeholder Generator',
    description: 'Generate customisable placeholder images as PNG or SVG',
    url: '/placeholder-generator',
    category: 'Image',
    icon: Image,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Base64 Image Encoder',
    description: 'Convert images to Base64 strings for CSS/HTML embedding',
    url: '/base64-image-encoder',
    category: 'Image',
    icon: ImagePlus,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Favicon Generator',
    description: 'Generate favicon sizes and HTML snippets from any image',
    url: '/favicon-generator',
    category: 'Image',
    icon: Globe,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Image Converter',
    description: 'Convert between PNG, JPEG, WebP and more with resize options',
    url: '/image-converter',
    category: 'Image',
    icon: Images,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Image Splitter',
    description: 'Split images into a custom grid of downloadable tiles',
    url: '/image-splitter',
    category: 'Image',
    icon: Grid2X2,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Code Snippet',
    description: 'Create and export styled code screenshots',
    url: '/code-snippet',
    category: 'Text',
    icon: FileCode2,
    featured: true,
  },
  {
    title: 'Markdown Live Preview',
    description: 'Write markdown and preview it live side by side',
    url: '/markdown-live-preview',
    category: 'Text',
    icon: FileText,
    featured: true,
    badge: 'New',
  },
  {
    title: 'PDF Viewer',
    description: 'Preview, zoom, rotate, and navigate PDF files in the browser',
    url: '/pdf-viewer',
    category: 'Text',
    icon: FileType,
    featured: true,
    badge: 'New',
  },
  {
    title: 'SVG Viewer',
    description: 'Paste SVG code and preview it live with zoom controls',
    url: '/svg-viewer',
    category: 'Image',
    icon: CodeXml,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Base Converter',
    description: 'Convert between decimal, hex, binary, octal and bitwise ops',
    url: '/base-converter',
    category: 'Converters',
    icon: Binary,
    featured: true,
    badge: 'New',
  },
  {
    title: 'Unit Converter',
    description: 'Convert between length, weight, area, data, temperature, and more',
    url: '/unit-converter',
    category: 'Converters',
    icon: Ruler,
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

export const toolCategories: ToolCategory[] = ['Colour', 'Image', 'Text', 'Converters', 'Projects'];

export const featuredTools = tools.filter((tool) => tool.featured);

export function toolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}
