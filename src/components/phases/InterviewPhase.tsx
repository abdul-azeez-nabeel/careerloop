/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Career, Phase, EvaluationResult } from '../../types/career';
import {
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  AlertCircle,
  Clock,
  Target,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Quote
} from 'lucide-react';

interface InterviewPhaseProps {
  career: Career;
  phase: Phase;
  initialAnswers?: Record<string, string>;
  onComplete: (submissionText: string, evaluation: EvaluationResult, answers: Record<string, string>) => void;
  onBack: () => void;
}

export const InterviewPhase: React.FC<InterviewPhaseProps> = ({
  career,
  phase,
  initialAnswers = {},
  onComplete,
}) => {
  const questions = phase.questions || [];
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAnswer = answers[currentQIdx] || '';
  const isLastQuestion = currentQIdx === questions.length - 1;

  const handleAnswerChange = (val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQIdx]: val,
    }));
  };

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) {
      setError('Please provide your response before advancing.');
      return;
    }
    setError(null);

    if (!isLastQuestion) {
      setCurrentQIdx((prev) => prev + 1);
      return;
    }

    setSubmitting(true);
    const formattedSubmission = questions
      .map((q, idx) => `Question ${idx + 1}: ${q}\nCandidate response:\n${answers[idx] || currentAnswer}`)
      .join('\n\n---\n\n');

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageType: `${phase.label} (${career.name})`,
          rubric: phase.rubric,
          submission: formattedSubmission,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Evaluation error ${res.status}`);
      }

      const evalResult: EvaluationResult = await res.json();
      onComplete(formattedSubmission, evalResult, answers);
    } catch (err: any) {
      console.error('Interview phase error:', err);
      setError(err.message || 'Failed to submit response. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Header Hub: Easily understandable at a glance */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  Stage 04 of 08
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">Panel Interview Simulation</span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
                {phase.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>~8 min panel case test</span>
            </div>
          </div>
        </div>

        {/* At-a-Glance Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Target className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Objective</span>
              <span className="font-semibold text-slate-800">Commercial Judgment, Risk & Escalation</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Interview Format</span>
              <span className="font-semibold text-slate-800">NIQS Senior Chamber Panel Simulation</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Rubric Criteria</span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={phase.rubric.map((r) => r.criterion).join(', ')}>
                {phase.rubric.map((r) => r.criterion).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Interviewer Scenario Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Panel Header & Question Navigation Pills */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-heading text-xs font-bold text-slate-900 block leading-tight">
                Senior Assessor · NIQS Interview Board
              </span>
              <span className="text-[10px] text-slate-500">
                Question {currentQIdx + 1} of {questions.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setError(null);
                  setCurrentQIdx(i);
                }}
                className={`text-xs font-mono font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  i === currentQIdx
                    ? 'bg-sky-600 text-white shadow-xs'
                    : answers[i]
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Q{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Case Prompt Bubble */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="rounded-xl bg-sky-50/60 border border-sky-100 p-5 space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-xs uppercase tracking-wider font-mono">
              <Quote className="w-4 h-4 text-sky-600" />
              <span>Oral Examination Scenario:</span>
            </div>
            <p className="font-heading text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              "{questions[currentQIdx]}"
            </p>
          </div>
        </div>
      </div>

      {/* Answer Composer */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <label htmlFor="interviewAnswer" className="font-heading text-xs font-bold text-slate-800 uppercase tracking-wider">
            Your Verbal Determination & Explanation
          </label>
          <span className="text-[11px] font-mono text-slate-500">
            {currentAnswer.trim() ? `${currentAnswer.trim().split(/\s+/).length} words` : '0 words'}
          </span>
        </div>

        <div className="space-y-2">
          <textarea
            id="interviewAnswer"
            rows={8}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Structure your verbal defense:&#10;1. State your definitive determination immediately&#10;2. Cite the specific contractual rule or measurement clause&#10;3. Outline the procedural escalation steps and risk communication to the client..."
            className="w-full text-sm text-slate-900 bg-white border border-slate-300 p-4 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all resize-y min-h-[160px] leading-relaxed font-sans"
            disabled={submitting}
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          {currentQIdx > 0 ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setCurrentQIdx((prev) => prev - 1);
              }}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Question</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !currentAnswer.trim()}
            className={`inline-flex items-center gap-2 py-2.5 px-6 rounded-xl font-heading text-xs font-bold text-white transition-all shadow-xs cursor-pointer ${
              submitting || !currentAnswer.trim()
                ? 'bg-slate-400 opacity-60 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-500 active:scale-[0.99]'
            }`}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Evaluating Response…</span>
              </span>
            ) : isLastQuestion ? (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Interview for Review</span>
              </>
            ) : (
              <>
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
