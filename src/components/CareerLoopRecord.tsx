/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Career, PhaseProgress } from '../types/career';
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';

interface CareerLoopRecordProps {
  career: Career;
  allProgress: Record<string, PhaseProgress>;
  onBackToTimeline: () => void;
}

export const CareerLoopRecord: React.FC<CareerLoopRecordProps> = ({
  career,
  allProgress,
  onBackToTimeline,
}) => {
  const completedPhases: { phaseId: string; label: string; type: string; progress: PhaseProgress }[] = [];

  career.phases.forEach((phase) => {
    const key = `${career.career_id}_${phase.id}`;
    const p = allProgress[key];
    if (p && p.evaluation) {
      completedPhases.push({
        phaseId: phase.id,
        label: phase.label,
        type: phase.type,
        progress: p,
      });
    }
  });

  const totalCriteriaCount = completedPhases.reduce(
    (acc, cp) => acc + (cp.progress.evaluation?.criteria.length || 0),
    0
  );
  const totalScore = completedPhases.reduce((acc, cp) => {
    const sum = cp.progress.evaluation?.criteria.reduce((s, c) => s + c.score, 0) || 0;
    return acc + sum;
  }, 0);
  const overallAverage =
    totalCriteriaCount > 0 ? (totalScore / totalCriteriaCount).toFixed(2) : '0.00';

  const generateFullTextRecord = (): string => {
    const lines: string[] = [];
    lines.push('========================================================================');
    lines.push('CAREERLOOP CAPABILITY RECORD');
    lines.push('Accredited Professional Career Simulation & Capability Verification');
    lines.push('========================================================================\n');

    lines.push(`Discipline:             ${career.name}`);
    lines.push(`Professional body:      ${career.professional_body}`);
    lines.push(`Degree gate:            ${career.degree_gate}`);
    lines.push(`Completed stages:       ${completedPhases.length} of ${career.phases.length}`);
    lines.push(`Cumulative score:       ${overallAverage} / 5.0`);
    lines.push(`Timestamp:              ${new Date().toISOString()}`);
    lines.push(`Identifier:             CLR-${career.career_id.toUpperCase()}-${Date.now().toString(36)}\n`);

    lines.push('------------------------------------------------------------------------');
    lines.push('COMPLETED STAGES & CRITERION EVALUATIONS');
    lines.push('------------------------------------------------------------------------\n');

    if (completedPhases.length === 0) {
      lines.push('No stages evaluated yet.');
    } else {
      completedPhases.forEach((cp, idx) => {
        const { progress } = cp;
        lines.push(`[${String(idx + 1).padStart(2, '0')}] ${cp.label.toUpperCase()} (${cp.type.toUpperCase()})`);
        lines.push(`Date: ${progress.completedAt || 'Recorded'}\n`);

        lines.push('1. Prompt / Brief:');
        lines.push(progress.promptText || '[Standard brief]');
        lines.push('');

        lines.push('2. Candidate Submission:');
        lines.push(progress.submissionText || '[No submission text]');
        lines.push('');

        if (progress.evaluation && progress.evaluation.criteria) {
          lines.push('3. Rubric Scores & Quotes:');
          progress.evaluation.criteria.forEach((c) => {
            lines.push(`   * ${c.criterion}: ${c.score}/${c.max || 5}`);
            lines.push(`     Justification: ${c.justification}`);
            lines.push(`     Quote: "${c.quote_from_user}"`);
          });
          lines.push('');
        }

        if (progress.remediation && progress.remediation.lesson) {
          lines.push('4. Targeted Remediation:');
          lines.push(`   Criterion: ${progress.remediation.criterion}`);
          lines.push(`   Lesson: ${progress.remediation.lesson}`);
          lines.push(`   Practice item: ${progress.remediation.practice_item}`);
          if (progress.remediation.revisedSubmission) {
            lines.push(`   Revision: ${progress.remediation.revisedSubmission}`);
          }
          if (progress.remediation.revisedEvaluation) {
            lines.push('   Revised scores:');
            progress.remediation.revisedEvaluation.criteria.forEach((rc) => {
              lines.push(`   * ${rc.criterion}: ${rc.score}/${rc.max || 5}`);
            });
          }
          lines.push('');
        }
        lines.push('------------------------------------------------------------------------\n');
      });
    }

    lines.push('CareerLoop Capability Verification System.');
    return lines.join('\n');
  };

  const handleDownload = () => {
    const textContent = generateFullTextRecord();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareerLoop_Record_${career.career_id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-[#6b6b6b]">
        <button
          type="button"
          onClick={onBackToTimeline}
          className="flex items-center gap-1.5 hover:text-[#1c1c1c] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Career Stages</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded text-xs font-mono font-medium text-white bg-[#1f4d3d] hover:bg-[#16382c] transition-colors cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Record (.txt)</span>
        </button>
      </div>

      {/* Main Capability Document Surface */}
      <div className="bg-white border border-[#e2ded6] rounded-md overflow-hidden">
        {/* Document Header */}
        <div className="bg-[#efece6] p-6 sm:p-8 border-b border-[#e2ded6]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white border border-[#e2ded6] text-[11px] font-mono text-[#1f4d3d] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Capability Record</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1c1c1c] tracking-tight">
              {career.name} Capability Record
            </h1>

            <p className="text-xs font-mono text-[#6b6b6b]">
              Accredited under {career.professional_body} assessment framework · {career.degree_gate}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e2ded6] flex flex-wrap items-center gap-6 text-xs font-mono">
            <div>
              <span className="block text-[10px] text-[#6b6b6b] uppercase tracking-wider">Candidate</span>
              <span className="font-semibold text-[#1c1c1c]">A. Nabeel</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#6b6b6b] uppercase tracking-wider">Completed Stages</span>
              <span className="font-semibold text-[#1c1c1c]">{completedPhases.length} of {career.phases.length}</span>
            </div>
            <div>
              <span className="block text-[10px] text-[#6b6b6b] uppercase tracking-wider">Cumulative Average</span>
              <span className="font-semibold text-[#1f4d3d]">{overallAverage} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {completedPhases.length === 0 ? (
            <div className="py-12 text-center space-y-3 font-mono text-xs text-[#6b6b6b]">
              <FileText className="w-8 h-8 text-[#b8b3a9] mx-auto" />
              <h3 className="font-serif text-base font-semibold text-[#1c1c1c]">
                No Evaluated Stages Recorded Yet
              </h3>
              <p className="max-w-sm mx-auto">
                Complete simulation stages to record verified work deliverables, rubric justifications, and remediation milestones here.
              </p>
              <button
                type="button"
                onClick={onBackToTimeline}
                className="mt-2 inline-flex items-center gap-1.5 py-2 px-4 rounded text-xs font-semibold text-white bg-[#1f4d3d] hover:bg-[#16382c] cursor-pointer"
              >
                Go to Stages Timeline
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {completedPhases.map((cp, idx) => {
                const { progress } = cp;
                const evalCriteria = progress.evaluation?.criteria || [];

                return (
                  <div
                    key={cp.phaseId}
                    className="rounded border border-[#e2ded6] p-5 space-y-4 bg-[#fdfdfc]"
                  >
                    {/* Stage Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e2ded6]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#efece6] text-[#1f4d3d]">
                            Stage 0{idx + 1}
                          </span>
                          <h3 className="font-serif text-lg font-semibold text-[#1c1c1c]">
                            {cp.label}
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono text-[#6b6b6b] mt-1 block uppercase">
                          {cp.type} · Evaluated: {progress.completedAt ? new Date(progress.completedAt).toLocaleDateString() : 'Recorded'}
                        </span>
                      </div>

                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#efece6] text-[#1f4d3d] border border-[#1f4d3d]/30 font-semibold">
                        {evalCriteria.length} Criteria Verified
                      </span>
                    </div>

                    {/* Candidate Work */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6b6b6b] block">
                        Candidate Submission
                      </span>
                      <div className="bg-[#f7f6f3] rounded p-3.5 border border-[#e2ded6] text-xs text-[#2a2a2a] leading-relaxed font-mono whitespace-pre-line">
                        {progress.submissionText}
                      </div>
                    </div>

                    {/* Criteria evaluations */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6b6b6b] block">
                        Assessor Rubric Scores & Quotes
                      </span>
                      <div className="grid grid-cols-1 gap-2.5">
                        {evalCriteria.map((c, cIdx) => (
                          <div
                            key={cIdx}
                            className="bg-white rounded p-3 border border-[#e2ded6] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-mono">
                              <span className="font-semibold text-[#1c1c1c]">{c.criterion}</span>
                              <span className={`font-semibold px-2 py-0.5 rounded ${c.score >= 4 ? 'bg-[#efece6] text-[#1f4d3d]' : 'bg-[#faf4f0] text-[#8a4b2a]'}`}>
                                {c.score} / {c.max || 5}
                              </span>
                            </div>
                            <p className="text-[#6b6b6b] leading-relaxed">
                              {c.justification}
                            </p>
                            {c.quote_from_user && (
                              <blockquote className="font-serif italic text-[#1c1c1c] pl-2 border-l-2 border-[#1f4d3d] text-[11px] mt-1">
                                "{c.quote_from_user}"
                              </blockquote>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Remediation record if present */}
                    {progress.remediation && progress.remediation.lesson && (
                      <div className="bg-[#faf4f0] rounded p-3.5 border border-[#8a4b2a]/30 text-xs space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-[#8a4b2a] font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#8a4b2a]" />
                          <span>Remediation Completed on {progress.remediation.criterion}</span>
                        </div>
                        <p className="text-[#8a4b2a] leading-relaxed">
                          {progress.remediation.lesson}
                        </p>
                        {progress.remediation.revisedSubmission && (
                          <div className="bg-white p-3 rounded border border-[#8a4b2a]/20 text-xs space-y-1 font-mono">
                            <span className="text-[10px] text-[#8a4b2a] font-bold uppercase block">
                              Revised Work:
                            </span>
                            <p className="text-[#1c1c1c] whitespace-pre-line">
                              {progress.remediation.revisedSubmission}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="pt-6 border-t border-[#e2ded6] text-center text-xs text-[#6b6b6b] font-mono">
            CareerLoop Capability Record · Verified Professional Assessment
          </div>
        </div>
      </div>
    </div>
  );
};
