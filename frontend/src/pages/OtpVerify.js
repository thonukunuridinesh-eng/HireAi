import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Mail, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

const OtpVerify = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Input Email, Step 2: Input 6-Digit OTP
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/request-otp/', { email: email.trim() });
      setMessage(response.data.message);
      setStep(2); // Move user to OTP input view layout screen
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.error || 'Failed to request OTP. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth/verify-otp/', {
        email: email.trim(),
        otp: otp.trim()
      });
      setIsError(false);
      setMessage(response.data.message);
      
      // Save verification state token flags parameter keys locally
      localStorage.setItem('email_verified', 'true');
      localStorage.setItem('verified_email_address', email.trim());

      // Redirect user directly over to clean profile registration form workspace panel after 1.5s
      setTimeout(() => navigate('/register'), 1500);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.error || 'Invalid passcode token matrix mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <Navbar />
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="bg-white dark:bg-zinc-950 p-8 rounded-xl shadow-md w-96 border border-gray-100 dark:border-zinc-800 animate-fade-in">
          <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900 dark:text-white tracking-tight">Identity Verifier</h2>
          <p className="text-sm text-center text-gray-500 dark:text-zinc-400 mb-6">Secure your HireAI session with two-factor email OTP validation.</p>

          {message && (
            <div className={`mb-4 p-3 rounded-md text-xs font-semibold border flex items-center gap-2 ${
              isError ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900' : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900'
            }`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    className="w-full pl-10 p-2.5 border dark:border-zinc-800 bg-transparent rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-sm transition" 
                    required
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-black dark:bg-white text-white dark:text-black p-2.5 rounded-lg font-bold hover:opacity-90 transition flex items-center justify-center gap-2">
                <span>{loading ? 'Emitting Token...' : 'Send Verification Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">6-Digit Passcode</label>
                <div className="relative">
                  <ShieldCheck className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    maxLength={6}
                    placeholder="Enter 6-digit number" 
                    value={otp}
                    className="w-full pl-10 p-2.5 border dark:border-zinc-800 bg-transparent rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white outline-none tracking-widest text-center font-bold font-mono text-lg transition" 
                    required
                    onChange={(e) => setOtp(e.target.value)} 
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-bold hover:bg-blue-700 transition">
                {loading ? 'Validating Token Parameters...' : 'Verify Secure Code'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerify;
