import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import CodeSnippetPage from './pages/CodeSnippetPage';
import Home from './pages/Home';
import SamplePage from './pages/SamplePage';
import PaletteCollectionPage from './pages/PaletteCollectionPage';
import PaletteGeneratorPage from './pages/PaletteGeneratorPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: 'playground', Component: SamplePage },
      { path: 'code-snippet', Component: CodeSnippetPage },
      { path: 'projects/design', Component: SamplePage },
      { path: 'palette-collection', Component: PaletteCollectionPage },
      { path: 'palette-generator', Component: PaletteGeneratorPage },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
