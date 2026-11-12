/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Career, Phase, EvaluationResult } from '../../types/career';
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  AlertCircle,
  Clock,
  Target,
  ShieldCheck,
  Sparkles,
  Lightbulb,
  FileSpreadsheet
} from 'lucide-react';

interface LessonPhaseProps {
  career: Career;
  phase: Phase;
  initialAnswers?: Record<string, string>;
  onComplete: (submissionText: string, evaluation: EvaluationResult, answers: Record<string, string>) => void;
  onBack: () => void;
}

export const LessonPhase: React.FC<LessonPhaseProps> = ({
  career,
  phase,
  initialAnswers = {},
  onComplete,
}) => {
  const lessons = phase.lessons || [];
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentLesson = lessons[currentLessonIdx];
  const currentAnswer = answers[currentLessonIdx] || '';
  const isLastLesson = currentLessonIdx === lessons.length - 1;

  const handleAnswerChange = (val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentLessonIdx]: val,
    }));
  };

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) {
      setError('Please provide your calculations before submitting.');
      return;
    }
    setError(null);

    if (!isLastLesson) {
      setCurrentLessonIdx((prev) => prev + 1);
      return;
    }

    setSubmitting(true);
    const formattedSubmission = lessons
      .map((les, idx) => {
        const title = les.title || `Lesson ${idx + 1}`;
        const ans = answers[idx] || currentAnswer;
        return `${title} — Practice task:\n${les.practice}\n\nCandidate calculation:\n${ans}`;
      })
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
      console.error('Lesson phase error:', err);
      setError(err.message || 'Failed to submit calculation. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentLesson) {
    return <div className="p-8 text-center text-sm text-slate-500">No lessons configured.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stage Header Hub: Easily understandable at a glance */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  Stage 02 of 08
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">Applied Technical Calculations</span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
                {phase.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>~8 min calculation lab</span>
            </div>
          </div>
        </div>

        {/* At-a-Glance Simulation Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Target className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Objective</span>
              <span className="font-semibold text-slate-800">Unit Rate Build-Up & Bulking/Compaction</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Grading Standard</span>
              <span className="font-semibold text-slate-800">{career.professional_body} Rate Logic</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Key Criteria</span>
              <span className="font-semibold text-slate-800">Rate Logic · Wastage & Profit Margin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Technical Module */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Module Tab Switcher */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Module {currentLessonIdx + 1}: {currentLesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
            {lessons.map((les, i) => (
              <button
                key={i}
                onClick={() => {
                  setError(null);
                  setCurrentLessonIdx(i);
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  i === currentLessonIdx
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Part {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson Body */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="text-sm leading-relaxed text-slate-700 font-sans whitespace-pre-line space-y-3">
            {currentLesson.content}
          </div>

          {/* Standard Formula Reference Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs space-y-1.5">
            <span className="font-mono text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Standard Formula Applied in this Module:
            </span>
            <div className="font-mono text-slate-900 font-semibold bg-white p-2.5 rounded-lg border border-slate-200 text-xs overflow-x-auto">
              {currentLessonIdx === 0
                ? 'Unit Rate = (Basic Material Cost + Handling + Wastage %) + Plant + (Labour / Daily Output) + Overheads & Profit %'
                : 'Bulked Haulage Volume = (Excavation In-Situ - (Backfill / Compaction Factor)) × (1 + Bulking %)'}
            </div>
          </div>
        </div>
      </div>

      {/* Applied Calculation Exercise Composer */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              Part {currentLessonIdx + 1} Task
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">Show Your Calculations</span>
          </div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentLesson.practice}
          </h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="lesson-calc" className="font-heading text-xs font-bold text-slate-700 uppercase tracking-wider">
              Calculation Sheet & Mathematical Steps
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {currentAnswer.length} characters
            </span>
          </div>

          <textarea
            id="lesson-calc"
            rows={8}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Show your clear arithmetic breakdown:&#10;1. Material quantities and assumed unit costs&#10;2. Wastage allowances (e.g. 5%)&#10;3. Daily labour team output and rate per m³&#10;4. 15% contractor overhead & profit addition..."
            className="w-full text-sm font-mono text-slate-900 bg-white border border-slate-300 p-4 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all resize-y min-h-[160px] leading-relaxed"
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
          {currentLessonIdx > 0 ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setCurrentLessonIdx((prev) => prev - 1);
              }}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Part</span>
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
                <span>Evaluating Calculations…</span>
              </span>
            ) : isLastLesson ? (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Calculations for Review</span>
              </>
            ) : (
              <>
                <span>Next Part</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
