import React from 'react';
import { GlobeIcon, LeafIcon, TrendingUpIcon } from './Icons';

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const WelcomeCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}> = ({ icon, title, text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-left w-full h-full flex flex-col items-start border border-gray-200 dark:border-gray-700/80 hover:border-emerald-500/50 hover:-translate-y-1"
  >
    <div className="flex items-center mb-4">
      {icon}
    </div>
    <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
  </button>
);

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
  const prompts = [
    {
      icon: <TrendingUpIcon className="w-7 h-7 text-emerald-500" />,
      title: 'Find High-Demand Markets',
      text: "I make high-quality mango jam. Which cities in the US have the highest demand?",
    },
    {
      icon: <GlobeIcon className="w-7 h-7 text-blue-500" />,
      title: 'Explore Export Opportunities',
      text: 'Where can I export organic quinoa from Peru for the best profit margin?',
    },
    {
      icon: <LeafIcon className="w-7 h-7 text-amber-500" />,
      title: 'Analyze a Product',
      text: 'What are the market trends for value-added coconut products like virgin coconut oil?',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">Welcome to Agri-Market Advisor</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
          Your AI assistant for finding the best markets for your agricultural products. Ask me anything or start with one of the examples below.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {prompts.map((p) => (
          <WelcomeCard
            key={p.title}
            icon={p.icon}
            title={p.title}
            text={`" ${p.text} "`}
            onClick={() => onPromptClick(p.text)}
          />
        ))}
      </div>
    </div>
  );
};