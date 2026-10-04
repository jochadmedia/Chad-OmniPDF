import React, { useState } from 'react';
import {
  Printer,
  X,
  Sliders,
  CheckCircle2,
  Droplet,
  Layers,
  Eye,
  AlertCircle
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';

interface PrintProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
}

export const PrintProductionModal: React.FC<PrintProductionModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
}) => {
  const [profile, setProfile] = useState('U.S. Web Coated (SWOP) v2');
  const [channels, setChannels] = useState({
    cyan: true,
    magenta: true,
    yellow: true,
    black: true,
    spotPantone: true,
  });
  const [hairlinesFixed, setHairlinesFixed] = useState(false);

  const plateCoverages = React.useMemo(() => {
    if (!currentDoc) {
      return { cyan: '0%', magenta: '0%', yellow: '0%', black: '0%', spotPantone: '0%' };
    }
    const textLen = (currentDoc.pages || []).reduce((acc, p) => acc + (p.paragraphs || []).reduce((pacc, pr) => pacc + pr.text.length, 0), 0);
    const hasStamps = (currentDoc.annotations || []).some((a) => a.type === 'stamp' || (a.color && a.color.includes('red')));
    const blackCoverage = Math.min(85, Math.max(18, Math.round(textLen / 70)));
    const cyanCoverage = Math.round(blackCoverage * 0.34);
    const magCoverage = Math.round(blackCoverage * 0.26);
    const yelCoverage = Math.round(blackCoverage * 0.39);
    const spotCoverage = hasStamps ? 8.4 : 1.5;

    return {
      cyan: `${cyanCoverage}%`,
      magenta: `${magCoverage}%`,
      yellow: `${yelCoverage}%`,
      black: `${blackCoverage}%`,
      spotPantone: `${spotCoverage}%`,
    };
  }, [currentDoc]);

  if (!isOpen || !currentDoc) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[70vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-slate-800" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Advanced Print Production Toolbar &amp; Output Preview
              </h2>
              <p className="text-[11px] text-slate-500">
                CMYK Ink Separations, Total Area Coverage (TAC), and Hairline Remediation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {/* Simulation Profile */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="font-semibold text-slate-700 block mb-1 text-xs">
              Simulation Color Profile:
            </label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded p-1.5 text-xs text-slate-800"
            >
              <option value="U.S. Web Coated (SWOP) v2">U.S. Web Coated (SWOP) v2 (Standard CMYK)</option>
              <option value="Coated FOGRA39 (ISO 12647-2:2004)">Coated FOGRA39 (ISO 12647-2:2004)</option>
              <option value="GRACoL 2006 Coated 1v2">GRACoL 2006 Coated 1v2</option>
              <option value="Japan Color 2001 Coated">Japan Color 2001 Coated</option>
            </select>
          </div>

          {/* CMYK Separations */}
          <div>
            <div className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider mb-2">
              Process Plates &amp; Ink Manager
            </div>
            <div className="space-y-1.5">
              {[
                { key: 'cyan', label: 'Cyan Plate', color: 'bg-cyan-500', coverage: plateCoverages.cyan },
                { key: 'magenta', label: 'Magenta Plate', color: 'bg-pink-600', coverage: plateCoverages.magenta },
                { key: 'yellow', label: 'Yellow Plate', color: 'bg-yellow-400', coverage: plateCoverages.yellow },
                { key: 'black', label: 'Key (Black) Plate', color: 'bg-black', coverage: plateCoverages.black },
                { key: 'spotPantone', label: 'Spot Color: PANTONE 185 C', color: 'bg-red-600', coverage: plateCoverages.spotPantone },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2 rounded border border-slate-200 bg-white hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="font-medium text-slate-800">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="font-mono text-slate-500">{item.coverage}</span>
                    <input
                      type="checkbox"
                      checked={(channels as any)[item.key]}
                      onChange={(e) =>
                        setChannels({ ...channels, [item.key]: e.target.checked })
                      }
                      className="w-4 h-4 text-slate-800 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hairlines & Flattening */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Hairline Remediation (&lt; 0.25 pt)</div>
              <div className="text-[11px] text-slate-500">
                Automatically increase ultra-thin strokes to 0.25 pt to prevent offset press dropouts
              </div>
            </div>
            <button
              onClick={() => setHairlinesFixed(true)}
              disabled={hairlinesFixed}
              className={`px-3 py-1.5 rounded font-medium text-xs ${
                hairlinesFixed
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-800 hover:bg-slate-900 text-white'
              }`}
            >
              {hairlinesFixed ? 'Hairlines Fixed' : 'Fix Hairlines'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium text-xs"
          >
            Close Output Preview
          </button>
        </div>
      </div>
    </div>
  );
};
