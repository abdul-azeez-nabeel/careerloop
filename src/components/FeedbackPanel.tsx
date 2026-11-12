/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Career, Phase, EvaluationResult, CriterionEvaluation } from '../types/career';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  FileText,
  ShieldCheck,
  Quote,
  Square
} from 'lucide-react';

interface FeedbackPanelProps {
  career: Career;
  phase: Phase;
  evaluation: EvaluationResult;
  isMuted?: boolean;
  onStartRemediation: (criterion: string, criterionDesc: string, justification: string) => void;
  onViewRecord: () => void;
  onReturnTimeline: () => void;
  onRetryPhase: () => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  career,
  phase,
  evaluation,
  isMuted = false,
  onStartRemediation,
  onViewRecord,
  onReturnTimeline,
  onRetryPhase,
}) => {
  const criteria = evaluation.criteria || [];
  const lowScoringCriteria = criteria.filter((c) => c.score <= 2);
  const avgScoreNum =
    criteria.length > 0
      ? criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length
      : 0;
  const avgScore = avgScoreNum.toFixed(1);

  // Audio TTS states
  const [loadingAudioFor, setLoadingAudioFor] = useState<string | null>(null);
  const [playingCriterion, setPlayingCriterion] = useState<string | null>(null);
  const currentAudioRef = useRef<{ audio: HTMLAudioElement; url: string } | null>(null);

  const stopCurrentAudio = () => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.audio.pause();
        currentAudioRef.current.audio.currentTime = 0;
        URL.revokeObjectURL(currentAudioRef.current.url);
      } catch (e) {
        // ignore
      }
      currentAudioRef.current = null;
    }
    setPlayingCriterion(null);
    setLoadingAudioFor(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (isMuted) {
      stopCurrentAudio();
    }
  }, [isMuted]);

  useEffect(() => {
    return () => {
      stopCurrentAudio();
    };
  }, []);

  const handleListenClick = async (criterionName: string, text: string) => {
    if (isMuted) return;

    if (playingCriterion === criterionName) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();
    setLoadingAudioFor(criterionName);

    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        // Fallback to browser SpeechSynthesis
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(text);
          u.onend = () => setPlayingCriterion(null);
          setPlayingCriterion(criterionName);
          setLoadingAudioFor(null);
          window.speechSynthesis.speak(u);
          return;
        }
        setLoadingAudioFor(null);
        return;
      }

      const data = await res.json();
      if (!data || !data.audio_base64) {
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(text);
          u.onend = () => setPlayingCriterion(null);
          setPlayingCriterion(criterionName);
          setLoadingAudioFor(null);
          window.speechSynthesis.speak(u);
          return;
        }
        setLoadingAudioFor(null);
        return;
      }

      const binaryString = atob(data.audio_base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mime_type || 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (currentAudioRef.current?.url === audioUrl) {
          currentAudioRef.current = null;
        }
        setPlayingCriterion(null);
      };

      currentAudioRef.current = { audio, url: audioUrl };
      setLoadingAudioFor(null);
      setPlayingCriterion(criterionName);

      audio.play().catch(() => {
        stopCurrentAudio();
      });
    } catch (err) {
      console.warn('TTS playback error:', err);
      stopCurrentAudio();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono text-[#6b6b6b]">
        <button
          type="button"
          onClick={onReturnTimeline}
          className="flex items-center gap-1.5 hover:text-[#1c1c1c] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Career Stages</span>
        </button>

        <span>
          {career.name} · {phase.label}
        </span>
      </div>

      {/* Main Assessor Evaluation Surface */}
      <div className="bg-white border border-[#e2ded6] rounded-md overflow-hidden">
        {/* Header Block */}
        <div className="p-6 sm:p-8 border-b border-[#e2ded6] bg-[#fdfdfc]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#efece6] text-[#1f4d3d] border border-[#1f4d3d]/30">
                  {avgScoreNum >= 3.5 ? 'Meets Professional Standard' : 'Diagnostic Feedback'}
                </span>
                <span className="text-xs text-[#b8b3a9]">·</span>
                <span className="text-xs font-mono text-[#6b6b6b]">
                  {career.professional_body} Standard
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1c1c] tracking-tight">
                {phase.label} Evaluation
              </h1>

              <p className="text-xs text-[#6b6b6b] leading-relaxed">
                Evaluated against statutory criteria: 1 = Absent, 3 = Generic / Incomplete, 5 = Specific, Justified Professional Judgment.
              </p>
            </div>

            {/* Score Box */}
            <div className="bg-[#f7f6f3] border border-[#e2ded6] rounded-md p-4 text-center shrink-0 min-w-[140px]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6b6b6b] block mb-1">
                Average Score
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-mono text-3xl font-semibold text-[#1c1c1c] leading-none">
                  {avgScore}
                </span>
                <span className="font-mono text-xs text-[#6b6b6b]">/ 5.0</span>
              </div>
              <div className="w-full h-1.5 bg-[#e2ded6] rounded mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded ${
                    avgScoreNum >= 4 ? 'bg-[#1f4d3d]' : avgScoreNum >= 3 ? 'bg-[#1f4d3d]/70' : 'bg-[#8a4b2a]'
                  }`}
                  style={{ width: `${Math.min(100, Math.round((avgScoreNum / 5) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Remediation Callout Card */}
        {lowScoringCriteria.length > 0 && (
          <div className="m-6 p-4 rounded bg-[#faf4f0] border border-[#8a4b2a]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#8a4b2a]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Targeted Practice Recommended ({lowScoringCriteria.length} criterion below 3.0)</span>
              </div>
              <p className="text-[#8a4b2a] leading-relaxed">
                Take a targeted diagnostic lesson on low-scoring criteria to refine your professional standard.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const firstLow = lowScoringCriteria[0];
                const criterionDef = phase.rubric.find((r) => r.criterion === firstLow.criterion);
                onStartRemediation(
                  firstLow.criterion,
                  criterionDef?.description || '',
                  firstLow.justification
                );
              }}
              className="py-2 px-4 rounded font-mono text-xs font-semibold text-white bg-[#8a4b2a] hover:bg-[#723c21] transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Begin Targeted Practice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Criteria Breakdown */}
        <div className="p-6 sm:p-8 space-y-6">
          <span className="font-mono text-xs uppercase tracking-wider text-[#6b6b6b] font-semibold block">
            Criterion Scores & Assessor Justifications
          </span>

          <div className="space-y-4">
            {criteria.map((item: CriterionEvaluation, idx) => {
              const criterionMeta = phase.rubric.find((r) => r.criterion === item.criterion);
              const isLow = item.score <= 2;
              const isPlayingAudio = playingCriterion === item.criterion;

              return (
                <div
                  key={item.criterion || idx}
                  className="rounded border border-[#e2ded6] bg-white p-5 space-y-3"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2ded6]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#6b6b6b]">0{idx + 1}</span>
                        <h4 className="font-mono text-sm font-semibold text-[#1c1c1c]">
                          {item.criterion}
                        </h4>
                      </div>
                      {criterionMeta && (
                        <p className="text-xs text-[#6b6b6b] mt-0.5">
                          {criterionMeta.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <button
                        type="button"
                        disabled={isMuted}
                        onClick={() => handleListenClick(item.criterion, item.justification)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                          isMuted
                            ? 'opacity-40 text-[#6b6b6b] border-[#e2ded6] cursor-not-allowed'
                            : isPlayingAudio
                            ? 'bg-[#1f4d3d] text-white border-[#1f4d3d]'
                            : 'bg-[#efece6] text-[#1c1c1c] border-[#e2ded6] hover:bg-[#e2ded6]'
                        }`}
                      >
                        {isPlayingAudio ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-[#1f4d3d]" />
                            <span>{loadingAudioFor === item.criterion ? '...' : 'Listen'}</span>
                          </>
                        )}
                      </button>

                      {/* Score Badge */}
                      <span
                        className={`font-mono text-xs font-semibold px-2.5 py-1 rounded border ${
                          item.score >= 4
                            ? 'bg-[#efece6] text-[#1f4d3d] border-[#1f4d3d]/30'
                            : item.score <= 2
                            ? 'bg-[#faf4f0] text-[#8a4b2a] border-[#8a4b2a]/30'
                            : 'bg-[#f7f6f3] text-[#1c1c1c] border-[#e2ded6]'
                        }`}
                      >
                        {item.score} / {item.max || 5}
                      </span>
                    </div>
                  </div>

                  {/* Justification */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b6b6b] block">
                      Assessor Note
                    </span>
                    <p className="text-xs text-[#2a2a2a] leading-relaxed">
                      {item.justification}
                    </p>
                  </div>

                  {/* Verbatim quote */}
                  {item.quote_from_user && (
                    <div className="bg-[#f7f6f3] border-l-2 border-[#1f4d3d] p-3 rounded-r text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#1f4d3d] font-semibold block">
                        Cited from Your Submission:
                      </span>
                      <blockquote className="font-serif italic text-[#1c1c1c] leading-relaxed">
                        "{item.quote_from_user}"
                      </blockquote>
                    </div>
                  )}

                  {/* Remediation link */}
                  {isLow && (
                    <div className="pt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          onStartRemediation(
                            item.criterion,
                            criterionMeta?.description || '',
                            item.justification
                          )
                        }
                        className="text-xs font-mono font-medium text-[#8a4b2a] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Targeted coaching on {item.criterion} →</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onRetryPhase}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Stage</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2.5">
              <button
                type="button"
                onClick={onReturnTimeline}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-mono font-semibold text-slate-800 border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                All Stages
              </button>
              <button
                type="button"
                onClick={onViewRecord}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#004182] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Capability Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
