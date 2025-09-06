// src/App.jsx
import React from 'react';
import Login from './pages/Login'; // Impor komponen Login
import './index.css'; // Impor file CSS Tailwind
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div >
      {/* Untuk saat ini kita langsung tampilkan halaman Login */}
      <Toaster position="top-right" reverseOrder={false} />
      <Login />
    </div>
  );
}

export default App;