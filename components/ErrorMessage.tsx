import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error</h3>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
