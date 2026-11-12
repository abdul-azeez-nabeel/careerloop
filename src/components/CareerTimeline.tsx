/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Career, PhaseProgress } from '../types/career';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  FileText,
  Clock,
  Play,
  Check,
  ShieldCheck
} from 'lucide-react';

interface CareerTimelineProps {
  career: Career;
  phaseProgressMap: Record<string, PhaseProgress>;
  onSelectPhase: (phaseId: string) => void;
  onViewRecord: () => void;
  onBackToSelect: () => void;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({
  career,
  phaseProgressMap,
  onSelectPhase,
  onViewRecord,
}) => {
  const completedCount = career.phases.filter(
    (p) => phaseProgressMap[`${career.career_id}_${p.id}`]?.evaluation
  ).length;

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
                Career Roadmap & Milestones
              </span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0a66c2] font-bold border border-sky-100">
                {completedCount}/8 Cleared
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              📱 {career.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Accredited Standard: {career.professional_body} · Gate: {career.degree_gate}
            </p>
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={onViewRecord}
              className="px-4 py-2 text-xs font-mono font-medium rounded border border-[#1f4d3d] text-[#1f4d3d] hover:bg-[#1f4d3d] hover:text-white transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Capability Record</span>
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Experience the authentic mobile engineering journey from university foundations to VP of Engineering. Each stage contains interactive learning first, code & log inspection on a device simulator, performance workbench calculations, team reviews with strict vs relaxed superiors (including salary negotiations), and an assessed professional deliverable.
        </p>
      </div>

      {/* 8 Sequential Stages */}
      <div className="space-y-3">
        {career.phases.map((phase, idx) => {
          const numStr = String(idx + 1).padStart(2, '0');
          const isLive = phase.status === 'live';
          const progress = phaseProgressMap[`${career.career_id}_${phase.id}`];
          const hasCompleted = Boolean(progress?.evaluation);

          const avgScore =
            hasCompleted && progress?.evaluation
              ? (
                  progress.evaluation.criteria.reduce((acc, curr) => acc + curr.score, 0) /
                  progress.evaluation.criteria.length
                ).toFixed(1)
              : null;

          if (isLive) {
            return (
              <div
                key={phase.id}
                onClick={() => onSelectPhase(phase.id)}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all cursor-pointer group hover:border-[#0a66c2] hover:shadow-md ${
                  hasCompleted ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/90'
                }`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs font-bold px-2.5 py-1 rounded-xl ${
                        hasCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-sky-50 text-[#0a66c2] group-hover:bg-[#0a66c2] group-hover:text-white transition-colors'
                      }`}
                    >
                      {numStr}
                    </span>
                    <div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#0a66c2] transition-colors flex items-center gap-2">
                        {phase.label}
                        {hasCompleted && <Check className="w-4 h-4 text-emerald-600" />}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                        {phase.id === 'learn' ? (
                          <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            🎓 School Foundations: 4 Subsections & Interactive Quizzes (Zero Tasks)
                          </span>
                        ) : (
                          <span>Workplace Stage (Practicals · Tech Workbench · Superiors · Deliverable)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                      hasCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {hasCompleted ? 'Graduated ✓' : phase.id === 'learn' ? 'Class Open' : 'Ready'}
                  </span>
                </div>

                {/* Interactive Stages Strip */}
                {phase.id === 'learn' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3 text-[10px] font-mono">
                    <span className="px-2 py-1 rounded-lg bg-sky-50 border border-sky-100 text-[#0a66c2] truncate font-bold">
                      1. Handheld Basics 📱
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-sky-50 border border-sky-100 text-[#0a66c2] truncate font-bold">
                      2. Industries 🏢
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-sky-50 border border-sky-100 text-[#0a66c2] truncate font-bold">
                      3. Pre-Graduation 🎓
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 truncate font-bold">
                      4. Graduation Quiz 🎯
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3 text-[10px] font-mono">
                    <span className="px-2 py-1 rounded-lg bg-sky-50 border border-sky-100 text-sky-900 truncate font-bold">
                      1. Learn First 📖
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 truncate font-semibold">
                      2. Code & Audit 💻
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 truncate font-semibold">
                      3. Team Review 👥
                    </span>
                    <span className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 truncate font-semibold">
                      4. Deliverable 🚀
                    </span>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed font-sans mb-3">
                  {phase.brief || phase.content?.slice(0, 180) + '...'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{phase.rubric.length} Assessment Criteria</span>
                  </div>

                  {hasCompleted && avgScore ? (
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">Score:</span>
                      <span className="font-mono text-xs font-bold text-amber-700 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                        ⭐ {avgScore} / 5.0
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0a66c2]" />
                    </div>
                  ) : (
                    <span className="font-mono text-xs font-bold text-[#0a66c2] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>{phase.id === 'learn' ? 'Enter School Class & Quizzes' : 'Enter Stage Tasks'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          }

          // Designed stage fallback
          return (
            <div
              key={phase.id}
              className="bg-white/60 border border-[#e2ded6] rounded-md p-4 opacity-70 select-none flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#6b6b6b] px-2 py-1 rounded bg-[#efece6]">
                  {numStr}
                </span>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#1c1c1c]">
                    {phase.label}
                  </h4>
                  <span className="text-[11px] text-[#6b6b6b] font-mono">
                    Advanced Stage
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-[#6b6b6b]">
                <Lock className="w-3.5 h-3.5" />
                <span>Pending</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
