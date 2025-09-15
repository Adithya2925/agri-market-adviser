import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { WelcomeScreen } from './components/WelcomeScreen';
import { initChat } from './services/geminiService';
import type { Message } from './types';
import { Author } from './types';

const LOCAL_STORAGE_KEY = 'agri-chat-history';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history from local storage on initial load
    try {
      const savedMessagesRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      const savedMessages: Message[] = savedMessagesRaw ? JSON.parse(savedMessagesRaw) : [];

      // FIX: Explicitly type the 'role' to prevent TypeScript from inferring it as a generic 'string'.
      const historyForGemini = savedMessages.map(msg => {
        const role: 'user' | 'model' = msg.author === Author.USER ? 'user' : 'model';
        return {
          role,
          parts: [{ text: msg.text }],
        };
      });

      const chatInstance = initChat(historyForGemini);
      setChat(chatInstance);

      if (savedMessages.length > 0) {
        setMessages(savedMessages);
      }
    } catch (e) {
      console.error('Failed to initialize chat:', e);
      setError('Failed to initialize the AI model. Please check your API key.');
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear potentially corrupt data
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to the latest message
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Save chat history to local storage whenever messages change
    if (messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      author: Author.USER,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const botMessageId = (Date.now() + 1).toString();
    const placeholderBotMessage: Message = {
      id: botMessageId,
      text: '',
      author: Author.BOT,
    };
    setMessages((prev) => [...prev, placeholderBotMessage]);

    try {
      let fullResponse = '';
      const stream = await chat.sendMessageStream({ message: text });

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
       // If the stream finishes but the response was empty, remove the placeholder.
      if (fullResponse.trim() === '') {
        setMessages((prev) => prev.filter((msg) => msg.id !== botMessageId));
      }

    } catch (e) {
      console.error(e);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setError(errorMessage);
       const errorBotMessage: Message = {
        id: botMessageId, // Use same ID to replace the placeholder
        text: errorMessage,
        author: Author.BOT,
      };
      // Replace placeholder with an error message
      setMessages((prev) => prev.map(m => m.id === botMessageId ? errorBotMessage : m));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    try {
      const chatInstance = initChat(); // No history
      setChat(chatInstance);
      setError(null);
    } catch (e) {
      console.error('Failed to initialize new chat:', e);
      setError('Failed to initialize the AI model.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fcfcfc] dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header onNewChat={handleNewChat} />
      <main ref={chatWindowRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
        {messages.length === 0 && !isLoading ? (
          <WelcomeScreen onPromptClick={handleSendMessage} />
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
        {error && (
           <div className="flex justify-center">
            <p className="text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 p-3 rounded-lg max-w-md text-center">{error}</p>
           </div>
        )}
      </main>
      <footer className="sticky bottom-0 bg-[#fcfcfc]/80 dark:bg-gray-900/80 backdrop-blur-lg">
         <div className="border-t border-gray-200 dark:border-gray-700/80 p-4">
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
         </div>
      </footer>
    </div>
  );
};

export default App;