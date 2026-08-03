export interface FlexItemConfig {
  label: string;
  width?: number | 'auto';
  height?: number | 'auto';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string;
  alignSelf?: string;
  minWidth?: number;
  minHeight?: number;
}

export interface FlexContainerConfig {
  flexDirection: string;
  flexWrap: string;
  justifyContent: string;
  alignItems: string;
  alignContent: string;
  gap: number;
  minHeight?: number;
  padding?: number;
}

export interface FlexPattern {
  id: string;
  name: string;
  description: string;
  container: FlexContainerConfig;
  items: FlexItemConfig[];
  /** Canvas size used for accurate scaled thumbnails */
  previewWidth: number;
  previewHeight: number;
}

export const FLEX_PATTERNS: FlexPattern[] = [
  {
    id: 'app-navbar',
    name: 'App Navbar',
    description: 'Logo, navigation links, and account action in a single header row',
    previewWidth: 400,
    previewHeight: 56,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 12,
      minHeight: 56,
      padding: 12,
    },
    items: [
      { label: 'Logo', width: 88, height: 32, flexShrink: 0 },
      { label: 'Home · Docs · Pricing', flexGrow: 1, height: 32 },
      { label: 'Sign in', width: 72, height: 32, flexShrink: 0 },
    ],
  },
  {
    id: 'sticky-footer-page',
    name: 'Sticky Footer Page',
    description: 'Full-height page shell where the main area grows and footer stays at the bottom',
    previewWidth: 360,
    previewHeight: 280,
    container: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 0,
      minHeight: 280,
    },
    items: [
      { label: 'Header', height: 48, flexShrink: 0 },
      { label: 'Main content', flexGrow: 1, flexShrink: 1, flexBasis: '0', minHeight: 120 },
      { label: 'Footer', height: 40, flexShrink: 0 },
    ],
  },
  {
    id: 'sidebar-main',
    name: 'Sidebar + Main',
    description: 'Fixed-width sidebar with a fluid main content region',
    previewWidth: 400,
    previewHeight: 240,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 0,
      minHeight: 240,
    },
    items: [
      { label: 'Sidebar', width: 120, flexShrink: 0 },
      { label: 'Main', flexGrow: 1, flexShrink: 1, flexBasis: '0' },
    ],
  },
  {
    id: 'split-editor',
    name: 'Split Editor Panel',
    description: 'Two equal panels for code editor and live preview side by side',
    previewWidth: 400,
    previewHeight: 220,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 8,
      minHeight: 220,
      padding: 8,
    },
    items: [
      { label: 'Editor', flexGrow: 1, flexShrink: 1, flexBasis: '0' },
      { label: 'Preview', flexGrow: 1, flexShrink: 1, flexBasis: '0' },
    ],
  },
  {
    id: 'equal-columns',
    name: 'Equal Width Columns',
    description: 'Three content columns that share remaining space evenly',
    previewWidth: 400,
    previewHeight: 160,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 12,
      minHeight: 160,
      padding: 12,
    },
    items: [
      { label: 'Col 1', flexGrow: 1, flexShrink: 1, flexBasis: '0', minHeight: 100 },
      { label: 'Col 2', flexGrow: 1, flexShrink: 1, flexBasis: '0', minHeight: 100 },
      { label: 'Col 3', flexGrow: 1, flexShrink: 1, flexBasis: '0', minHeight: 100 },
    ],
  },
  {
    id: 'responsive-card-grid',
    name: 'Responsive Card Grid',
    description: 'Wrapping card row that reflows into multiple lines on smaller widths',
    previewWidth: 400,
    previewHeight: 200,
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'flex-start',
      gap: 12,
      minHeight: 200,
      padding: 12,
    },
    items: [
      { label: 'Card', flexGrow: 1, flexBasis: '120px', minWidth: 100, height: 72 },
      { label: 'Card', flexGrow: 1, flexBasis: '120px', minWidth: 100, height: 72 },
      { label: 'Card', flexGrow: 1, flexBasis: '120px', minWidth: 100, height: 72 },
      { label: 'Card', flexGrow: 1, flexBasis: '120px', minWidth: 100, height: 72 },
      { label: 'Card', flexGrow: 1, flexBasis: '120px', minWidth: 100, height: 72 },
    ],
  },
  {
    id: 'media-object',
    name: 'Media Object',
    description: 'Avatar or thumbnail beside a flexible text block',
    previewWidth: 360,
    previewHeight: 96,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      alignContent: 'stretch',
      gap: 14,
      minHeight: 96,
      padding: 12,
    },
    items: [
      { label: 'Avatar', width: 56, height: 56, flexShrink: 0 },
      { label: 'Title and description text block', flexGrow: 1, flexShrink: 1, flexBasis: '0', minHeight: 56 },
    ],
  },
  {
    id: 'form-field-row',
    name: 'Form Field Row',
    description: 'Label aligned with a full-width input in a horizontal form row',
    previewWidth: 360,
    previewHeight: 52,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 12,
      minHeight: 52,
      padding: 12,
    },
    items: [
      { label: 'Email', width: 72, height: 36, flexShrink: 0 },
      { label: 'you@company.com', flexGrow: 1, flexShrink: 1, flexBasis: '0', height: 36 },
    ],
  },
  {
    id: 'input-group',
    name: 'Input Group',
    description: 'Prefix addon, input field, and suffix action combined in one control',
    previewWidth: 360,
    previewHeight: 44,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 0,
      minHeight: 44,
    },
    items: [
      { label: 'https://', width: 72, flexShrink: 0 },
      { label: 'domain.com', flexGrow: 1, flexShrink: 1, flexBasis: '0' },
      { label: 'Go', width: 48, flexShrink: 0 },
    ],
  },
  {
    id: 'button-toolbar',
    name: 'Button Toolbar',
    description: 'Grouped action buttons with consistent spacing in a toolbar row',
    previewWidth: 320,
    previewHeight: 44,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 8,
      minHeight: 48,
      padding: 8,
    },
    items: [
      { label: 'Bold', width: 52, height: 32 },
      { label: 'Italic', width: 52, height: 32 },
      { label: 'Link', width: 52, height: 32 },
      { label: 'Code', width: 52, height: 32 },
    ],
  },
  {
    id: 'pagination-bar',
    name: 'Pagination Bar',
    description: 'Previous control, page numbers, and next control distributed across the row',
    previewWidth: 360,
    previewHeight: 44,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 12,
      minHeight: 44,
      padding: 12,
    },
    items: [
      { label: '← Prev', width: 64, height: 32 },
      { label: '1 · 2 · 3', width: 96, height: 32 },
      { label: 'Next →', width: 64, height: 32 },
    ],
  },
  {
    id: 'breadcrumb-bar',
    name: 'Breadcrumb Bar',
    description: 'Inline breadcrumb trail for nested page navigation',
    previewWidth: 360,
    previewHeight: 40,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 8,
      minHeight: 40,
      padding: 8,
    },
    items: [
      { label: 'Home', width: 48, height: 24 },
      { label: '/', width: 12, height: 24 },
      { label: 'Projects', width: 56, height: 24 },
      { label: '/', width: 12, height: 24 },
      { label: 'Billing', width: 48, height: 24 },
    ],
  },
  {
    id: 'pricing-cards',
    name: 'Pricing Cards',
    description: 'Tier cards in a row with a highlighted plan centered in the layout',
    previewWidth: 400,
    previewHeight: 200,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 12,
      minHeight: 200,
      padding: 12,
    },
    items: [
      { label: 'Starter', width: 100, height: 160, flexGrow: 1, flexBasis: '100px' },
      { label: 'Pro', width: 110, height: 180, flexGrow: 1, flexBasis: '110px', alignSelf: 'center' },
      { label: 'Enterprise', width: 100, height: 160, flexGrow: 1, flexBasis: '100px' },
    ],
  },
  {
    id: 'kpi-stats-row',
    name: 'KPI Stats Row',
    description: 'Dashboard metric tiles that grow evenly across the available width',
    previewWidth: 400,
    previewHeight: 96,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 12,
      minHeight: 96,
      padding: 12,
    },
    items: [
      { label: 'Users', flexGrow: 1, flexBasis: '0', height: 72 },
      { label: 'MRR', flexGrow: 1, flexBasis: '0', height: 72 },
      { label: 'Churn', flexGrow: 1, flexBasis: '0', height: 72 },
      { label: 'NPS', flexGrow: 1, flexBasis: '0', height: 72 },
    ],
  },
  {
    id: 'chat-thread',
    name: 'Chat Thread',
    description: 'Vertical stack of message bubbles in a conversation panel',
    previewWidth: 320,
    previewHeight: 260,
    container: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-end',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 10,
      minHeight: 260,
      padding: 12,
    },
    items: [
      { label: 'Hey, are we shipping today?', height: 40, alignSelf: 'flex-start', width: 200 },
      { label: 'Yes — release is at 5 PM', height: 40, alignSelf: 'flex-end', width: 180 },
      { label: 'Great, I will prep the changelog', height: 40, alignSelf: 'flex-start', width: 210 },
    ],
  },
  {
    id: 'kanban-board',
    name: 'Kanban Board',
    description: 'Horizontal columns for todo, in progress, and done workflow stages',
    previewWidth: 420,
    previewHeight: 200,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch',
      gap: 12,
      minHeight: 200,
      padding: 12,
    },
    items: [
      { label: 'Todo', flexGrow: 1, flexBasis: '0', minHeight: 160 },
      { label: 'In Progress', flexGrow: 1, flexBasis: '0', minHeight: 160 },
      { label: 'Done', flexGrow: 1, flexBasis: '0', minHeight: 160 },
    ],
  },
  {
    id: 'modal-centered',
    name: 'Centered Modal',
    description: 'Dialog or empty-state card centered inside a full overlay region',
    previewWidth: 360,
    previewHeight: 240,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 0,
      minHeight: 240,
      padding: 16,
    },
    items: [{ label: 'Confirm delete?', width: 200, height: 120 }],
  },
  {
    id: 'list-item-row',
    name: 'List Item Row',
    description: 'Icon, primary content, and trailing action aligned in a list row',
    previewWidth: 400,
    previewHeight: 56,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 12,
      minHeight: 56,
      padding: 12,
    },
    items: [
      { label: 'Icon', width: 36, height: 36, flexShrink: 0 },
      { label: 'Invoice #1042 — Paid', flexGrow: 1, flexShrink: 1, flexBasis: '0', height: 36 },
      { label: 'View', width: 52, height: 32, flexShrink: 0 },
    ],
  },
  {
    id: 'file-dropzone',
    name: 'File Dropzone',
    description: 'Upload target centered inside a dashed drop area',
    previewWidth: 360,
    previewHeight: 180,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 0,
      minHeight: 180,
      padding: 16,
    },
    items: [{ label: 'Drop files here or browse', width: 240, height: 80 }],
  },
  {
    id: 'tab-bar',
    name: 'Tab Bar',
    description: 'Evenly distributed tabs across the full width of a section header',
    previewWidth: 360,
    previewHeight: 44,
    container: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      alignContent: 'stretch',
      gap: 8,
      minHeight: 48,
      padding: 8,
    },
    items: [
      { label: 'Overview', flexGrow: 1, height: 32 },
      { label: 'Analytics', flexGrow: 1, height: 32 },
      { label: 'Settings', flexGrow: 1, height: 32 },
    ],
  },
];
