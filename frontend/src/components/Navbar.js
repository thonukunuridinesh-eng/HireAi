import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, BarChart2, FileText, Video, Mic, Code, Terminal } from 'lucide-react';

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className='bg-white dark:bg-zinc-950 text-black dark:text-white p-4 flex justify-between items-center shadow-sm border-b border-gray-100 dark:border-zinc-800 transition-colors duration-200'>
      <Link to="/" className='text-2xl font-black tracking-tight hover:text-gray-600 dark:hover:text-gray-300'>
        HireAI
      </Link>

      <div className='flex items-center space-x-6'>
        {/* NAV ROUTE LINKS SECTION (UPDATED) */}
        <div className='hidden md:flex items-center space-x-5'>
          <Link to="/resume-upload" className='text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1'>
            <FileText className="w-4 h-4" />
            <span>ATS Scanner</span>
          </Link>
          <Link to="/interview" className='text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1'>
            <Video className="w-4 h-4" />
            <span>AI Interview</span>
          </Link>
          <Link to="/voice-interview" className='text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1'>
            <Mic className="w-4 h-4 text-blue-500" />
            <span>Voice Interview</span>
          </Link>
          <Link to="/text-interview" className='text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1'>
            <Code className="w-4 h-4 text-purple-500" />
            <span>Text Sandbox</span>
          </Link>
          {/* FIXED: Added explicit navigation link for your browser compiler coding sandbox */}
          <Link to="/coding-arena" className='text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1'>
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span>Coding Arena</span>
          </Link>
          <Link to="/dashboard" className='text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1'>
            <BarChart2 className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Dark Mode Theme Button */}
        <button onClick={toggleTheme} className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none'>
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        {/* Session Auth Switcher Buttons */}
        <div className='space-x-4 flex items-center'>
          {!isAuthenticated ? (
            <>
              <Link to="/verify-email" className='text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300'>Login</Link>
              <Link to="/verify-email" className='bg-black dark:bg-white text-white dark:text-black text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all'>Register</Link>
            </>
          ) : (
            <button onClick={handleLogout} className='flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-950/40 transition-all'>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;


