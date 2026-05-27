import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all your page components safely
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';       
import Register from './pages/Register'; 
import OtpVerify from './pages/OtpVerify';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import VoiceInterview from './pages/VoiceInterview';
import TextInterview from './pages/TextInterview';
import ResumeUpload from './pages/ResumeUpload';
import CodingSandbox from './pages/CodingSandbox';


// FIXED: Imported your global floating AI Companion Assistant component
import AiBot from './components/AiBot'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Core Auth & Landing Flows */}
        <Route path='/' element={<Home />} />
        <Route path='/verify-email' element={<OtpVerify />} />
        <Route path='/register' element={<Register />} /> 
        <Route path='/login' element={<Login />} />       
        
        {/* Advanced Features Workspace Portals */}
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/resume-upload' element={<ResumeUpload />} />
        <Route path='/interview' element={<Interview />} />
        <Route path='/voice-interview' element={<VoiceInterview />} />
        <Route path='/text-interview' element={<TextInterview />} />
        <Route path='/coding-arena' element={<CodingSandbox />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path='/resume-upload' element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
<Route path='/interview' element={<ProtectedRoute><Interview /></ProtectedRoute>} />
<Route path='/voice-interview' element={<ProtectedRoute><VoiceInterview /></ProtectedRoute>} />
<Route path='/text-interview' element={<ProtectedRoute><TextInterview /></ProtectedRoute>} />
<Route path='/coding-arena' element={<ProtectedRoute><CodingSandbox /></ProtectedRoute>} />
      
      </Routes>

      {/* FIXED: Mounted the global floating bot container node right here at the root level */}
      <AiBot />
    </BrowserRouter>
  );
}

export default App;







