// src/router/index.jsx
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute'; // 1. Impor ProtectedRoute

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
  },
]);

export default router;