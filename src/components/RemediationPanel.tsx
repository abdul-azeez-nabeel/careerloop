/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Career, Phase, RemediationResponse, EvaluationResult } from '../types/career';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Send,
  Target,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface RemediationPanelProps {
  career: Career;
  phase: Phase;
  criterion: string;
  criterionDescription: string;
  originalSubmission: string;
  assessorJustification: string;
  existingRemediation?: {
    lesson: string;
    practice_item: string;
    revisedSubmission?: string;
    revisedEvaluation?: EvaluationResult;
  };
  onCompleteRevision: (
    lesson: string,
    practiceItem: string,
    revisedSubmission: string,
    revisedEvaluation: EvaluationResult
  ) => void;
  onBack: () => void;
}

export const RemediationPanel: React.FC<RemediationPanelProps> = ({
  career,
  phase,
  criterion,
  criterionDescription,
  originalSubmission,
  assessorJustification,
  existingRemediation,
  onCompleteRevision,
  onBack,
}) => {
  const [loadingLesson, setLoadingLesson] = useState(!existingRemediation);
  const [lessonData, setLessonData] = useState<RemediationResponse | null>(
    existingRemediation
      ? { lesson: existingRemediation.lesson, practice_item: existingRemediation.practice_item }
      : null
  );
  const [revisionText, setRevisionText] = useState(
    existingRemediation?.revisedSubmission || ''
  );
  const [submittingRevision, setSubmittingRevision] = useState(false);
  const [hasResubmitted, setHasResubmitted] = useState(
    Boolean(existingRemediation?.revisedSubmission)
  );
  const [revisedEvaluation, setRevisedEvaluation] = useState<EvaluationResult | null>(
    existingRemediation?.revisedEvaluation || null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingRemediation) return;

    let isMounted = true;
    const fetchLesson = async () => {
      setLoadingLesson(true);
      setError(null);
      try {
        const res = await fetch('/api/remediate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            criterion,
            criterionDescription,
            submission: originalSubmission,
            justification: assessorJustification,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server status ${res.status}`);
        }

        const data: RemediationResponse = await res.json();
        if (isMounted) {
          setLessonData(data);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error('Failed to load remediation:', err);
          setError(err.message || 'Unable to load remediation lesson.');
        }
      } finally {
        if (isMounted) {
          setLoadingLesson(false);
        }
      }
    };

    fetchLesson();
    return () => {
      isMounted = false;
    };
  }, [criterion, criterionDescription, originalSubmission, assessorJustification, existingRemediation]);

  const handleRevisionSubmit = async () => {
    if (!revisionText.trim()) {
      setError('Please provide your revised response.');
      return;
    }
    if (hasResubmitted) {
      setError('Only one resubmission is permitted.');
      return;
    }

    setError(null);
    setSubmittingRevision(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stageType: `Revision · ${criterion} (${phase.label})`,
          rubric: phase.rubric,
          submission: revisionText,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server status ${res.status}`);
      }

      const evalResult: EvaluationResult = await res.json();
      setRevisedEvaluation(evalResult);
      setHasResubmitted(true);

      if (lessonData) {
        onCompleteRevision(lessonData.lesson, lessonData.practice_item, revisionText, evalResult);
      }
    } catch (err: any) {
      console.error('Revision evaluation error:', err);
      setError(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setSubmittingRevision(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between text-xs font-mono text-[#6b6b6b]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 hover:text-[#1c1c1c] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Assessment</span>
        </button>

        <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#faf4f0] text-[#8a4b2a] border border-[#8a4b2a]/30">
          Targeted Coaching: {criterion}
        </span>
      </div>

      {/* Main Coaching Card */}
      <div className="bg-white border border-[#e2ded6] rounded-md overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 border-b border-[#e2ded6] bg-[#fdfdfc]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <span className="font-mono text-xs uppercase tracking-wider text-[#8a4b2a] font-semibold block">
                Targeted Criterion Coaching
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1c1c] tracking-tight">
                Strengthening: {criterion}
              </h1>
              <p className="text-xs text-[#6b6b6b]">
                Standard: {criterionDescription}
              </p>
            </div>

            <div className="bg-[#f7f6f3] border border-[#e2ded6] px-3 py-1.5 rounded self-start shrink-0 text-center text-xs font-mono">
              <span className="text-[10px] text-[#6b6b6b] uppercase tracking-wider block">Policy</span>
              <span className="font-bold text-[#1c1c1c]">
                {hasResubmitted ? 'Revision Recorded' : '1 Attempt Allowed'}
              </span>
            </div>
          </div>
        </div>

        {loadingLesson ? (
          <div className="p-14 text-center space-y-3 font-mono text-xs text-[#6b6b6b]">
            <div className="w-6 h-6 border-2 border-[#1f4d3d] border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Diagnosing criterion deficiency against your original submission…</p>
          </div>
        ) : lessonData ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Diagnostic Lesson */}
            <div className="rounded border border-[#e2ded6] bg-[#f7f6f3] p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#1f4d3d]">
                <Lightbulb className="w-4 h-4 text-[#1f4d3d]" />
                <span>Diagnostic Principle & Rule</span>
              </div>
              <p className="text-xs text-[#1c1c1c] leading-relaxed">
                {lessonData.lesson}
              </p>
            </div>

            {/* Practice Exercise */}
            <div className="rounded border border-[#e2ded6] bg-white p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#8a4b2a] uppercase tracking-wider">
                <Target className="w-4 h-4 text-[#8a4b2a]" />
                <span>Practice Exercise Prompt</span>
              </div>
              <p className="text-xs text-[#1c1c1c] font-medium leading-relaxed">
                {lessonData.practice_item}
              </p>
            </div>

            {/* Revision Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between font-mono text-xs text-[#6b6b6b]">
                <label htmlFor="revision-text" className="font-semibold text-[#1c1c1c] uppercase tracking-wider">
                  Your Revised Response
                </label>
                <span>{revisionText.length} characters</span>
              </div>

              <textarea
                id="revision-text"
                rows={8}
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
                disabled={hasResubmitted || submittingRevision}
                placeholder="Write your revised response applying the standard..."
                className={`w-full text-xs font-mono rounded p-4 border transition-all resize-y outline-none leading-relaxed ${
                  hasResubmitted
                    ? 'bg-[#f7f6f3] border-[#e2ded6] text-[#6b6b6b] cursor-not-allowed'
                    : 'bg-white border-[#e2ded6] focus:border-[#1f4d3d] text-[#1c1c1c]'
                }`}
              />

              {error && (
                <div className="p-3 rounded bg-[#faf4f0] text-[#8a4b2a] text-xs font-mono flex items-center gap-2 border border-[#8a4b2a]/30">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Revised Score Summary if evaluated */}
              {hasResubmitted && revisedEvaluation && (
                <div className="rounded border border-[#1f4d3d]/30 bg-[#efece6] p-4 space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#1f4d3d]">
                    <CheckCircle2 className="w-4 h-4 text-[#1f4d3d]" />
                    <span>Revision Assessment Evaluated & Stored to Capability Record</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {revisedEvaluation.criteria.map((c) => (
                      <div key={c.criterion} className="flex justify-between items-center bg-white p-2.5 rounded border border-[#e2ded6]">
                        <span className="font-medium text-[#1c1c1c]">{c.criterion}</span>
                        <span className="font-bold text-[#1f4d3d]">{c.score}/{c.max || 5}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#e2ded6]">
                <button
                  type="button"
                  onClick={onBack}
                  className="py-2 px-4 rounded text-xs font-mono text-[#6b6b6b] hover:text-[#1c1c1c] border border-[#e2ded6] hover:bg-[#f7f6f3] cursor-pointer"
                >
                  Return to Assessment
                </button>

                {!hasResubmitted ? (
                  <button
                    type="button"
                    onClick={handleRevisionSubmit}
                    disabled={submittingRevision || !revisionText.trim()}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded text-xs font-semibold text-white bg-[#1f4d3d] hover:bg-[#16382c] disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingRevision ? 'Evaluating Revision…' : 'Submit Revision for Record'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 py-2 px-4 rounded text-xs font-semibold text-white bg-[#1f4d3d] hover:bg-[#16382c] transition-colors cursor-pointer"
                  >
                    <span>View Assessment Record</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
