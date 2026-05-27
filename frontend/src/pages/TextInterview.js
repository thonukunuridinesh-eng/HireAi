import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Award, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

const TextInterview = () => {
  const currentQuestion = "Explain how decorators work in Python, what problem they solve, and provide a quick syntax architecture example.";
  
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!answer.trim() || answer.trim().length < 10) {
      setError('Validation Error: Your input is too short to cross-check structural metrics logic.');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    const token = localStorage.getItem('access_token');

    try {
      const response = await axios.post('http://localhost:8000/api/interview/evaluate-text/', {
        question: currentQuestion,
        answer: answer.trim()
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Connection dropped. Ensure your Daphne server is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 md:p-10 mt-6">
        <header className="mb-6">
          <h1 className="text-3xl font-black tracking-tight">AI Sandbox Text Assessment</h1>
          <p className="text-sm text-gray-500 mt-1">Submit technical text descriptions to compile multi-factor score reports.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT SIDE PANEL WORKSPACE FORM ENTRY PATH */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border dark:border-zinc-800">
              <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">Active Question:</span>
              <p className="text-base font-semibold mt-1 leading-relaxed text-gray-800 dark:text-gray-200">{currentQuestion}</p>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Your Answer Input Core Block:</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type out your technical explanation details here..."
                  className="w-full h-48 p-4 border dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-lg text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition font-mono resize-none shadow-sm"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black p-3 rounded-lg font-bold hover:opacity-90 disabled:bg-gray-400 flex items-center justify-center gap-2 transition"
              >
                {loading && <Cpu className="w-4 h-4 animate-spin" />}
                <span>{loading ? 'Compiling AI Response Score Matrix...' : 'Submit Response for Analysis'}</span>
              </button>
            </form>
          </div>

          {/* RIGHT SIDE SCORES REPORT GENERATOR MATRIX CANVAS VIEW PANEL */}
          <div className="space-y-6">
            {report ? (
              <div className="bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl p-5 shadow-md space-y-6 animate-fade-in">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 border-b dark:border-zinc-800 pb-2">🎯 AI Evaluation Metrics:</h3>
                
                {/* METRIC ROW 1 VALUE PLOT CIRCLES SLIDERS */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Overall Score Balance:</span>
                    <span className="text-blue-600">{report.overall_score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all" style={{ width: `${report.overall_score}%` }}></div>
                  </div>
                </div>

                {/* METRIC ROW 2 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Technical Accuracy Index:</span>
                    <span className="text-green-500">{report.tech_score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all" style={{ width: `${report.tech_score}%` }}></div>
                  </div>
                </div>

                {/* METRIC ROW 3 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Communication Eloquence Rating:</span>
                    <span className="text-amber-500">{report.comm_score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all" style={{ width: `${report.comm_score}%` }}></div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg text-xs leading-relaxed text-gray-700 dark:text-zinc-300 font-mono whitespace-pre-wrap border dark:border-zinc-800">
                  <h4 className="font-bold mb-2 text-black dark:text-white uppercase flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Critique Points Report:</span>
                  </h4>
                  {report.feedback}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl p-8 border-dashed text-center text-xs text-gray-400 flex flex-col items-center justify-center h-[350px] space-y-2">
                <CheckCircle className="w-8 h-8 opacity-20" />
                <span>Submit an answer to display the live feedback scorecard metric layout canvas.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInterview;
