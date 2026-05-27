import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Send, Radio, Terminal } from 'lucide-react';

const LiveInterview = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [status, setStatus] = useState('Connecting to channels...');
  const socketRef = useRef(null);

  useEffect(() => {
    // Open a persistent native browser WebSocket pipe connection stream line
    socketRef.current = new WebSocket('ws://localhost:8000/ws/interview/live/');

    socketRef.current.onopen = () => {
      setStatus('Live Connection Established');
    };

    socketRef.current.onmessage = (event) => {
      // FIXED: Changed lowercase json to uppercase JSON
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, { text: data.message, sender: 'server' }]);
    };

    socketRef.current.onerror = (err) => {
      console.error("Socket error caught:", err);
      setStatus('Connection tracking dropped. Verify backend execution configurations.');
    };

    socketRef.current.onclose = () => {
      setStatus('Socket closed down seamlessly.');
    };

    // Cleanup operation to drop connections hooks cleanly when navigating away
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socketRef.current) return;

    // FIXED: Changed lowercase json to uppercase JSON
    socketRef.current.send(JSON.stringify({ message: inputMessage }));
    
    setMessages((prev) => [...prev, { text: inputMessage, sender: 'client' }]);
    inputMessage && setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 md:p-10 mt-6">
        <header className="mb-6 flex items-center justify-between border-b dark:border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              <Radio className="w-6 h-6 text-red-500 animate-pulse" />
              <span>Real-Time Streaming Room</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Simulated high-concurrency WebSocket messaging channels feed portal.</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${status.includes('Established') ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-amber-100 text-amber-700'}`}>
            {status}
          </span>
        </header>

        {/* MESSAGING CANVAS LAYOUT TERMINAL ENGINE CARD */}
        <div className="bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded-xl h-[450px] flex flex-col shadow-sm">
          <div className="p-4 border-b dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 rounded-t-xl flex items-center gap-2 font-mono text-xs text-gray-400">
            <Terminal className="w-4 h-4" />
            <span>HIREAI_STREAMING_CHANNEL_STREAMS_LOG</span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-sm">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md px-4 py-2.5 rounded-lg shadow-sm border ${msg.sender === 'client' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-zinc-300 dark:border-zinc-800'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-4 border-t dark:border-zinc-800 flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type message packet to emit over standard streaming sockets layer..."
              className="flex-1 p-3 border dark:border-zinc-800 bg-transparent rounded-lg text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
            <button type="submit" className="bg-black dark:bg-white text-white dark:text-black px-5 rounded-lg font-bold flex items-center justify-center hover:opacity-90">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LiveInterview;

