import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home';

let router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
