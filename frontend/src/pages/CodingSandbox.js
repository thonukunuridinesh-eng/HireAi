import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import { Play, Terminal, ShieldAlert, CheckCircle, RefreshCw, Cpu } from 'lucide-react';

const CodingSandbox = () => {
  const challengeQuestion = {
    title: "Two Sum Target Match",
    description: "Write a Python function named `find_sum(nums, target)` that returns the indices of the two numbers such that they add up to the specific target.",
    starterCode: `def find_sum(nums, target):\n    # Write your Python 3 code here\n    return (0, 1)\n\n# Test your function output\nprint(find_sum([2, 7, 11, 15], 9))`
  };

  const [code, setCode] = useState(challengeQuestion.starterCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState('');

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResult('');

    try {
      // FIXED: Swapped external links out to safely query your backend proxy view route instead
      const response = await fetch('http://localhost:8000/api/interview/execute-code/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code })
      });

      const data = await response.json();

      if (data.run) {
        const consoleOutput = data.run.output || data.run.stderr || 'Code executed successfully with zero terminal outputs.';
        setOutput(consoleOutput);
        
        // Tests output values to update status metrics flags badge dynamically
        if (consoleOutput.includes('(0, 1)')) {
          setTestResult('passed');
        } else {
          setTestResult('failed');
        }
      } else if (data.error) {
        setOutput(data.error);
        setTestResult('failed');
      } else {
        setOutput('Compilation Error: Connection to backend compilation service timed out.');
        setTestResult('failed');
      }
    } catch (err) {
      console.error("Local sandbox connection error trace: ", err);
      setOutput('Execution Error: Cannot link to local Django backend compiler proxy.');
      setTestResult('failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 md:p-10">
          <header className="mb-6">
            <h1 className="text-3xl font-black tracking-tight">Interactive Coding Arena</h1>
            <p className="text-sm text-gray-500 mt-1">Solve algorithmic challenges with real-time in-browser compilation feedbacks.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* LEFT WORKSPACE PANEL */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">Algorithmic Challenge:</span>
                <h3 className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{challengeQuestion.title}</h3>
                <p className="text-sm mt-2 leading-relaxed text-gray-600 dark:text-zinc-400">{challengeQuestion.description}</p>
              </div>

              <div className="flex flex-col border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-zinc-950 text-white font-mono">
                <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
                  <span>solution_workspace.py</span>
                  <button 
                    onClick={() => setCode(challengeQuestion.starterCode)}
                    className="hover:text-white flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Starter Code</span>
                  </button>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-80 p-4 bg-zinc-950 text-zinc-100 outline-none text-sm resize-none font-mono leading-relaxed"
                  spellCheck="false"
                />
              </div>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:bg-gray-400 transition"
              >
                {isRunning ? <Cpu className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Compiling Code Vectors...' : 'Execute & Run Code'}</span>
              </button>
            </div>

            {/* RIGHT TERMINAL LOG CONSOLE PANEL */}
            <div className="space-y-6">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl h-[475px] flex flex-col shadow-lg">
                <div className="p-4 border-b border-zinc-900 bg-zinc-900/50 rounded-t-xl flex items-center justify-between font-mono text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-green-500" />
                    <span>SYSTEM_OUTPUT_LOG</span>
                  </div>
                  {testResult === 'passed' && (
                    <span className="text-green-400 bg-green-950/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Test Case Passed
                    </span>
                  )}
                  {testResult === 'failed' && (
                    <span className="text-red-400 bg-red-950/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Output Mismatch
                    </span>
                  )}
                </div>

                <div className="flex-1 p-6 overflow-y-auto font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {output ? output : (
                    <span className="text-zinc-600 italic text-xs">Click "Execute & Run Code" to compile your solution matrix parameters inside the container sandbox module.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CodingSandbox;


