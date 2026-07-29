import { create } from 'zustand';
import { generateMetaTags } from '../helpers';

export interface MetaTagGeneratorState {
  pageTitle: string;
  description: string;
  url: string;
  imageUrl: string;
  siteName: string;
  twitterHandle: string;
  showPreview: boolean;
  copied: boolean;
  setPageTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setUrl: (v: string) => void;
  setImageUrl: (v: string) => void;
  setSiteName: (v: string) => void;
  setTwitterHandle: (v: string) => void;
  togglePreview: () => void;
  copyMetaTags: () => Promise<void>;
  getMetaTags: () => string;
}

export const useMetaTagStore = create<MetaTagGeneratorState>((set, get) => ({
  pageTitle: 'My Awesome Website',
  description: 'A brief description of your page...',
  url: 'https://example.com',
  imageUrl: 'https://example.com/og-image.jpg',
  siteName: 'My Website',
  twitterHandle: '@username',
  showPreview: true,
  copied: false,

  setPageTitle: (pageTitle) => set({ pageTitle }),
  setDescription: (description) => set({ description }),
  setUrl: (url) => set({ url }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setSiteName: (siteName) => set({ siteName }),
  setTwitterHandle: (twitterHandle) => set({ twitterHandle }),
  togglePreview: () => set((s) => ({ showPreview: !s.showPreview })),

  getMetaTags: () => {
    const s = get();
    return generateMetaTags({
      pageTitle: s.pageTitle,
      description: s.description,
      url: s.url,
      imageUrl: s.imageUrl,
      siteName: s.siteName,
      twitterHandle: s.twitterHandle,
    });
  },

  copyMetaTags: async () => {
    const metaTags = get().getMetaTags();
    try {
      await navigator.clipboard.writeText(metaTags);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = metaTags;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    set({ copied: true });
    setTimeout(() => set({ copied: false }), 2000);
  },
}));
