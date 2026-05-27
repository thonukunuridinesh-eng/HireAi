import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/auth/login/', {
        username: formData.username,
        password: formData.password
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // FIXED: Redirects directly to the resume upload page upon successful authentication
      navigate('/resume-upload'); 
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Invalid username or password configuration.');
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-zinc-900">
        <form onSubmit={handleLogin} className="bg-white dark:bg-zinc-950 p-8 rounded shadow-md w-96 -mt-32 border dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login to HireAI</h2>
          {error && <p className="mb-4 text-sm text-center font-semibold text-red-500 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
          
          <div className="mb-4">
            <input 
              type="text" placeholder="Username" value={formData.username}
              className="w-full p-2 border rounded bg-transparent dark:text-white focus:ring-2 focus:ring-black" required
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
            />
          </div>
          <div className="mb-6">
            <input 
              type="password" placeholder="Password" value={formData.password}
              className="w-full p-2 border rounded bg-transparent dark:text-white focus:ring-2 focus:ring-black" required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
          </div>
          <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-2.5 rounded hover:bg-gray-800 transition font-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
