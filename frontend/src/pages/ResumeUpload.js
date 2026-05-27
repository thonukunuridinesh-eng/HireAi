import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [aiReport, setAiReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeId, setResumeId] = useState(null);

  // Polling Effect: Runs only when a resumeId is active and we are waiting for results
  useEffect(() => {
    if (!resumeId) return;

    const token = localStorage.getItem('access_token');
    
    const checkStatus = setInterval(async () => {
      try {
        // Querying the backend detail endpoint for this specific resume instance
        const response = await axios.get(`http://localhost:8000/api/resume/status/${resumeId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // If Celery has finished processing and saved the metrics, stop polling and display them
        if (response.data.ats_score !== null) {
          setAtsScore(response.data.ats_score);
          setAiReport(response.data.ai_analysis);
          setUploadStatus('Analysis complete!');
          setResumeId(null); // Stop polling
          clearInterval(checkStatus);
        }
      } catch (error) {
        console.error("Polling check failed:", error);
      }
    }, 3000); // Check database values every 3 seconds

    return () => clearInterval(checkStatus);
  }, [resumeId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadStatus('Please pick a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setUploadStatus('Uploading document... HireAI will scan it in the background.');
    setAiReport('');
    setAtsScore(null);

    const token = localStorage.getItem('access_token');

    try {
      const response = await axios.post('http://localhost:8000/api/resume/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      
      // Store the newly created resume ID to kickstart our polling check loop
      setResumeId(response.data.id);
      setUploadStatus('File received safely! Processing algorithms running...');
    } catch (error) {
      setUploadStatus('Upload rejected. Verify authentication or server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-16 p-8 bg-white dark:bg-zinc-950 rounded-lg shadow-md border dark:border-zinc-800">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Smart ATS Resume Checker</h2>
        <p className="text-gray-600 dark:text-zinc-400 mb-8">Upload your CV in PDF format to receive instant background AI scoring metrics.</p>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-black dark:hover:border-white transition-colors">
            <input type="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-sm text-gray-500 cursor-pointer" />
          </div>
          <button type="submit" disabled={loading || resumeId} className="w-full bg-black dark:bg-white text-white dark:text-black p-3 rounded font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-400 transition-colors">
            {loading || resumeId ? 'Processing Background Tasks...' : 'Analyze Resume'}
          </button>
        </form>

        {uploadStatus && <p className="mt-6 text-center text-sm font-semibold text-gray-700 dark:text-zinc-300">{uploadStatus}</p>}
        
        {atsScore !== null && (
          <div className="mt-6 p-4 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center animate-fade-in">
            <h4 className="text-xl font-bold text-blue-900 dark:text-blue-300">Base Keyword Match Score: {atsScore} / 100</h4>
          </div>
        )}

        {aiReport && (
          <div className="mt-6 p-6 bg-gray-900 dark:bg-black text-green-400 rounded-lg shadow-inner whitespace-pre-wrap font-mono text-sm leading-relaxed border dark:border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 dark:border-zinc-800 pb-2">🎯 HireAI Scanning Matrix Report:</h3>
            {aiReport}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;

