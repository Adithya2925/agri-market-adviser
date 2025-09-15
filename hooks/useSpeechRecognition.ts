import { useState, useEffect, useRef, useMemo } from 'react';

// The 'SpeechRecognition' and 'SpeechRecognitionEvent' are browser-specific APIs.
// We declare them here to satisfy TypeScript since standard DOM types might not include them.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}

export const useSpeechRecognition = (language: string) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  const isSupported = useMemo(() => 
    typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
  , []);

  useEffect(() => {
    if (!isSupported) {
      console.error('Speech Recognition not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        let userFriendlyError = 'An unknown speech recognition error occurred.';
        switch(event.error) {
            case 'audio-capture':
                userFriendlyError = 'Audio capture failed. Please check your microphone connection and ensure it is not being used by another application.';
                break;
            case 'not-allowed':
                userFriendlyError = 'Microphone access was denied. Please allow microphone permissions in your browser settings.';
                break;
            case 'no-speech':
                userFriendlyError = 'No speech was detected. Please try speaking again.';
                break;
             case 'network':
                userFriendlyError = 'A network error occurred during speech recognition. Please check your internet connection.';
                break;
            default:
                userFriendlyError = `An error occurred: ${event.error}`;
        }
        setError(userFriendlyError);
        setIsListening(false);
    }

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isSupported]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, transcript, startListening, stopListening, setTranscript, error, isSupported };
};