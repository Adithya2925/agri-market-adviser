import React from 'react';
import { BotIcon } from './Icons';

export const LoadingIndicator: React.FC = () => (
  <div className="flex items-start gap-3 max-w-4xl mx-auto justify-start">
    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
      <BotIcon className="w-5 h-5 text-emerald-500" />
    </div>
    <div className="px-4 py-3 rounded-2xl shadow-sm bg-white dark:bg-gray-800 rounded-bl-none border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-center space-x-1">
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);