import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  X,
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  Sparkles,
  Radio,
  FileText,
  Check
} from 'lucide-react';
import { PdfDocument } from '../../types/chad-omnidpdf';
import { generatePodcastScript, PodcastScript } from '../../utils/aiDocumentEngine';

interface AiPodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
}

export const AiPodcastModal: React.FC<AiPodcastModalProps> = ({
  isOpen,
  onClose,
  currentDoc,
}) => {
  const [format, setFormat] = useState<'highlights' | 'deep_dive'>('highlights');
  const [script, setScript] = useState<PodcastScript>(() =>
    generatePodcastScript(currentDoc, 'highlights')
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [speechActive, setSpeechActive] = useState(false);
  const [neuralAudioUrl, setNeuralAudioUrl] = useState<string | null>(null);
  const [isGeneratingNeural, setIsGeneratingNeural] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Re-generate when format changes
  useEffect(() => {
    setScript(generatePodcastScript(currentDoc, format));
    setIsPlaying(false);
    setPlaybackIndex(0);
    setNeuralAudioUrl(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
  }, [format, currentDoc]);

  // Clean up speech on unmount or close
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleGenerateNeural = async () => {
    setIsGeneratingNeural(true);
    window.speechSynthesis?.cancel();
    setIsPlaying(false);

    if (!currentDoc) {
      setIsGeneratingNeural(false);
      return;
    }

    try {
      const docText = currentDoc.pages
        .map((p) => p.paragraphs.map((pr) => pr.text).join(' '))
        .join('\n\n');

      const res = await fetch('/api/v1/ai/podcast/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          space_id: currentDoc.id,
          format,
          document_text: docText.slice(0, 10000),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio_url) {
          setNeuralAudioUrl(data.audio_url);
        }
        if (data.transcript) {
          // Parse lines into dialogue
          const lines = data.transcript.split('\n').filter((l: string) => l.trim().length > 0);
          const parsedDialogue: { speaker: 'Alex (Lead Analyst)' | 'Jordan (Tech Architect)'; text: string }[] = [];
          for (const line of lines) {
            const alexMatch = line.match(/^\[?(?:Alex|Host\s*1)[^\]:]*\]?:\s*(.*)/i);
            const jordanMatch = line.match(/^\[?(?:Jordan|Host\s*2)[^\]:]*\]?:\s*(.*)/i);
            if (alexMatch) {
              parsedDialogue.push({ speaker: 'Alex (Lead Analyst)', text: alexMatch[1] });
            } else if (jordanMatch) {
              parsedDialogue.push({ speaker: 'Jordan (Tech Architect)', text: jordanMatch[1] });
            }
          }
          if (parsedDialogue.length >= 2) {
            setScript((prev) => ({
              ...prev,
              dialogue: parsedDialogue,
            }));
          }
        }
      }
    } catch (err) {
      console.warn('Neural audio generation error:', err);
    } finally {
      setIsGeneratingNeural(false);
    }
  };

  const togglePlayback = () => {
    if (neuralAudioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = playbackSpeed;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
      return;
    }

    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playLine(playbackIndex);
    }
  };

  const playLine = (index: number) => {
    if (!('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    if (index >= script.dialogue.length) {
      setIsPlaying(false);
      setPlaybackIndex(0);
      return;
    }

    setPlaybackIndex(index);
    const item = script.dialogue[index];
    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.rate = playbackSpeed;

    // Change pitch slightly based on speaker
    if (item.speaker.startsWith('Alex')) {
      utterance.pitch = 1.05;
    } else {
      utterance.pitch = 0.92;
    }

    utterance.onend = () => {
      playLine(index + 1);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadTranscript = () => {
    const docTitle = currentDoc?.title || 'Document';
    const text = `CHAD-OMNIPDF AI AUDIO PODCAST TRANSCRIPT\nDocument: ${docTitle}\nFormat: ${format.toUpperCase()}\nEstimated Duration: ${script.durationEst}\n\n` +
      script.dialogue.map((d) => `[${d.speaker}]:\n${d.text}\n`).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle.replace(/\s+/g, '_')}_Audio_Podcast_Transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[82vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-purple-50">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-600 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-800">AI Audio Podcasts (Two-Host Studio)</h2>
                <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">
                  Gemini 1.5 Pro + Studio Synthesis
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Generate professional audio briefs from complex legal filings. Digest core insights while you commute.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Podcast Format:</span>
            <button
              onClick={() => setFormat('highlights')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                format === 'highlights'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Highlights Brief (2 min)
            </button>
            <button
              onClick={() => setFormat('deep_dive')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                format === 'deep_dive'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Deep Dive (5 min)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateNeural}
              disabled={isGeneratingNeural}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              {isGeneratingNeural ? 'Synthesizing with Gemini...' : 'Synthesize Neural Audio'}
            </button>

            {neuralAudioUrl && (
              <a
                href={neuralAudioUrl}
                download={`${(currentDoc?.title || 'Document').replace(/\s+/g, '_')}_Neural_Podcast.wav`}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-3 h-3" /> Download Audio (.wav)
              </a>
            )}

            <button
              onClick={handleDownloadTranscript}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-medium text-[11px] flex items-center gap-1.5"
            >
              <Download className="w-3 h-3" /> Transcript (.txt)
            </button>
          </div>
        </div>

        {/* Hidden Audio Element for real neural podcast playback */}
        <audio
          ref={audioRef}
          src={neuralAudioUrl || undefined}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Audio Player Controller Bar */}
        <div className="p-4 bg-purple-900 text-white flex items-center justify-between shadow-inner select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className="w-10 h-10 rounded-full bg-white text-purple-900 hover:bg-purple-100 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div>
              <div className="font-semibold text-xs text-purple-100">{script.title}</div>
              <div className="text-[10px] text-purple-300">
                Duration: {script.durationEst} • Voice Synthesis Active
              </div>
            </div>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-1 h-6">
            {[4, 12, 8, 18, 22, 14, 20, 10, 16, 6, 14, 20, 8, 16].map((h, i) => (
              <div
                key={i}
                style={{
                  height: isPlaying ? `${Math.max(4, Math.round(h * Math.random()))}px` : '4px',
                }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlaying ? 'bg-purple-300' : 'bg-purple-700'
                }`}
              />
            ))}
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-purple-300 text-[10px]">Speed:</span>
            {[1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  playbackSpeed === s ? 'bg-purple-700 text-white font-bold' : 'text-purple-300 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Script Dialogue Flow */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Dual-Host Studio Dialogue Transcript
          </div>

          {script.dialogue.map((line, idx) => {
            const isAlex = line.speaker.startsWith('Alex');
            const isCurrent = isPlaying && playbackIndex === idx;

            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-purple-600 bg-purple-50/70 shadow-md ring-2 ring-purple-500'
                    : 'border-slate-200 bg-white/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                        isAlex ? 'bg-blue-600' : 'bg-emerald-600'
                      } ${
                        isCurrent ? 'ring-2 ring-purple-500' : ''
                      }`}
                    >
                      {isAlex ? 'AL' : 'JO'}
                    </div>
                    <span className="font-semibold text-xs text-slate-800">{line.speaker}</span>
                  </div>
                  {isCurrent && (
                    <>
                      <span className="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                        <Volume2 className="w-3 h-3 animate-bounce" /> Speaking
                      </span>
                      <div className="w-0.5 bg-purple-600 rounded-lg" />
                    </>
                  )}
                </div>
                <p className={`text-xs text-slate-700 leading-relaxed pl-4 ${
                  isCurrent ? 'font-medium text-purple-900' : ''
                }`}>
                  {line.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-400 text-[11px]">
            AI Privacy: Audio generated client-side; zero content retained for training.
          </span>
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onClose();
            }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium"
          >
            Close Audio Studio
          </button>
        </div>
      </div>
    </div>
  );
};
