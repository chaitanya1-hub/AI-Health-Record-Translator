import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { sendQAMessage } from '../lib/ai';

export const QAChat = ({ reportId, reportTitle }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello! I am your AI Health Record Assistant grounded in your report "${reportTitle || 'Lab Results'}". Ask me anything about your lab numbers, medical terms, or what to discuss with your physician!`
    }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg = input.trim();
    setInput('');

    const newMessages = [
      ...messages,
      { id: 'user-' + Date.now(), role: 'user', text: userMsg }
    ];
    setMessages(newMessages);
    setSending(true);

    try {
      const reply = await sendQAMessage(reportId, userMsg, newMessages);
      setMessages([
        ...newMessages,
        { id: 'asst-' + Date.now(), role: 'assistant', text: reply }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { id: 'err-' + Date.now(), role: 'assistant', text: "I apologize, but I ran into a network hiccup generating that answer. Please try again!" }
      ]);
    } finally {
      setSending(false);
    }
  };

  const samplePrompts = [
    "What does my LDL cholesterol result mean?",
    "Why is my Ferritin flagged low?",
    "Is my fasting glucose normal?",
    "What foods help improve iron absorption?"
  ];

  return (
    <div className="medical-card p-6 flex flex-col h-[520px] justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Interactive Report Q&A Assistant</h3>
            <p className="text-xs text-slate-500">Ask follow-up questions grounded in your lab values</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Assistant
        </span>
      </div>

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0 mt-0.5 border border-brand-200">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white font-medium rounded-tr-none shadow-xs'
                  : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>

            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs pl-2">
            <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center animate-spin">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>Analyzing report & composing response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      {messages.length < 3 && (
        <div className="py-2 border-t border-slate-100 flex flex-wrap gap-1.5">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInput(prompt)}
              className="text-[11px] bg-slate-50 hover:bg-brand-50 text-slate-600 hover:text-brand-700 px-2.5 py-1 rounded-lg border border-slate-200/70 hover:border-brand-200 transition-all text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSend} className="pt-2 border-t border-slate-100 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your lab results..."
          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
