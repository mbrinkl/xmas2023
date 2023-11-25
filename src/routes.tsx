import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Challenge1 } from './components/Challenge1';
import { Challenge2 } from './components/Challenge2';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/c1',
    element: <Challenge1 />,
  },
  {
    path: '/c2',
    element: <Challenge2 />,
  },
]);
