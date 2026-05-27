import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Bot, Terminal } from 'lucide-react';

const AiBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm your HireAI career coach helper. Ask me anything about interviews or resumes!", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { text: userText, sender: 'user' }]);
    setInput('');
    setLoading(true);

   const token = localStorage.getItem('access_token');

try {
  const response = await axios.post('http://localhost:8000/api/interview/bot-chat/', 
    { message: userText },
    { 
      headers: { 
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      } 
    }
  );
  setMessages((prev) => [...prev, { text: response.data.reply, sender: 'bot' }]);
} catch (err) {
      setMessages((prev) => [...prev, { text: "Connection error: Make sure your Daphne backend server terminal is active.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-black dark:text-white">
      {/* FLOATING ACTION TOGGLE TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center border border-zinc-800 dark:border-zinc-200"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* CHATBOX PORTAL UI CONTAINER LAYOUT */}
      {isOpen && (
        <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 w-80 md:w-96 h-[450px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* BOT HEADER COMPONENT */}
          <div className="p-4 bg-zinc-900 text-white flex justify-between items-center border-b dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="font-bold text-sm tracking-tight">HireAI Companion</h4>
                <p className="text-[10px] text-zinc-400 font-mono">ONLINE // SYSTEM_ACTIVE</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* MESSAGES SCROLL INTERFACES CONTAINER */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 dark:bg-zinc-900/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3.5 py-2 rounded-xl text-xs leading-relaxed shadow-sm border ${
                  msg.sender === 'user' 
                    ? 'bg-black text-white dark:bg-white dark:text-black font-semibold rounded-tr-none border-black dark:border-white' 
                    : 'bg-white dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 rounded-tl-none border-gray-100 dark:border-zinc-800'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white dark:bg-zinc-950 border dark:border-zinc-800 px-4 py-2 rounded-xl rounded-tl-none text-zinc-400 text-xs font-mono flex items-center gap-1">
                  <Terminal className="w-3 h-3 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT FORM DISPATCH SYSTEM ELEMENT */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-zinc-950 border-t dark:border-zinc-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask HireAI Bot a question..."
              className="flex-1 p-2 border dark:border-zinc-800 bg-transparent text-xs rounded-lg outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
            />
            <button type="submit" disabled={!input.trim() || loading} className="bg-black dark:bg-white text-white dark:text-black px-3 rounded-lg flex items-center justify-center hover:opacity-90 transition disabled:opacity-30">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiBot;
