import React, { useState, useEffect } from 'react';
import { WifiOff, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-600/95 backdrop-blur-xs px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-in slide-in-from-bottom duration-200">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Offline Mode — All edits saving to local IndexedDB</span>
      <Database className="w-3 h-3 text-amber-200 ml-1" />
    </div>
  );
};
