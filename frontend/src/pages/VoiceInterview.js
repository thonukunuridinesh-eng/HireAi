import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Mic, MicOff, AlertCircle, Award, Keyboard, CheckCircle } from 'lucide-react';

const VoiceInterview = () => {
  const currentQuestion = "Explain the difference between a list and a tuple in Python, and when you would use each.";
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [useTextFallback, setUseTextFallback] = useState(false); // Fallback toggle state

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const currentResultIndex = event.results.length - 1;
        const spokenText = event.results[currentResultIndex].transcript;
        setTranscript((prev) => (prev + ' ' + spokenText).trim());
      };

      // FIXED: Catches and cleanly manages cloud network dropouts safely
      rec.onerror = (e) => {
        console.error("Speech Recognition Engine Exception Caught: ", e.error);
        setIsListening(false);

        if (e.error === 'network') {
          setError("Network Drop Detected! Google Cloud speech engines lost sync. Feel free to re-trigger the microphone or toggle the manual typing fallback layout below.");
        } else if (e.error === 'not-allowed') {
          setError("Microphone Access Denied! Please click the lock icon in your browser URL address bar and update settings to 'Allow'.");
        } else if (e.error === 'no-speech') {
          setError("No speech detected. The microphone timed out due to silence. Try speaking again!");
        } else {
          setError(`Microphone connection problem: ${e.error}`);
        }
      };

      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    } else {
      setError("Speech recognition engine is completely unsupported inside this web browser. Please use Google Chrome.");
      setUseTextFallback(true); // Automatically enables text fallback for non-Chrome browsers
    }
  }, []);

  const toggleListening = () => {
    setError('');
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      setEvaluation('');
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Mic initialization crashed: ", e);
      }
    }
  };

  const submitVoiceAnswer = async () => {
    setError('');
    if (!transcript || transcript.trim().length < 5) {
      setError('Validation Error: Your answer input is currently empty. Provide a response before submitting.');
      return;
    }

    setLoading(true);
    setEvaluation('');
    const token = localStorage.getItem('access_token');

    try {
      const response = await axios.post('http://localhost:8000/api/interview/evaluate-audio/', {
        question: currentQuestion,
        answer: transcript.trim()
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEvaluation(response.data.evaluation);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Server validation rejected. Verify your Django terminal is active and listening.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 md:p-10 mt-10 bg-white dark:bg-zinc-950 rounded-xl shadow-md border border-gray-100 dark:border-zinc-800">
        <h1 className="text-3xl font-black tracking-tight">Voice Simulator Practice</h1>
        
        <div className="mt-6 p-5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800">
          <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">Active Question:</span>
          <p className="text-lg font-semibold mt-1 text-gray-800 dark:text-gray-200">{currentQuestion}</p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md text-sm flex items-center gap-2 font-semibold">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* CONDITION-BASED CONTENT INPUT WRAPPER */}
        {!useTextFallback ? (
          <div className="flex flex-col items-center my-10 gap-4">
            <button
              onClick={toggleListening}
              type="button"
              className={`p-6 rounded-full transition-all duration-300 shadow-lg ${
                isListening ? 'bg-red-500 text-white animate-pulse scale-105' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
            <span className="text-sm font-bold text-gray-500 tracking-wide uppercase">
              {isListening ? 'Recording Active... Click to pause input.' : 'Click mic to record your voice answer'}
            </span>
          </div>
        ) : (
          <div className="mt-6">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Manual Response Workspace:</label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Type your response explanation directly here..."
              className="w-full h-32 p-3 border dark:border-zinc-700 rounded-md bg-transparent text-gray-800 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white outline-none resize-none transition"
            />
          </div>
        )}

        {/* SHOW TRANSCRIPT BLOCK ONLY IF USING VOICE METHOD */}
        {transcript && !useTextFallback && (
          <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg border border-dashed dark:border-zinc-700 min-h-24">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Live Audio Transcript Box:</h4>
            <p className="italic text-gray-700 dark:text-zinc-300 leading-relaxed">{transcript}</p>
          </div>
        )}

        {/* SUBMISSION CONTROL PANEL AND FALLBACK TOGGLER */}
        <div className="mt-6 space-y-4">
          {transcript && !isListening && (
            <button
              onClick={submitVoiceAnswer}
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-md font-bold hover:bg-blue-700 transition disabled:bg-gray-400 shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{loading ? 'Evaluating Response Metrics...' : 'Submit Answer For Validation'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setUseTextFallback(!useTextFallback);
              setError('');
            }}
            className="w-full text-xs font-bold tracking-wide uppercase text-gray-400 dark:text-zinc-500 hover:text-black dark:hover:text-white flex items-center justify-center gap-1.5 py-1 transition"
          >
            <Keyboard className="w-4 h-4" />
            <span>{useTextFallback ? "Switch Back To Microphone Input Engine" : "Switch To Manual Text Typing Fallback"}</span>
          </button>
        </div>

        {evaluation && (
          <div className="mt-10 p-6 bg-zinc-900 text-green-400 rounded-xl font-mono shadow-inner border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 dark:border-zinc-800 pb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>HireAI Grading Evaluation Matrix:</span>
            </h3>
            <div className="whitespace-pre-wrap leading-relaxed text-sm">{evaluation}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInterview;



