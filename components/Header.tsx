import React from 'react';
import { LeafIcon, PlusIcon } from './Icons';

interface HeaderProps {
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#fcfcfc]/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/80">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
            <LeafIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Agri-Market Advisor
        </h1>
      </div>
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
        aria-label="Start new chat"
      >
        <PlusIcon className="w-5 h-5" />
        <span className="hidden sm:inline">New Chat</span>
      </button>
    </header>
  );
};