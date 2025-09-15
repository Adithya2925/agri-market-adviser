import React, { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { MicIcon, SendIcon } from './Icons';
import { SUPPORTED_LANGUAGES } from '../constants';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0].code);
  const { isListening, transcript, startListening, stopListening, setTranscript, isSupported, error } = useSpeechRecognition(selectedLanguage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);
  
  useEffect(() => {
      // Adjust textarea height based on content
      if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
  }, [text]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
      setTranscript('');
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about markets for your products..."
            disabled={disabled}
            rows={1}
            className="w-full pl-4 pr-12 py-3 rounded-full bg-gray-100 dark:bg-gray-700/60 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none transition-shadow border border-transparent focus:border-emerald-500"
            style={{maxHeight: '150px'}}
          />
          <button
            type="button"
            onClick={handleMicClick}
            disabled={!isSupported}
            title={!isSupported ? "Speech recognition is not supported in your browser." : (isListening ? 'Stop recording' : 'Start recording')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-gray-200 dark:hover:bg-gray-600'} disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-500`}
            aria-label={isListening ? 'Stop recording' : 'Start recording'}
          >
            <MicIcon className="w-5 h-5" />
          </button>
        </div>

       <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        disabled={!isSupported}
        className="bg-gray-100 dark:bg-gray-700/60 border-none rounded-full py-3 pl-3 pr-8 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
        aria-label="Select language for speech-to-text"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>{lang.name}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed hover:from-emerald-600 hover:to-emerald-700 transition-all focus:ring-2 focus:ring-emerald-500 focus:outline-none transform hover:scale-105"
        aria-label="Send message"
      >
        <SendIcon className="w-6 h-6" />
      </button>
    </form>
    {error && <p className="text-red-500 text-xs text-center mt-1">{error}</p>}
    {!isSupported && <p className="text-amber-600 dark:text-amber-400 text-xs text-center mt-1">Speech recognition is not available in this browser.</p>}
    </div>
  );
};