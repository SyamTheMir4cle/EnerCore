import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import toast from 'react-hot-toast';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginFormRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(loginFormRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginPromise = axios.post('http://127.0.0.1:8000/api/token/', {
      username: username,
      password: password,
    });

    toast.promise(loginPromise, {
      loading: 'Mencoba masuk...',
      success: (response) => {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        setTimeout(() => {
            window.location.href = '/';
        }, 1000); // Tunggu 1 detik

        return 'Login Berhasil!';
      },
      error: 'Username atau password salah.',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        ref={loginFormRef}
        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-500"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
          Welcome Back
        </h2>

        <p className='text-center text-gray-600 mb-6'>Please log in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... bagian input username dan password tetap sama ... */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input id="username" name="username" type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukkan username Anda"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password Anda"/>
          </div>

          {/* Hapus blok untuk menampilkan error di dalam form */}
          {/* {error && ( ... )} <-- Hapus bagian ini */}
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;