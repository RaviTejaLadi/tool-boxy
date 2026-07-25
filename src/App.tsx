import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import CodeSnippetPage from './pages/CodeSnippetPage';
import Home from './pages/Home';
import PaletteCollectionPage from './pages/PaletteCollectionPage';
import PaletteGeneratorPage from './pages/PaletteGeneratorPage';
import TailwindShadeGeneratorPage from './pages/TailwindShadeGeneratorPage';
import MarkdownLivePreviewPage from './pages/MarkdownLivePreviewPage';
import PlaceholderGeneratorPage from './pages/PlaceholderGeneratorPage';
import Base64ImageEncoderPage from './pages/Base64ImageEncoderPage';
import FaviconGeneratorPage from './pages/FaviconGeneratorPage';
import ImageConverterPage from './pages/ImageConverterPage';
import ImageSplitterPage from './pages/ImageSplitterPage';
import BaseConverterPage from './pages/BaseConverterPage';
import UnitConverterPage from './pages/UnitConverterPage';
import PDFViewerPage from './pages/PDFViewerPage';
import SVGViewerPage from './pages/SVGViewerPage';
import JSONViewerPage from './pages/JSONViewerPage';
import HTMLViewerPage from './pages/HTMLViewerPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: 'code-snippet', Component: CodeSnippetPage },
      { path: 'palette-collection', Component: PaletteCollectionPage },
      { path: 'palette-generator', Component: PaletteGeneratorPage },
      { path: 'tailwind-shade-generator', Component: TailwindShadeGeneratorPage },
      { path: 'markdown-live-preview', Component: MarkdownLivePreviewPage },
      { path: 'placeholder-generator', Component: PlaceholderGeneratorPage },
      { path: 'base64-image-encoder', Component: Base64ImageEncoderPage },
      { path: 'favicon-generator', Component: FaviconGeneratorPage },
      { path: 'image-converter', Component: ImageConverterPage },
      { path: 'image-splitter', Component: ImageSplitterPage },
      { path: 'base-converter', Component: BaseConverterPage },
      { path: 'unit-converter', Component: UnitConverterPage },
      { path: 'pdf-viewer', Component: PDFViewerPage },
      { path: 'svg-viewer', Component: SVGViewerPage },
      { path: 'json-viewer', Component: JSONViewerPage },
      { path: 'html-viewer', Component: HTMLViewerPage },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
