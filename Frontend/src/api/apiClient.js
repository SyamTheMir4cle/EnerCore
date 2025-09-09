import axios from 'axios';
import toast from 'react-hot-toast'; // Impor toast untuk notifikasi

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const { data } = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });

        localStorage.setItem('access_token', data.access);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error("Gagal memperbarui token:", refreshError);
        
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        setTimeout(() => {
            window.location.href = '/login';
        }, 1500); 
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

