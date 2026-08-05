import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { RouteErrorBoundary } from './components/ErrorBoundary';
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
import ImageStitcherPage from './pages/ImageStitcherPage';
import BaseConverterPage from './pages/BaseConverterPage';
import UnitConverterPage from './pages/UnitConverterPage';
import PDFViewerPage from './pages/PDFViewerPage';
import SVGViewerPage from './pages/SVGViewerPage';
import JSONViewerPage from './pages/JSONViewerPage';
import CSVViewerPage from './pages/CSVViewerPage';
import CodeViewerPage from './pages/CodeViewerPage';
import HTMLViewerPage from './pages/HTMLViewerPage';
import JWTDecoderPage from './pages/JWTDecoderPage';
import UUIDGeneratorPage from './pages/UUIDGeneratorPage';
import PasswordGeneratorPage from './pages/PasswordGeneratorPage';
import LoremIpsumGeneratorPage from './pages/LoremIpsumGeneratorPage';
import QRCodeGeneratorPage from './pages/QRCodeGeneratorPage';
import ASCIIArtGeneratorPage from './pages/ASCIIArtGeneratorPage';
import WordCounterPage from './pages/WordCounterPage';
import TypographyCalculatorPage from './pages/TypographyCalculatorPage';
import WorldScriptsPage from './pages/WorldScriptsPage';
import GlyphBrowserPage from './pages/GlyphBrowserPage';
import ColourConverterPage from './pages/ColourConverterPage';
import ContrastCheckerPage from './pages/ContrastCheckerPage';
import GradientGeneratorPage from './pages/GradientGeneratorPage';
import MetaTagGeneratorPage from './pages/MetaTagGeneratorPage';
import BorderRadiusGeneratorPage from './pages/BorderRadiusGeneratorPage';
import GlassmorphismGeneratorPage from './pages/GlassmorphismGeneratorPage';
import AnimationGeneratorPage from './pages/AnimationGeneratorPage';
import FlexPatternsPage from './pages/FlexPatternsPage';
import PostComposerPage from './pages/PostComposerPage';
import ImageAnnotatorPage from './pages/ImageAnnotatorPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, Component: Home },
      { path: 'code-snippet', Component: CodeSnippetPage },
      { path: 'post-composer', Component: PostComposerPage },
      { path: 'image-annotator', Component: ImageAnnotatorPage },
      { path: 'palette-collection', Component: PaletteCollectionPage },
      { path: 'palette-generator', Component: PaletteGeneratorPage },
      { path: 'tailwind-shade-generator', Component: TailwindShadeGeneratorPage },
      { path: 'markdown-live-preview', Component: MarkdownLivePreviewPage },
      { path: 'placeholder-generator', Component: PlaceholderGeneratorPage },
      { path: 'base64-image-encoder', Component: Base64ImageEncoderPage },
      { path: 'favicon-generator', Component: FaviconGeneratorPage },
      { path: 'image-converter', Component: ImageConverterPage },
      { path: 'image-splitter', Component: ImageSplitterPage },
      { path: 'image-stitcher', Component: ImageStitcherPage },
      { path: 'base-converter', Component: BaseConverterPage },
      { path: 'unit-converter', Component: UnitConverterPage },
      { path: 'pdf-viewer', Component: PDFViewerPage },
      { path: 'svg-viewer', Component: SVGViewerPage },
      { path: 'json-viewer', Component: JSONViewerPage },
      { path: 'csv-viewer', Component: CSVViewerPage },
      { path: 'code-viewer', Component: CodeViewerPage },
      { path: 'html-viewer', Component: HTMLViewerPage },
      { path: 'jwt-decoder', Component: JWTDecoderPage },
      { path: 'uuid-generator', Component: UUIDGeneratorPage },
      { path: 'password-generator', Component: PasswordGeneratorPage },
      { path: 'lorem-ipsum-generator', Component: LoremIpsumGeneratorPage },
      { path: 'qr-code-generator', Component: QRCodeGeneratorPage },
      { path: 'ascii-art-generator', Component: ASCIIArtGeneratorPage },
      { path: 'word-counter', Component: WordCounterPage },
      { path: 'typography-calculator', Component: TypographyCalculatorPage },
      { path: 'world-scripts', Component: WorldScriptsPage },
      { path: 'glyph-browser', Component: GlyphBrowserPage },
      { path: 'colour-converter', Component: ColourConverterPage },
      { path: 'contrast-checker', Component: ContrastCheckerPage },
      { path: 'gradient-generator', Component: GradientGeneratorPage },
      { path: 'meta-tag-generator', Component: MetaTagGeneratorPage },
      { path: 'border-radius-generator', Component: BorderRadiusGeneratorPage },
      { path: 'glassmorphism-generator', Component: GlassmorphismGeneratorPage },
      { path: 'animation-generator', Component: AnimationGeneratorPage },
      { path: 'flex-patterns', Component: FlexPatternsPage },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
