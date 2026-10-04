import React, { useState } from 'react';
import {
  Settings,
  X,
  Check,
  Sliders,
  Monitor,
  ShieldCheck,
  Eye
} from 'lucide-react';

export type MeasurementUnit = 'inches' | 'millimeters' | 'points' | 'picas';

export interface AppPreferences {
  units: MeasurementUnit;
  smoothText: boolean;
  showGrid: boolean;
  defaultZoom: string;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  units: 'inches',
  smoothText: true,
  showGrid: false,
  defaultZoom: '100',
};

export interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences?: AppPreferences;
  onSavePreferences?: (prefs: AppPreferences) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences = DEFAULT_PREFERENCES,
  onSavePreferences,
}) => {
  const effectivePrefs = preferences || DEFAULT_PREFERENCES;
  const [units, setUnits] = useState<MeasurementUnit>(effectivePrefs.units || 'inches');
  const [smoothText, setSmoothText] = useState(effectivePrefs.smoothText ?? true);
  const [showGrid, setShowGrid] = useState(effectivePrefs.showGrid ?? false);
  const [defaultZoom, setDefaultZoom] = useState(effectivePrefs.defaultZoom || '100');

  // Sync if preferences prop updates
  React.useEffect(() => {
    if (preferences) {
      setUnits(preferences.units || 'inches');
      setSmoothText(preferences.smoothText ?? true);
      setShowGrid(preferences.showGrid ?? false);
      setDefaultZoom(preferences.defaultZoom || '100');
    }
  }, [preferences, isOpen]);

  const handleSave = () => {
    onSavePreferences?.({
      units,
      smoothText,
      showGrid,
      defaultZoom,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <div>
              <h2 className="text-sm font-bold text-slate-800">Chad-OmniPDF Preferences</h2>
              <p className="text-[11px] text-slate-500">Configure page display, measurement units, and accessibility</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          <div className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Measurement Units:</label>
              <select
                value={units}
                onChange={(e) => setUnits(e.target.value as MeasurementUnit)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-800"
              >
                <option value="inches">Inches (in)</option>
                <option value="millimeters">Millimeters (mm)</option>
                <option value="points">Points (pt)</option>
                <option value="picas">Picas (pc)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Default Document View Zoom:</label>
              <select
                value={defaultZoom}
                onChange={(e) => setDefaultZoom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-800"
              >
                <option value="100">100% (Actual Size)</option>
                <option value="fit_width">Fit Width</option>
                <option value="fit_page">Fit Page</option>
                <option value="125">125%</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-slate-800">Smooth Text Rendering</div>
                  <div className="text-[10px] text-slate-400">Sub-pixel antialiasing for high-density displays</div>
                </div>
                <input
                  type="checkbox"
                  checked={smoothText}
                  onChange={(e) => setSmoothText(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-slate-800">Show Architectural Layout Grid</div>
                  <div className="text-[10px] text-slate-400">Overlay 12pt grid for element alignment</div>
                </div>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
