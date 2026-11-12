/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Career, Phase, EvaluationResult } from '../../types/career';
import {
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Send,
  AlertCircle,
  Clock,
  Target,
  ShieldCheck,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface ReadingPhaseProps {
  career: Career;
  phase: Phase;
  initialAnswers?: Record<string, string>;
  onComplete: (submissionText: string, evaluation: EvaluationResult, answers: Record<string, string>) => void;
  onBack: () => void;
}

export const ReadingPhase: React.FC<ReadingPhaseProps> = ({
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
      setError('Please provide an answer before continuing.');
      return;
    }
    setError(null);

    if (!isLastQuestion) {
      setCurrentQIdx((prev) => prev + 1);
      return;
    }

    setSubmitting(true);
    const formattedSubmission = questions
      .map((q, idx) => `Question ${idx + 1}: ${q}\nCandidate answer:\n${answers[idx] || currentAnswer}`)
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
      console.error('Reading phase error:', err);
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
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  Stage 01 of 08
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">Foundational Reading</span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
                {phase.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>~6 min read & comprehension</span>
            </div>
          </div>
        </div>

        {/* At-a-Glance Simulation Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Target className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Stage Objective</span>
              <span className="font-semibold text-slate-800">Master Measurement Rules & Legal Fiduciary Role</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Grading Standard</span>
              <span className="font-semibold text-slate-800">{career.professional_body} Assessment Rubric</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Evaluated Rubric</span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={phase.rubric.map((r) => r.criterion).join(', ')}>
                {phase.rubric.map((r) => r.criterion).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Brief Card with Clean Scannability */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-700">
              Curriculum Text & Statutory Framework
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">BESMM4 / NRM2 Standard</span>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          <div className="text-sm leading-relaxed text-slate-700 font-sans whitespace-pre-line space-y-3">
            {phase.content}
          </div>

          {/* Key Rule Highlight Box */}
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4 text-xs text-sky-950 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-sky-900 block">Assessor Tip for Scoring 5/5:</span>
              <p className="leading-relaxed text-sky-800">
                Ground your answers in exact measurement rules: explain net measurement implications on contractor risk, and specify the legal vesting instruments required before off-site materials can be certified.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Response Composer */}
      {questions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
          {/* Question Stepper Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-sky-700">
                Question {currentQIdx + 1} of {questions.length}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">Comprehension Verification</span>
            </div>

            {/* Step progress pills */}
            <div className="flex items-center gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setError(null);
                    setCurrentQIdx(i);
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                    i === currentQIdx
                      ? 'bg-sky-600 text-white shadow-xs'
                      : answers[i]
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  Q{i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Active Question Box */}
          <div className="rounded-xl bg-slate-50/80 p-4 sm:p-5 border border-slate-200/70">
            <span className="text-[10px] uppercase font-mono font-bold text-sky-700 tracking-wider block mb-1">
              Active Question Prompt:
            </span>
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {questions[currentQIdx]}
            </h3>
          </div>

          {/* Textarea Composer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="reading-answer" className="font-heading text-xs font-bold text-slate-700 uppercase tracking-wider">
                Your Professional Analysis
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {currentAnswer.trim() ? `${currentAnswer.trim().split(/\s+/).length} words` : '0 words'}
              </span>
            </div>

            <textarea
              id="reading-answer"
              rows={7}
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="State your technical answer referencing standard measurement rules, contractual implications, and required verification instruments..."
              className="w-full text-sm text-slate-900 bg-white border border-slate-300 p-4 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all resize-y min-h-[150px] leading-relaxed font-sans"
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Navigation Controls */}
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
                  <span>Scoring Against Rubric…</span>
                </span>
              ) : isLastQuestion ? (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Rubric Evaluation</span>
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
      )}
    </div>
  );
};
