import React, { useState } from 'react';
import { Download, Monitor, Smartphone, X, Check, Laptop } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, isWindows, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showWindowsGuide, setShowWindowsGuide] = useState(false);

  // If already running as an installed standalone app, suppress prompt
  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-md">
        <Check className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed App</span>
      </div>
    );
  }

  // Active prompt flow (Edge, Chrome, Chromium Windows/Mac/Android)
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 rounded-md font-medium text-white transition-all shadow-xs ${
          compact
            ? 'px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500'
            : 'px-3 py-1.5 text-xs bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500'
        }`}
        title={isWindows ? 'Install as standalone Windows application' : 'Install Progressive Web App'}
      >
        {isWindows ? <Monitor className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
        <span>{isWindows ? 'Install on Windows' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold shrink-0">1</span>
                  <p>Tap the <strong className="text-white">Share</strong> button in Safari's bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold shrink-0">2</span>
                  <p>Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold shrink-0">3</span>
                  <p>Tap <strong className="text-white">Add</strong> in the top right to install Chad-OmniPDF Pro on your device.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white hover:bg-indigo-500"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Windows Desktop helper guide button when browser hasn't fired beforeinstallprompt or on desktop browser
  return (
    <>
      <button
        onClick={() => setShowWindowsGuide(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
        title="Install as dedicated desktop app"
      >
        <Laptop className="w-3.5 h-3.5 text-indigo-400" />
        <span className="hidden sm:inline">Desktop App</span>
      </button>

      {showWindowsGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-red-500" />
                <h3 className="text-sm font-semibold">Install on Windows / Desktop</h3>
              </div>
              <button
                onClick={() => setShowWindowsGuide(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <p>You can run this workstation as a standalone desktop app on Windows with taskbar pinning and offline execution:</p>
              <div className="p-3 bg-slate-800/80 rounded-lg space-y-2 border border-slate-700">
                <p className="font-semibold text-white">In Microsoft Edge or Google Chrome:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-300">
                  <li>Look for the <strong className="text-white">App Available / Install</strong> icon (<Download className="w-3 h-3 inline text-indigo-400 mx-1" />) on the right side of your browser address bar.</li>
                  <li>Click <strong className="text-white">Install</strong>.</li>
                  <li>Windows will launch the app in its own window and prompt you to <strong className="text-white">Pin to taskbar</strong> and <strong className="text-white">Pin to Start</strong>.</li>
                </ol>
              </div>
              <div className="text-[11px] text-slate-400">
                Once installed, the app operates independently from the browser, caches documents in IndexedDB, and works offline.
              </div>
            </div>
            <button
              onClick={() => setShowWindowsGuide(false)}
              className="mt-5 w-full rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white hover:bg-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
