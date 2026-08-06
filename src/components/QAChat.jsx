import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchQAMessages, sendQAMessage } from '../lib/ai';

export const QAChat = ({ report, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const messagesEndRef = useRef(null);

  const reportId = report?.id || 'rep-001';

  const loadChat = async () => {
    setFetching(true);
    try {
      const msgs = await fetchQAMessages(reportId);
      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load QA chat", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadChat();
  }, [reportId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    setInputMessage('');
    setLoading(true);

    try {
      const updatedMsgs = await sendQAMessage(reportId, userId, text, report);
      setMessages(updatedMsgs);
    } catch (err) {
      console.error("Error sending Q&A message", err);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = [
    "What does high LDL Cholesterol mean for my health?",
    "Should I be concerned about my Ferritin level?",
    "How do these results compare to normal ranges?",
    "What lifestyle changes can improve my score?"
  ];

  return (
    <div className="medical-card flex flex-col h-[600px]">
      
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Report Assistant Q&A
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-500">Grounded exclusively in {report?.title || 'this lab report'}</p>
          </div>
        </div>

        <button
          onClick={loadChat}
          title="Refresh conversation"
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-brand-50/40 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-600" /> Prompts:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="text-xs font-medium bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 hover:border-brand-300 px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs transition-colors shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
        {fetching ? (
          <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" /> Loading report context...
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id || msg.created_at}
              className={`flex items-start space-x-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-card ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-br-none font-medium'
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none leading-relaxed'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.message}</p>
                <span
                  className={`text-[10px] block mt-1 ${
                    msg.role === 'user' ? 'text-brand-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 text-xs text-slate-500 flex items-center space-x-2 shadow-card">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
              <span>Analyzing lab context & drafting plain response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask anything about your lab values or findings..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className={`p-2.5 rounded-xl text-white shadow-sm transition-all ${
              inputMessage.trim() && !loading
                ? 'bg-brand-600 hover:bg-brand-700 cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3 text-slate-400" /> Grounded in lab report data. Educational tool — not medical advice.
        </p>
      </div>

    </div>
  );
};
