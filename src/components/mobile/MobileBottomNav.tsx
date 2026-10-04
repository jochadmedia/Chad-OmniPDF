import React from 'react';
import { Home, Wrench, PenTool, Sparkles, Smartphone } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenHome: () => void;
  onOpenTools: () => void;
  onOpenSign: () => void;
  onOpenAi: () => void;
  liquidMode: boolean;
  onToggleLiquidMode: () => void;
  activePanel: 'home' | 'tools' | 'ai' | null;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenHome,
  onOpenTools,
  onOpenSign,
  onOpenAi,
  liquidMode,
  onToggleLiquidMode,
  activePanel,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 pb-safe"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center justify-around">
        {/* Home Tab */}
        <button
          onClick={onOpenHome}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            activePanel === 'home' ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Tools Tab */}
        <button
          onClick={onOpenTools}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            activePanel === 'tools' ? 'text-red-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Tools</span>
        </button>

        {/* Liquid Mode Center Action */}
        <button
          onClick={onToggleLiquidMode}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors relative ${
            liquidMode ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Chad-OmniPDF Liquid Mode Reflow"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              liquidMode ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-[9px] mt-0.5 tracking-tight font-medium">Liquid</span>
        </button>

        {/* E-Sign Tab */}
        <button
          onClick={onOpenSign}
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <PenTool className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">Sign</span>
        </button>

        {/* AI Assistant Tab */}
        <button
          onClick={onOpenAi}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            activePanel === 'ai' ? 'text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">AI Chat</span>
        </button>
      </div>
    </nav>
  );
};
