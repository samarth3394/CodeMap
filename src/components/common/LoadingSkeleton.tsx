import React from 'react';

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return <div className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <LoadingSkeleton className="h-5 w-40" />
        <LoadingSkeleton className="h-5 w-16 rounded-full" />
      </div>
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <div className="pt-2 flex items-center gap-3">
        <LoadingSkeleton className="h-3 w-20" />
        <LoadingSkeleton className="h-3 w-20" />
      </div>
    </div>
  );
};
