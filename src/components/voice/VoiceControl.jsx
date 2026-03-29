import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, SpeakerWaveIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { useFarmStore } from '../../store/useFarmStore';
import { classifyIntent, INTENTS, getActionFeedback } from '../../utils/intentParser';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const LANGUAGES = [
  { code: 'en-US', name: 'English', label: 'EN' },
  { code: 'hi-IN', name: 'Hindi',   label: 'हि' },
  { code: 'te-IN', name: 'Telugu',  label: 'తె' },
];

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript]   = useState('');
  const [feedback, setFeedback]       = useState('');
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [useWhisper, setUseWhisper]   = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks   = useRef([]);
  const performAction = useFarmStore(s => s.performAction);

  const speak = (text, langCode = 'en-US') => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    let locale = langCode === 'hi' ? 'hi-IN' : langCode === 'te' ? 'te-IN' : langCode === 'en' ? 'en-US' : langCode;
    u.lang = locale;
    const v = window.speechSynthesis.getVoices().find(v => v.lang === locale);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
    setFeedback(text);
    setTimeout(() => setFeedback(''), 4000);
  };

  const processCommand = (text, detectedLang) => {
    setTranscript(text);
    const { intent, lang } = classifyIntent(text);
    if (intent !== INTENTS.UNKNOWN) {
      performAction(intent);
      speak(getActionFeedback(intent, lang), lang);
    } else {
      setFeedback('Asking KisanMaithri...');
      fetch(`${BACKEND}/get-advice`, {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: text, lang: detectedLang || selectedLang.split('-')[0] })
      }).then(r => r.json()).then(d => speak(d.answer, detectedLang || 'en')).catch(() => speak('Could not reach server.', 'en'));
    }
  };

  const startWhisper = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks.current = [];
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const fd = new FormData(); fd.append('audio', blob, 'rec.webm');
        setFeedback('Processing...');
        try {
          const res = await fetch(`${BACKEND}/transcribe`, { method: 'POST', body: fd });
          const data = await res.json();
          if (data.transcript) processCommand(data.transcript, data.language);
          else setFeedback(data.error || 'Try again');
        } catch { setFeedback('Server unreachable'); }
        setIsRecording(false);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
      setFeedback('Recording... tap to send');
    } catch { setFeedback('Mic access denied'); }
  };

  const stopWhisper = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') mediaRecorder.current.stop();
  };

  const startBrowser = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setFeedback('Not supported — enable Whisper mode'); return; }
    const rec = new SR();
    rec.lang = selectedLang; rec.continuous = false; rec.interimResults = false;
    rec.onresult = e => { processCommand(e.results[0][0].transcript, null); setIsListening(false); };
    rec.onerror = () => { setIsListening(false); setFeedback('Try again'); };
    rec.onend = () => setIsListening(false);
    rec.start(); setIsListening(true);
  };

  const handleMic = () => {
    if (useWhisper || !('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      if (isRecording) stopWhisper(); else startWhisper();
    } else {
      startBrowser();
    }
  };

  const active = isListening || isRecording;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-4">
      <AnimatePresence>
        {(transcript || feedback) && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
            className="px-6 py-2 bg-black/80 text-white rounded-full text-sm font-medium backdrop-blur-md border border-white/10 max-w-xs text-center">
            {feedback || `"${transcript}"`}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
        <div className="relative group">
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
            <GlobeAltIcon className="w-5 h-5" />
          </button>
          <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hidden group-hover:block min-w-[130px]">
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setSelectedLang(l.code)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-green-50 dark:hover:bg-green-900/30 ${selectedLang===l.code?'text-green-600 font-bold':'text-gray-600 dark:text-gray-300'}`}>
                {l.name}
              </button>
            ))}
            <hr className="border-gray-200"/>
            <button onClick={() => setUseWhisper(w => !w)}
              className={`w-full px-4 py-2 text-left text-xs ${useWhisper?'text-blue-600 font-bold':'text-gray-500'}`}>
              {useWhisper ? '✅ Whisper ON' : '🎙 Whisper OFF'}
            </button>
          </div>
        </div>
        <motion.button onClick={handleMic} whileHover={{scale:1.1}} whileTap={{scale:0.9}}
          className={`p-4 rounded-full shadow-2xl transition-all ${active?'bg-red-500 animate-pulse ring-4 ring-red-200':'bg-green-600 hover:bg-green-500'}`}>
          {active ? <SpeakerWaveIcon className="w-8 h-8 text-white" /> : <MicrophoneIcon className="w-8 h-8 text-white" />}
        </motion.button>
      </div>
      <span className="text-[10px] font-bold text-white/80 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
        {LANGUAGES.find(l=>l.code===selectedLang)?.label} • {active?'Listening…':'Tap to Speak'}{useWhisper?' • 🎙Whisper':''}
      </span>
    </div>
  );
};

export default VoiceControl;
