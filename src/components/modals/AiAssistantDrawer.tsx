import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCw,
  ShieldAlert,
  Tag,
  ExternalLink,
  ChevronRight,
  Bot,
  User,
  CheckCircle,
  FileText,
  HelpCircle,
  Layers,
  Wand2
} from 'lucide-react';
import { PdfDocument, AiChatMessage, Citation } from '../../types/chad-omnidpdf';
import { parseAndExecuteNaturalLanguagePrompt } from '../../utils/aiDocumentEngine';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoc?: PdfDocument;
  onUpdateDocument: (updated: PdfDocument) => void;
  onJumpToPage: (pageNumber: number) => void;
  initialPrompt?: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentDoc,
  onUpdateDocument,
  onJumpToPage,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: `Hello! I'm your Chad-OmniPDF AI Assistant. I have indexed all ${currentDoc?.pageCount || 1} pages of **${currentDoc?.title || 'Document'}**.\n\nYou can ask questions with verified page-level citations or execute natural language PDF editing actions directly.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto trigger initialPrompt if forwarded from PDF Spaces or external action
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendPrompt(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const quickPrompts = [
    'Summarize this document',
    'Redact sensitive PII and SSNs',
    'Rotate Page 2 by 90 degrees',
    'Add CONFIDENTIAL watermark',
    'What are the primary payment terms and SLAs?',
  ];

  const handleSendPrompt = (promptText?: string) => {
    const textToSend = (promptText || inputPrompt).trim();
    if (!textToSend || isProcessing) return;

    // 1. Add user message
    const userMsg: AiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);

    // 2. Process query / action
    if (!currentDoc) {
      const assistantMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: 'No active document is loaded. Please select or upload a document to analyze or execute AI edits.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsProcessing(false);
      return;
    }

    const docContext = currentDoc.pages
      .map((p) => `Page ${p.pageNumber}: ${p.paragraphs.map((pr) => pr.text).join(' ')}`)
      .join('\n\n');

    // First check if it's an interactive document modification command
    const localResult = parseAndExecuteNaturalLanguagePrompt(textToSend, currentDoc);
    if (localResult.updatedDocument) {
      onUpdateDocument(localResult.updatedDocument);
      const assistantMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: localResult.message,
        citations: localResult.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsProcessing(false);
      return;
    }

    // Informational query: Dispatch to server-side Gemini endpoint with document stream
    fetch('/api/v1/ai/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_id: currentDoc.id,
        prompt: textToSend,
        document_text: docContext.slice(0, 15000),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        const assistantMsg: AiChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.answer || localResult.message,
          citations: data.citations && data.citations.length > 0 ? data.citations : localResult.citations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);
      })
      .catch(() => {
        // High-fidelity local fallback on error or offline
        const assistantMsg: AiChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: localResult.message,
          citations: localResult.citations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsProcessing(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-12 right-0 bottom-0 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3.5 border-b border-purple-100 bg-linear-to-r from-purple-50 via-white to-indigo-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-slate-900">Chad-OmniPDF AI Assistant</h2>
              <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded-full">
                Studio
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
              Grounded on {currentDoc?.fileName || 'Workspace Document'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-2 border-b border-slate-100 bg-slate-50/50 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        {quickPrompts.map((q) => (
          <button
            key={q}
            onClick={() => handleSendPrompt(q)}
            className="px-2.5 py-1 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-full text-slate-700 whitespace-nowrap transition-colors shrink-0 font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 p-3.5 overflow-y-auto space-y-3.5 bg-slate-50/30 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
              <span>{m.sender === 'user' ? 'You' : 'Chad-OmniPDF AI'}</span>
              <span>•</span>
              <span>{m.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[92%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Citations Box */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-150 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Inline Citations &amp; Grounding
                  </div>
                  {m.citations.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => onJumpToPage(c.page)}
                      className="w-full text-left p-1.5 rounded bg-purple-50/60 hover:bg-purple-100 border border-purple-200 text-[11px] text-purple-950 flex items-center justify-between group transition-colors"
                    >
                      <div className="truncate pr-2">
                        <span className="font-semibold text-purple-800 mr-1.5">[Page {c.page}]</span>
                        <span className="text-slate-600 font-sans italic">{c.passageSnippet}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-purple-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs text-purple-600 p-2 bg-purple-50 rounded-lg animate-pulse w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyzing document streams and citations...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about this document or enter action (e.g. 'rotate page 2')..."
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl pl-3 pr-9 py-2 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isProcessing}
            className="absolute right-1.5 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="text-[10px] text-slate-400 mt-1.5 text-center flex items-center justify-center gap-1">
          <span>AI Privacy Protected: Zero retention • 12hr session cache</span>
        </div>
      </div>
    </div>
  );
};
