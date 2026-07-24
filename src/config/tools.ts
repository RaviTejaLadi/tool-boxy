import type { LucideIcon } from 'lucide-react';
import { AudioWaveform, Crop, FileCode2, FileText, Palette, Pencil, Terminal } from 'lucide-react';

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
    title: 'Playground',
    description: 'Experiment with ideas in a scratch space',
    url: '/playground',
    category: 'Developer',
    icon: Terminal,
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
