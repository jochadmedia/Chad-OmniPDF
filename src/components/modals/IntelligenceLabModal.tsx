import React, { useState } from 'react';
import { 
  Dna, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  ChevronRight, 
  Lock, 
  Layers, 
  Database,
  Globe,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import featureConflictEngine from '../../assets/images/feature_conflict_engine_1790951668779.jpg';
import featureDriftWatch from '../../assets/images/feature_drift_watch_1790951684852.jpg';
import featureForensicLab from '../../assets/images/feature_forensic_lab_1790951696399.jpg';

interface IntelligenceLabModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntelligenceLabModal: React.FC<IntelligenceLabModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'conflict' | 'drift' | 'forensics'>('conflict');

  if (!isOpen) return null;

  const features = {
    conflict: {
      title: "Cross-Portfolio Conflict Engine",
      tagline: "The 'Integrity Layer' for Enterprise Archives",
      desc: "Stop signing contradictory agreements. Our engine scans your entire document history (NDAs, MSAs, Non-Competes) and flags clauses in a new document that conflict with obligations you've already committed to elsewhere.",
      image: featureConflictEngine,
      metrics: [
        { label: "Conflict Detection Accuracy", value: "99.8%" },
        { label: "Cross-Doc Scan Speed", value: "< 400ms" }
      ]
    },
    drift: {
      title: "Regulatory Drift Watch",
      tagline: "Documents That Evolve with the Law",
      desc: "Static PDFs are a liability. Drift Watch monitors live legislative feeds (EU AI Act, HIPAA, GDPR). When a law changes, the system instantly identifies which clauses in your stored contracts are now 'at risk' or non-compliant.",
      image: featureDriftWatch,
      metrics: [
        { label: "Legislative Feeds Monitored", value: "140+" },
        { label: "Risk Alert Latency", value: "Real-time" }
      ]
    },
    forensics: {
      title: "Adversarial Forensics Lab",
      tagline: "The Ultimate Arbiter of Truth",
      desc: "Detect 'invisible' text used to trick LLMs, identifies deepfake signatures via timestamp-handshake anomalies, and exposes binary stream manipulation that traditional viewers miss. If it's in the stream, we find it.",
      image: featureForensicLab,
      metrics: [
        { label: "Tamper Detection Depth", value: "Bit-level" },
        { label: "Anomaly Signature Library", value: "2.4M+" }
      ]
    }
  };

  const activeFeature = features[activeTab];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-950 w-full max-w-5xl rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col md:flex-row h-[85vh] shadow-2xl shadow-red-500/10"
      >
        {/* Left: Sidebar Navigation */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 p-6 space-y-6 bg-white/[0.02]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-red-500 font-black tracking-widest text-[10px] uppercase">
              <Zap className="w-3 h-3" />
              Intelligence Lab Beta
            </div>
            <h2 className="text-xl font-black text-white italic">The Next Level.</h2>
          </div>

          <div className="space-y-2">
            {(Object.keys(features) as Array<keyof typeof features>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group active:scale-[0.98] ${
                  activeTab === key 
                  ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' 
                  : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <div className="font-bold text-sm mb-1">{features[key].title}</div>
                <div className={`text-[10px] font-medium uppercase tracking-widest ${activeTab === key ? 'text-red-100' : 'text-slate-500'}`}>
                  {key === 'conflict' ? 'Integrity' : key === 'drift' ? 'Compliance' : 'Truth'}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-slate-300">
                <Dna className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold uppercase tracking-widest">Lab Status</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed font-medium">
                These features represent the future of Chad-OmniPDF. Access is currently limited to Enterprise Tier partners during the Q3 2026 deployment phase.
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            <X className="w-4 h-4" />
            Close Lab
          </button>
        </div>

        {/* Right: Feature Showcase */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* Feature Image Background */}
              <div className="h-2/5 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                <img 
                  src={activeFeature.image} 
                  alt={activeFeature.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-6 left-8 z-20 space-y-1">
                  <div className="text-red-500 font-black uppercase tracking-[0.3em] text-[10px]">{activeFeature.tagline}</div>
                  <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tight">{activeFeature.title}</h3>
                </div>
              </div>

              {/* Feature Details */}
              <div className="flex-1 p-8 md:p-12 space-y-8 overflow-y-auto">
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                  {activeFeature.desc}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {activeFeature.metrics.map((m, i) => (
                    <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-1 group hover:border-red-500/50 transition-colors">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</div>
                      <div className="text-3xl font-black text-white italic group-hover:text-red-500 transition-colors">{m.value}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=pilot${i}`} 
                            className="w-full h-full rounded-full" 
                            alt="Pilot User"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 font-bold tracking-widest uppercase">
                      Currently in closed pilot <br/> with 12 Fortune 500 teams
                    </div>
                  </div>

                  <button className="px-10 py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center gap-2">
                    Request Pilot Access
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
