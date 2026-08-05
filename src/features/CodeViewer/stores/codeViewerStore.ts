import { create } from 'zustand';
import { DEFAULT_FONT_SIZE } from '../constants';
import { collectObjectUrls, findFileByPath, type FileNode } from '../helpers';

export type SvgViewMode = 'preview' | 'code';
export type SidebarPanel = 'files' | 'search' | 'insights' | 'findings';

export interface CodeViewerState {
  fileSystem: FileNode | null;
  selectedFile: FileNode | null;
  openTabs: string[];
  folderName: string;
  fileCount: number;
  error: string | null;
  isDragging: boolean;
  isLoading: boolean;
  searchQuery: string;
  grepQuery: string;
  grepCaseSensitive: boolean;
  sidebarPanel: SidebarPanel;
  wordWrap: boolean;
  showLineNumbers: boolean;
  fontSize: number;
  svgViewMode: SvgViewMode;
  mdPreview: boolean;
  highlightLine: number | null;
  setFolder: (payload: {
    fileSystem: FileNode;
    selectedFile: FileNode | null;
    folderName: string;
    fileCount: number;
  }) => void;
  selectFile: (file: FileNode, line?: number | null) => void;
  openPathAtLine: (path: string, line: number) => void;
  closeTab: (path: string) => void;
  setSearchQuery: (searchQuery: string) => void;
  setGrepQuery: (grepQuery: string) => void;
  setGrepCaseSensitive: (grepCaseSensitive: boolean) => void;
  setSidebarPanel: (sidebarPanel: SidebarPanel) => void;
  setWordWrap: (wordWrap: boolean) => void;
  setShowLineNumbers: (showLineNumbers: boolean) => void;
  setFontSize: (fontSize: number) => void;
  setSvgViewMode: (svgViewMode: SvgViewMode) => void;
  setMdPreview: (mdPreview: boolean) => void;
  setHighlightLine: (highlightLine: number | null) => void;
  setError: (error: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  clearAll: () => void;
}

function revokeTreeUrls(fileSystem: FileNode | null) {
  for (const url of collectObjectUrls(fileSystem)) {
    URL.revokeObjectURL(url);
  }
}

export const useCodeViewerStore = create<CodeViewerState>((set, get) => ({
  fileSystem: null,
  selectedFile: null,
  openTabs: [],
  folderName: '',
  fileCount: 0,
  error: null,
  isDragging: false,
  isLoading: false,
  searchQuery: '',
  grepQuery: '',
  grepCaseSensitive: false,
  sidebarPanel: 'files',
  wordWrap: false,
  showLineNumbers: true,
  fontSize: DEFAULT_FONT_SIZE,
  svgViewMode: 'preview',
  mdPreview: true,
  highlightLine: null,

  setFolder: ({ fileSystem, selectedFile, folderName, fileCount }) => {
    revokeTreeUrls(get().fileSystem);
    set({
      fileSystem,
      selectedFile,
      openTabs: selectedFile?.path ? [selectedFile.path] : [],
      folderName,
      fileCount,
      error: null,
      isLoading: false,
      searchQuery: '',
      grepQuery: '',
      sidebarPanel: 'files',
      svgViewMode: 'preview',
      highlightLine: null,
      mdPreview: true,
    });
  },

  selectFile: (file, line = null) =>
    set((state) => {
      const isMd = /\.(md|mdx)$/i.test(file.name);
      return {
        selectedFile: file,
        openTabs: file.path && !state.openTabs.includes(file.path) ? [...state.openTabs, file.path] : state.openTabs,
        svgViewMode: file.kind === 'svg' ? state.svgViewMode : 'preview',
        highlightLine: line ?? null,
        // Jumping to a line always shows source so the highlight is visible
        mdPreview: line ? false : isMd ? state.mdPreview : state.mdPreview,
      };
    }),

  openPathAtLine: (path, line) => {
    const file = findFileByPath(get().fileSystem, path);
    if (file) get().selectFile(file, line);
  },

  closeTab: (path) =>
    set((state) => {
      const openTabs = state.openTabs.filter((tab) => tab !== path);
      if (state.selectedFile?.path !== path) {
        return { openTabs };
      }
      const nextPath = openTabs.at(-1) ?? null;
      const nextFile = nextPath ? findFileByPath(state.fileSystem, nextPath) : null;
      return { openTabs, selectedFile: nextFile, highlightLine: null };
    }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setGrepQuery: (grepQuery) => set({ grepQuery }),
  setGrepCaseSensitive: (grepCaseSensitive) => set({ grepCaseSensitive }),
  setSidebarPanel: (sidebarPanel) => set({ sidebarPanel }),
  setWordWrap: (wordWrap) => set({ wordWrap }),
  setShowLineNumbers: (showLineNumbers) => set({ showLineNumbers }),
  setFontSize: (fontSize) => set({ fontSize }),
  setSvgViewMode: (svgViewMode) => set({ svgViewMode }),
  setMdPreview: (mdPreview) => set({ mdPreview }),
  setHighlightLine: (highlightLine) => set({ highlightLine }),
  setError: (error) => set({ error, isLoading: false }),
  setDragging: (isDragging) => set({ isDragging }),
  setLoading: (isLoading) => set({ isLoading }),

  clearAll: () => {
    revokeTreeUrls(get().fileSystem);
    set({
      fileSystem: null,
      selectedFile: null,
      openTabs: [],
      folderName: '',
      fileCount: 0,
      error: null,
      isDragging: false,
      isLoading: false,
      searchQuery: '',
      grepQuery: '',
      sidebarPanel: 'files',
      svgViewMode: 'preview',
      highlightLine: null,
      mdPreview: true,
    });
  },
}));
