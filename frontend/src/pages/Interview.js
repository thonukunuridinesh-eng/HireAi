import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Interview = () => {
  const [skill, setSkill] = useState('');
  const [questions, setQuestions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateQuestions = async () => {
    if (!skill.trim()) {
      setError('Please enter a skill first.');
      return;
    }
    setLoading(true);
    setQuestions('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/interview/generate/', {
        skill: skill.trim()
      });
      setQuestions(response.data.questions);
    } catch (err) {
      setError('Failed to reach the AI engine. Make sure your Django terminal is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added active dark background color handling variables below
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-200">
      <Navbar />
      <div className="max-w-3xl mx-auto p-10 mt-10 bg-white dark:bg-zinc-950 rounded-xl shadow-md border border-gray-100 dark:border-zinc-800">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">AI Interview Generator</h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2">Enter a technical skill to get 10 custom interview questions powered by Gemini AI.</p>

        {error && <p className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md text-sm">{error}</p>}

        <input
          type="text"
          placeholder="e.g. Python, React, SQL"
          className="border dark:border-zinc-700 bg-transparent dark:text-white p-3 mt-6 w-full rounded-md outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          onChange={(e) => setSkill(e.target.value)}
          value={skill}
        />

        <button
          onClick={generateQuestions}
          disabled={loading}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 mt-5 rounded-md hover:bg-gray-800 dark:hover:bg-zinc-200 font-semibold disabled:bg-gray-400 transition w-full"
        >
          {loading ? 'Generating Questions...' : 'Generate'}
        </button>

        {questions && (
          <div className="mt-10 p-6 bg-gray-900 dark:bg-black text-green-400 rounded-lg whitespace-pre-wrap font-mono border border-gray-800 dark:border-zinc-800">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 dark:border-zinc-800 pb-2">🎯 Generated Questions:</h3>
            {questions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;
