/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  Database,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import {
  CareerLoopMemory,
  calculateFactsCount,
  executeTriggerC_Summarize,
  saveMentorMemory,
  STORAGE_WARNING_EVENT
} from '../../utils/mentorMemory';

interface ChatTurn {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface MentorPanelProps {
  memory: CareerLoopMemory;
  onUpdateMemory: (updated: CareerLoopMemory) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  className?: string;
}

export const MentorPanel: React.FC<MentorPanelProps> = ({
  memory,
  onUpdateMemory,
  isOpen,
  onToggleOpen,
  className = '',
}) => {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMemoryInspector, setShowMemoryInspector] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<ChatTurn[]>(messages);
  messagesRef.current = messages;

  const factsCount = calculateFactsCount(memory);

  // Listen for non-blocking storage warnings
  useEffect(() => {
    const handleWarning = (e: Event) => {
      const custom = e as CustomEvent<string>;
      setStorageWarning(custom.detail || 'Storage warning: memory could not be saved to disk.');
      setTimeout(() => setStorageWarning(null), 6000);
    };

    window.addEventListener(STORAGE_WARNING_EVENT, handleWarning);
    return () => window.removeEventListener(STORAGE_WARNING_EVENT, handleWarning);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Trigger C helper: summarize transcript and clear from component state
  const runTriggerCSummarize = async (turnsToSummarize: ChatTurn[]) => {
    if (turnsToSummarize.length === 0) return;
    try {
      const updated = await executeTriggerC_Summarize(memory, turnsToSummarize);
      onUpdateMemory(updated);
      setMessages([]);
    } catch (err) {
      console.warn('Trigger C execution error:', err);
    }
  };

  // Trigger C trigger 1: Check after every 8 messages
  useEffect(() => {
    if (messages.length >= 8) {
      const batch = [...messages];
      runTriggerCSummarize(batch);
    }
  }, [messages.length]);

  // Trigger C trigger 2: When mentor panel closes
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (prevIsOpen.current && !isOpen) {
      // Panel just closed
      if (messagesRef.current.length > 0) {
        runTriggerCSummarize([...messagesRef.current]);
      }
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || inputText).trim();
    if (!textToSend || isLoading) return;

    setInputText('');

    const userTurn: ChatTurn = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userTurn];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Constraint: Cap recentTurns at the last 6 messages before calling /api/mentor. Never send full transcript.
      const cappedRecentTurns = newHistory.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          memoryFile: memory,
          recentTurns: cappedRecentTurns,
        }),
      });

      const replyText = await res.text();

      const modelTurn: ChatTurn = {
        role: 'model',
        content: replyText || 'I am focused on your current stage and decision trade-offs. What aspect should we examine?',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, modelTurn]);
    } catch (err: any) {
      console.error('Failed to communicate with mentor:', err);
      const errorTurn: ChatTurn = {
        role: 'model',
        content: 'I had trouble connecting to the advisory engine. Please ask again in a moment.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorTurn]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-md transition-all duration-200 overflow-hidden flex flex-col ${className}`}
    >
      {/* Storage Warning Banner (Non-blocking) */}
      {storageWarning && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-[11px] px-3 py-1.5 flex items-center justify-between">
          <span>{storageWarning}</span>
          <button
            onClick={() => setStorageWarning(null)}
            className="text-amber-700 hover:text-amber-900 ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-xs font-bold text-white truncate">
                CareerLoop Mentor
              </h3>
              {/* Exact Header Requirement: "memory: N facts" */}
              <button
                type="button"
                onClick={() => setShowMemoryInspector((prev) => !prev)}
                title="Click to inspect persistent memory facts"
                className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-700/60 hover:bg-sky-900 transition-colors cursor-pointer shrink-0"
              >
                <Database className="w-2.5 h-2.5" />
                <span>memory: {factsCount} facts</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-300 truncate">
              {memory.career_label} · Stage {memory.current_stage}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleOpen}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isOpen ? 'Collapse Mentor Drawer' : 'Open Mentor Drawer'}
            aria-label={isOpen ? 'Collapse Mentor Drawer' : 'Open Mentor Drawer'}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="flex flex-col h-[380px] bg-slate-50/50">
          {/* Memory Inspector Overlay */}
          {showMemoryInspector && (
            <div className="bg-white border-b border-slate-200 p-3 max-h-48 overflow-y-auto text-xs text-slate-700 space-y-2 select-text shadow-inner">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="font-semibold text-slate-900 flex items-center gap-1 text-[11px]">
                  <Database className="w-3.5 h-3.5 text-sky-600" />
                  Structured Memory File (v{memory.version})
                </span>
                <button
                  type="button"
                  onClick={() => setShowMemoryInspector(false)}
                  className="text-slate-600 hover:text-slate-800 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Weak Criteria */}
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                  Weak Criteria ({memory.weak_criteria.length})
                </span>
                {memory.weak_criteria.length === 0 ? (
                  <span className="text-[11px] text-slate-600 italic">None recorded yet</span>
                ) : (
                  <div className="space-y-1 mt-0.5">
                    {memory.weak_criteria.map((w, idx) => (
                      <div key={idx} className="bg-amber-50/80 p-1.5 rounded border border-amber-200/60 text-[11px]">
                        <div className="font-mono font-semibold text-amber-900">
                          {w.criterion} (Stage {w.stage}, Score: {w.score}/5)
                        </div>
                        <div className="text-[10px] text-amber-800 line-clamp-2 mt-0.5">
                          Remediation: {w.remediation_received}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Strong Criteria */}
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Strong Criteria ({memory.strong_criteria.length})
                </span>
                {memory.strong_criteria.length === 0 ? (
                  <span className="text-[11px] text-slate-600 italic">None recorded yet</span>
                ) : (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {memory.strong_criteria.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-1.5 py-0.5 rounded font-mono"
                      >
                        {s.criterion} ({s.score}/5)
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Patterns */}
              <div>
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                  Behavioral Patterns ({memory.patterns.length})
                </span>
                {memory.patterns.length === 0 ? (
                  <span className="text-[11px] text-slate-600 italic">Extracted after stage completion</span>
                ) : (
                  <ul className="list-disc list-inside text-[11px] text-slate-700 space-y-0.5 mt-0.5">
                    {memory.patterns.map((p, idx) => (
                      <li key={idx} className="leading-snug">{p}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Session Summaries */}
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  Session Summaries ({memory.session_summaries.length})
                </span>
                {memory.session_summaries.length === 0 ? (
                  <span className="text-[11px] text-slate-600 italic">Compressed on panel close or 8 messages</span>
                ) : (
                  <div className="space-y-1 mt-0.5">
                    {memory.session_summaries.map((s, idx) => (
                      <div key={idx} className="bg-purple-50/70 p-1 rounded border border-purple-100 text-[10px] text-purple-900">
                        <span className="font-semibold">Session #{s.session}:</span>
                        <ul className="list-disc list-inside pl-1 space-y-0.5 mt-0.5">
                          {s.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-3 text-slate-600 space-y-2">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Stage-Aware AI Mentor
                  </p>
                  <p className="text-[11px] text-slate-600 max-w-[220px] leading-relaxed mt-0.5">
                    I track your rubric criteria, past weaknesses, and stage trade-offs across sessions.
                  </p>
                </div>

                {/* Quick Prompts */}
                <div className="w-full space-y-1.5 pt-1 text-left">
                  <button
                    type="button"
                    onClick={() => handleSendMessage('What are my weak criteria from prior stages and what should I watch out for?')}
                    className="w-full text-left text-[11px] p-2 bg-white rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-700 transition-colors"
                  >
                    🔍 Check my past weak criteria & warnings
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('What architectural trade-offs should I consider for my current stage?')}
                    className="w-full text-left text-[11px] p-2 bg-white rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-700 transition-colors"
                  >
                    ⚖️ Weigh trade-offs for my current stage
                  </button>
                </div>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-sky-600 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                <span className="text-[9px] text-slate-600 px-1 mt-0.5">
                  {m.role === 'user' ? 'You' : 'Mentor'}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-2 text-slate-600 text-xs bg-white rounded-xl border border-slate-200 w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                <span className="text-[11px]">Consulting memory file...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask mentor about Stage ${memory.current_stage}...`}
                disabled={isLoading}
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-40 disabled:hover:bg-sky-600 transition-colors shrink-0 cursor-pointer"
                title="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1.5 px-0.5">
              <span>Capped at 6 recent turns</span>
              <span>Memory synced</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
