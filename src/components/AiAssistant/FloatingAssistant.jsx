import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/solid';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const LANGS = [{code:'en',label:'EN'},{code:'hi',label:'हि'},{code:'te',label:'తె'}];

const FloatingAssistant = () => {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role:'assistant', text:'నమస్కారం! Hi! मैं KisanMaithri हूँ। Ask me anything about your farm — soil, crops, diseases, market prices, or government schemes.' }
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang]       = useState('en');
  const [soilCtx, setSoilCtx] = useState(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks   = useRef([]);
  const bottomRef     = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const addMsg = (role, text, guardrails) => setMessages(m => [...m, {role, text, guardrails}]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    addMsg('user', text);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/get-advice`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: text, lang, soil: soilCtx || {} })
      });
      const data = await res.json();
      addMsg('assistant', data.answer, data.guardrails);
    } catch {
      addMsg('assistant', 'Server unreachable. Check backend is running on port 5000.');
    }
    setLoading(false);
  };

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const fd = new FormData(); fd.append('audio', blob, 'rec.webm');
        try {
          const res = await fetch(`${BACKEND}/transcribe`, { method:'POST', body: fd });
          const data = await res.json();
          if (data.transcript) sendMessage(data.transcript);
        } catch { addMsg('assistant', 'Voice transcription failed.'); }
        setRecording(false);
      };
      mediaRecorder.current.start();
      setRecording(true);
    } catch { alert('Microphone access denied.'); }
  };

  const stopVoice = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') mediaRecorder.current.stop();
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed bottom-28 right-6 z-50 w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl flex items-center justify-center"
      >
        {open ? <XMarkIcon className="w-7 h-7" /> : <ChatBubbleLeftRightIcon className="w-7 h-7" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-48 right-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="bg-green-600 p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">🌾 KisanMaithri Assistant</p>
                <p className="text-green-100 text-xs">Multilingual Farm Advisor</p>
              </div>
              <div className="flex gap-1">
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)}
                    className={`px-2 py-0.5 rounded text-xs font-bold ${lang===l.code?'bg-white text-green-700':'text-green-100 hover:bg-green-500'}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${m.role==='user'?'bg-green-600 text-white rounded-br-sm':'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-sm'}`}>
                    {m.text}
                    {m.guardrails?.warnings?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {m.guardrails.warnings.map((w,wi) => (
                          <div key={wi} className="text-xs bg-yellow-100 text-yellow-800 p-2 rounded-lg">{w}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-gray-500">
                    <span className="animate-pulse">KisanMaithri is thinking…</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {['Soil test','Market price','Disease help','Water schedule'].map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="whitespace-nowrap text-xs px-3 py-1 bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-200 rounded-full hover:bg-green-100 dark:hover:bg-green-900/60 flex-shrink-0">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t dark:border-gray-700 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key==='Enter' && sendMessage(input)}
                placeholder={lang==='hi'?'अपना सवाल लिखें...':lang==='te'?'మీ ప్రశ్న లిఖించండి...':'Type your question...'}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm outline-none text-gray-800 dark:text-white"
              />
              <button onClick={() => recording ? stopVoice() : startVoice()}
                className={`p-2 rounded-xl ${recording?'bg-red-500 animate-pulse':'bg-gray-200 dark:bg-gray-700'} text-gray-700 dark:text-gray-200`}>
                <MicrophoneIcon className="w-4 h-4"/>
              </button>
              <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-40">
                <PaperAirplaneIcon className="w-4 h-4"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAssistant;
