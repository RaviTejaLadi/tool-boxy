import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import SamplePage from './pages/SamplePage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      { index: true, Component: Home },
      { path: 'playground', Component: SamplePage },
      { path: 'projects/design', Component: SamplePage },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
