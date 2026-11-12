/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Career, Phase, PhaseProgress } from '../types/career';
import {
  Award,
  TrendingUp,
  ShieldCheck,
  Volume2,
  VolumeX,
  FileText,
  Sparkles,
  ExternalLink,
  Building2,
  GraduationCap
} from 'lucide-react';

interface RightWidgetRailProps {
  career: Career;
  currentPhase?: Phase;
  progressMap: Record<string, PhaseProgress>;
  onViewRecord: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  children?: React.ReactNode;
}

export const RightWidgetRail: React.FC<RightWidgetRailProps> = ({
  career,
  currentPhase,
  progressMap,
  onViewRecord,
  isMuted,
  onToggleMute,
  children,
}) => {
  const completedPhases = career.phases.filter(
    (p) => progressMap[`${career.career_id}_${p.id}`]?.evaluation
  );
  const completedCount = completedPhases.length;

  const totalCriteria = completedPhases.reduce(
    (acc, p) => acc + (progressMap[`${career.career_id}_${p.id}`]?.evaluation?.criteria.length || 0),
    0
  );
  const totalScore = completedPhases.reduce(
    (acc, p) =>
      acc +
      (progressMap[`${career.career_id}_${p.id}`]?.evaluation?.criteria.reduce(
        (sum, c) => sum + c.score,
        0
      ) || 0),
    0
  );
  const avgScore = totalCriteria > 0 ? (totalScore / totalCriteria).toFixed(1) : '—';

  return (
    <aside className="w-72 shrink-0 space-y-4 hidden xl:block select-none sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
      {/* Widget 1: Career Capability Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span>Capability Benchmark</span>
          </h3>
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {completedCount}/{career.phases.length} Stages
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs text-slate-600 font-medium">
            <span>Overall Readiness</span>
            <span className="font-mono text-slate-900">{Math.round((completedCount / career.phases.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / career.phases.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl mb-3 border border-slate-100">
          <div>
            <span className="text-[11px] text-slate-600 font-medium block">Average Rubric</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-mono text-lg font-bold text-slate-900">{avgScore}</span>
              <span className="text-xs text-slate-600 font-medium">/ 5.0</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-600 font-medium block">Artifact Status</span>
            <span className="text-xs font-semibold text-sky-700 mt-1 block">
              {completedCount > 0 ? 'Record Ready' : 'In Progress'}
            </span>
          </div>
        </div>

        <button
          onClick={onViewRecord}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Open Capability Record</span>
        </button>
      </div>

      {/* Widget 2: Job Market Intelligence */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-900 leading-tight">
              Bridging the Degree Gap
            </h3>
            <span className="text-[11px] text-slate-500 block">Workforce Development Track</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          In competitive, low-resource job markets, university degrees act as gatekeepers without proving practical day-one competency. CareerLoop replaces speculative CVs with certified capability records evaluated against accredited standards.
        </p>

        <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-600">Accrediting Body</span>
            <span className="font-semibold text-slate-900 truncate max-w-[130px]">{career.professional_body}</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-slate-600">Standard Gate</span>
            <span className="font-semibold text-slate-900 truncate max-w-[130px]">{career.degree_gate}</span>
          </div>
        </div>
      </div>

      {/* Widget 3: Live Assessor Rubric Context */}
      {currentPhase && currentPhase.rubric && currentPhase.rubric.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Current Evaluation Rubric</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-600">Phase {currentPhase.id}</span>
          </div>

          <div className="space-y-2.5 mt-3">
            {currentPhase.rubric.map((r) => (
              <div key={r.criterion} className="text-xs pb-2 border-b border-slate-100 last:border-b-0 last:pb-0">
                <span className="font-mono text-[11px] font-bold text-slate-900 block mb-0.5">
                  {r.criterion}
                </span>
                <p className="text-slate-600 text-[11px] leading-snug">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Widget 4: Voice TTS Engine & Audio Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMuted ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'}`}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
              <span>Gemini Audio Narrator</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sky-100 text-sky-800">TTS</span>
            </div>
            <span className="text-[11px] text-slate-600 block">
              {isMuted ? 'Audio muted' : 'Voice synthesis active (Kore)'}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleMute}
          className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
            isMuted
              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      </div>

      {/* Footer Info */}
      <div className="px-2 text-[11px] text-slate-600 space-y-1">
        <div className="flex items-center justify-between">
          <span>CareerLoop Simulation Platform</span>
          <span>v2.4</span>
        </div>
        <div>Professional Degree-to-Work Certification</div>
      </div>

      {/* Persistent AI Mentor Panel or other widgets below rail */}
      {children}
    </aside>
  );
};
