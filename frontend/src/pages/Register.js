import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { UserCheck, ShieldAlert, Building } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  // Input form tracking states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // Added for role tracking
  const [companyName, setCompanyName] = useState(''); // Added for recruiter metadata
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Strict Verification Guard Block
  useEffect(() => {
    const isVerified = localStorage.getItem('email_verified') === 'true';
    const verifiedEmail = localStorage.getItem('verified_email_address');

    if (!isVerified || !verifiedEmail) {
      // Bounces unverified visitors back to the OTP lock screen automatically
      navigate('/verify-email');
    } else {
      // Locks the form email to the verified address parameter
      setEmail(verifiedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    const payload = {
      username: username.trim(),
      email: email,
      password: password,
      role: role, // Injects user role choice (candidate or recruiter)
      company_name: role === 'recruiter' ? companyName.trim() : '' // Optional recruiter data
    };

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register/', payload);
      
      setMessage(response.data.message || 'Account created successfully! Moving to login...');
      setIsError(false);
      
      // Flush verification tokens from memory upon successful registration completion
      localStorage.removeItem('email_verified');
      localStorage.removeItem('verified_email_address');

      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        const serverErrors = Object.entries(error.response.data)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(' ') : errors}`)
          .join(' | ');
        setMessage(`Server Error -> ${serverErrors}`);
      } else {
        setMessage('Network Error: Cannot connect to Django. Check your server terminal.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96 border border-gray-100 dark:bg-zinc-950 dark:border-zinc-800 animate-fade-in">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900 dark:text-white tracking-tight">Complete Signup</h2>
          <p className="text-xs text-center text-gray-500 dark:text-zinc-400 mb-6 flex items-center justify-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-green-500" />
            <span>Email verification confirmed successfully.</span>
          </p>
          
          {message && (
            <div className={`mb-4 p-3 rounded text-sm font-semibold border ${
              isError ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400' : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400'
            }`}>
              {message}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Username</label>
            <input 
              type="text" placeholder="Enter unique username" value={username} required
              className="w-full p-2.5 border rounded-md dark:border-zinc-800 bg-transparent text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Email Address</label>
            <input 
              type="email" value={email} disabled 
              className="w-full p-2.5 border border-zinc-200 bg-gray-100 rounded-md text-gray-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-500 cursor-not-allowed outline-none text-sm" 
            />
          </div>

          {/* DYNAMIC NEW FEATURE: ROLE SELECTOR DROPDOWN */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Account Type (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 border rounded-md dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition cursor-pointer"
            >
              <option value="candidate">Candidate (Job Seeker Workspace)</option>
              <option value="recruiter">Recruiter (Corporate Review Panel)</option>
            </select>
          </div>

          {/* CONDITIONALLY RENDER COMPANY NAME IF RECRUITER SELECTED */}
          {role === 'recruiter' && (
            <div className="mb-4 animate-fade-in">
              <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Company / Organization</label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input 
                  type="text" placeholder="e.g. Google, Microsoft" value={companyName} required
                  className="w-full pl-9 p-2.5 border rounded-md dark:border-zinc-800 bg-transparent text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
                  onChange={(e) => setCompanyName(e.target.value)} 
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Password</label>
            <input 
              type="password" placeholder="••••••••" value={password} required
              className="w-full p-2.5 border rounded-md dark:border-zinc-800 bg-transparent text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition" 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-black text-white p-2.5 rounded-md font-semibold hover:opacity-90 dark:bg-white dark:text-black disabled:bg-gray-400 transition"
          >
            {loading ? 'Creating Secure Account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;






