import React, { useState } from 'react';
import type { Message } from '../types';
import { Author } from '../types';
import { BotIcon, UserIcon, CopyIcon, CheckIcon } from './Icons';
import { LoadingIndicator } from './LoadingIndicator';
import { MarketTrendChart } from './MarketTrendChart';
import type { ChartData } from './MarketTrendChart';


interface ChatMessageProps {
  message: Message;
}

const Table: React.FC<{ tableString: string }> = ({ tableString }) => {
    const lines = tableString.trim().split('\n').filter(Boolean);
    if (lines.length < 2) return <pre>{tableString}</pre>;

    const headerCells = lines[0].split('|').map(h => h.trim()).filter(Boolean);
    const rows = lines.slice(2).map(rowLine => 
        rowLine.split('|').map(cell => cell.trim()).filter(Boolean)
    );

    return (
        <div className="overflow-x-auto my-4 prose-sm max-w-none">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700/50">
                        {headerCells.map((header, i) => (
                            <th key={i} className="border border-gray-300 dark:border-gray-600 p-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i} className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-800/50">
                            {row.map((cell, j) => (
                                <td key={j} className="border border-gray-300 dark:border-gray-600 p-3">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const formatText = (text: string) => {
    // Basic markdown-like formatting for lists and bold text
    const lines = text.split('\n').filter(line => line.trim() !== '');
    return lines.map((line, index) => {
        if (line.startsWith('* ') || line.startsWith('- ')) {
            return <li key={index}>{line.substring(2)}</li>;
        }
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return <p key={index}>{parts.map((part, i) => part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</p>;
    });
};

const parseContent = (text: string) => {
  const parts = text.split(/(```json:chart[\s\S]*?```)/g);
  
  return parts.flatMap((part, index) => {
    const chartMatch = part.match(/```json:chart([\s\S]*?)```/);
    if (chartMatch && chartMatch[1]) {
      try {
        const chartJson: ChartData = JSON.parse(chartMatch[1].trim());
        return [<MarketTrendChart key={`chart-${index}`} data={chartJson} />];
      } catch (e) {
        console.error('Failed to parse chart JSON:', e);
        return [<div key={`chart-error-${index}`} className="text-red-500 text-xs">Error displaying chart.</div>];
      }
    }
    
    // Split by tables after checking for charts
    const tableParts = part.split(/((?:\|.*\|(?:\r?\n|\r))+)/g).filter(Boolean);

    return tableParts.map((textOrTable, subIndex) => {
        if (textOrTable.match(/^\|.*\|/m)) {
            return <Table key={`table-${index}-${subIndex}`} tableString={textOrTable} />;
        }
        return (
            <div key={`text-${index}-${subIndex}`} className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-li:my-0">
                 {formatText(textOrTable)}
            </div>
        )
    });
  });
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  if (message.author === Author.BOT && message.text === '') {
    return <LoadingIndicator />;
  }

  const isUser = message.author === Author.USER;

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className={`group flex items-start gap-3 max-w-4xl mx-auto ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <BotIcon className="w-5 h-5 text-emerald-500" />
        </div>
      )}
      <div
        className={`relative px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-800 rounded-bl-none border border-gray-200 dark:border-gray-700'
        }`}
        style={{ maxWidth: 'calc(100% - 44px)'}}
      >
        {parseContent(message.text)}
        {!isUser && message.text && (
            <button 
                onClick={handleCopy}
                className="absolute -top-2 -right-2 p-1.5 bg-gray-100 dark:bg-gray-900 rounded-full text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label={isCopied ? "Copied" : "Copy message"}
            >
                {isCopied ? (
                    <CheckIcon className="w-4 h-4 text-emerald-500" />
                ) : (
                    <CopyIcon className="w-4 h-4" />
                )}
            </button>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
      )}
    </div>
  );
};