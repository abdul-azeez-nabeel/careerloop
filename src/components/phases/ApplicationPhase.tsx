/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Career, Phase, EvaluationResult } from '../../types/career';
import {
  FileText,
  CheckCircle2,
  Send,
  AlertCircle,
  Clock,
  Target,
  ShieldCheck,
  Sparkles,
  Lightbulb,
  Check
} from 'lucide-react';

interface ApplicationPhaseProps {
  career: Career;
  phase: Phase;
  initialSubmission?: string;
  onComplete: (submissionText: string, evaluation: EvaluationResult) => void;
  onBack: () => void;
}

export const ApplicationPhase: React.FC<ApplicationPhaseProps> = ({
  career,
  phase,
  initialSubmission = '',
  onComplete,
}) => {
  const [submission, setSubmission] = useState(initialSubmission);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!submission.trim()) {
      setError('Please provide your application statement before submitting.');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageType: `${phase.label} (${career.name})`,
          rubric: phase.rubric,
          submission,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Evaluation error ${res.status}`);
      }

      const evalResult: EvaluationResult = await res.json();
      onComplete(submission, evalResult);
    } catch (err: any) {
      console.error('Application phase error:', err);
      setError(err.message || 'Failed to submit application. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = submission.trim() ? submission.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      {/* Stage Header Hub: Easily understandable at a glance */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  Stage 03 of 08
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">Professional Application</span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
                {phase.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>~10 min statement</span>
            </div>
          </div>
        </div>

        {/* At-a-Glance Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Target className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Objective</span>
              <span className="font-semibold text-slate-800">Articleship Admission & Competency Evidence</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Standard Body</span>
              <span className="font-semibold text-slate-800">{career.professional_body} Admissions</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Target Rubric</span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={phase.rubric.map((r) => r.criterion).join(', ')}>
                {phase.rubric.map((r) => r.criterion).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Application Brief Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-700">
              Articleship Application Instructions & Brief
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Formal Submittal</span>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          <div className="text-sm leading-relaxed text-slate-700 font-sans whitespace-pre-line">
            {phase.brief}
          </div>

          {/* Key Checklist Callout */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider font-heading block">
              What Admissions Assessors Specifically Look For:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
              <div className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Undergraduate measurement & economics coursework synthesis</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Concrete project evidence and estimation software exposure</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Adherence to NIQS professional code of ethical conduct</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Composer Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <label htmlFor="appStatement" className="font-heading text-xs font-bold text-slate-800 uppercase tracking-wider">
            Your Candidate Competency Statement
          </label>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className={`px-2 py-0.5 rounded ${wordCount >= 100 ? 'bg-emerald-50 text-emerald-700 font-bold' : 'bg-slate-100 text-slate-600'}`}>
              {wordCount} words
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">Rec: 120-250 words</span>
          </div>
        </div>

        <div className="space-y-2">
          <textarea
            id="appStatement"
            rows={10}
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Draft your formal articleship statement:&#10;1. Academic background and coursework highlights in measurement & construction economics&#10;2. Specific project experience, taking-off sheets produced, or software utilized&#10;3. Understanding of professional duty under the NIQS code of ethics..."
            className="w-full text-sm text-slate-900 bg-white border border-slate-300 p-4 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all resize-y min-h-[180px] leading-relaxed font-sans"
            disabled={submitting}
          />
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !submission.trim()}
            className={`inline-flex items-center gap-2 py-2.5 px-6 rounded-xl font-heading text-xs font-bold text-white transition-all shadow-xs cursor-pointer ${
              submitting || !submission.trim()
                ? 'bg-slate-400 opacity-60 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-500 active:scale-[0.99]'
            }`}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Evaluating Statement…</span>
              </span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Statement for Review</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
