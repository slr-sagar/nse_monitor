import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="animate-shimmer h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="animate-shimmer h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
      <div className="animate-shimmer h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
    </div>
  );
};
