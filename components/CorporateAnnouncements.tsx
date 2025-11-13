import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { FileText, Calendar } from 'lucide-react';

export const CorporateAnnouncements: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('corporate-announcements');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const announcements = data?.slice(0, 10) || [];

  return (
    <Card title="Corporate Announcements" subtitle="Latest company updates">
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {announcements.map((announcement: any, idx: number) => (
          <div
            key={idx}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {announcement.symbol || announcement.sm_name}
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {announcement.subject || announcement.desc || announcement.an_desc}
                </p>
                <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {announcement.an_dt || announcement.date || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
