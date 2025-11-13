import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, subtitle }) => {
  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700',
      className
    )}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
