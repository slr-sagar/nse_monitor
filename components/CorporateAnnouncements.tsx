import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { FileText, Calendar, ExternalLink, FileCode } from 'lucide-react';

export const CorporateAnnouncements: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('corporate-announcements');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  // Corporate API returns direct array
  let announcementsRaw = [];
  if (Array.isArray(data)) {
    announcementsRaw = data;
  } else if (data?.data && Array.isArray(data.data)) {
    announcementsRaw = data.data;
  }

  // Sort by sort_date (already in proper format) in descending order (most recent first)
  const announcements = announcementsRaw
    .filter((a: any) => a && a.symbol) // Filter out invalid entries
    .sort((a: any, b: any) => {
      // sort_date is in format "2025-11-13 17:02:46"  or use broadcast_Date/creation_Date
      const dateA = new Date(a.sort_date || a.broadcast_Date || a.creation_Date || a.an_dt || 0).getTime();
      const dateB = new Date(b.sort_date || b.broadcast_Date || b.creation_Date || b.an_dt || 0).getTime();
      return dateB - dateA; // Descending order (newest first)
    })
    .slice(0, 10);

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
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {announcement.symbol}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {announcement.smName || announcement.sm_name}
                    </p>
                  </div>
                  {/* Document Links - Handle both Integrated Filings and Regular Announcements */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* iXBRL Link (for Integrated Filings) */}
                    {announcement.ixbrl && announcement.ixbrl.trim() && (
                      <a
                        href={announcement.ixbrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors shadow-sm"
                        title="View iXBRL Document"
                      >
                        <FileCode className="w-3 h-3" />
                        <span className="font-semibold">iXBRL</span>
                      </a>
                    )}
                    {/* XBRL Link - check if xbrl field has actual link */}
                    {!announcement.ixbrl && announcement.xbrl && announcement.xbrl.trim() && (
                      <a
                        href={announcement.xbrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors shadow-sm"
                        title="View XBRL Document"
                      >
                        <FileCode className="w-3 h-3" />
                        <span className="font-semibold">XBRL</span>
                      </a>
                    )}
                    {/* XBRL indicator (non-clickable) when only hasXbrl flag is true but no link */}
                    {!announcement.ixbrl && !announcement.xbrl && announcement.hasXbrl && (
                      <div
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded text-xs font-medium border border-blue-200 dark:border-blue-700"
                        title="XBRL data available"
                      >
                        <FileCode className="w-3 h-3" />
                        <span className="font-semibold">XBRL</span>
                      </div>
                    )}
                    {/* PDF Link - check both pdf_attach (Integrated) and attchmntFile (Regular) */}
                    {((announcement.pdf_attach && announcement.pdf_attach.trim()) ||
                      (announcement.attchmntFile && announcement.attchmntFile.trim())) && (
                      <a
                        href={announcement.pdf_attach || announcement.attchmntFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded text-xs font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow-sm"
                        title="View PDF Attachment"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="font-semibold">PDF</span>
                      </a>
                    )}
                    {!announcement.ixbrl && !announcement.xbrl && !announcement.hasXbrl && !announcement.pdf_attach && !announcement.attchmntFile && (
                      <span className="text-xs text-gray-400 italic">No documents</span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  <span className="font-medium">Type:</span> {announcement.type || announcement.desc}
                </p>

                {/* Show quarter end for Integrated Filings */}
                {announcement.qe_Date && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Quarter End: {announcement.qe_Date}
                  </p>
                )}

                {/* Show description for regular announcements */}
                {announcement.attchmntText && !announcement.qe_Date && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {announcement.attchmntText}
                  </p>
                )}

                {/* Show audited/consolidated status for Integrated Filings */}
                {announcement.audited && announcement.consolidated && (
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                      {announcement.audited}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                      {announcement.consolidated}
                    </span>
                  </div>
                )}

                {/* Show industry for regular announcements */}
                {announcement.smIndustry && announcement.smIndustry !== '-' && !announcement.audited && (
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                      {announcement.smIndustry}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {announcement.broadcast_Date || announcement.creation_Date || announcement.an_dt}
                  </div>
                  {(announcement.attFileSize || announcement.fileSize) && (
                    <span className="text-xs text-gray-500">
                      {announcement.attFileSize || announcement.fileSize}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
