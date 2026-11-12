/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Career, PhaseProgress } from '../types/career';
import { FileText, ArrowLeft, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

interface SidebarProps {
  career: Career;
  currentPhaseId: string;
  currentView: string;
  progressMap: Record<string, PhaseProgress>;
  onSelectPhase: (phaseId: string) => void;
  onGoHome: () => void;
  onGoTimeline: () => void;
  onViewRecord: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  career,
  currentPhaseId,
  currentView,
  progressMap,
  onSelectPhase,
  onGoHome,
  onViewRecord,
}) => {
  const completedCount = career.phases.filter(
    (p) => progressMap[`${career.career_id}_${p.id}`]?.evaluation
  ).length;

  return (
    <aside className="w-64 shrink-0 space-y-4 select-none">
      {/* LinkedIn-style Candidate Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Profile Cover Banner */}
        <div className="h-16 bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 relative">
          <div className="absolute -bottom-6 left-4">
            <div className="w-14 h-14 rounded-2xl bg-white p-0.5 shadow-md ring-2 ring-white">
              <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg">
                AN
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="pt-8 pb-4 px-4 space-y-3">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-heading text-sm font-bold text-slate-900 leading-tight">
                Abdulazeez Nabeel
              </h2>
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 font-medium leading-tight mt-0.5">
              {career.name} Candidate · Engineering Track
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Stages</span>
              <span className="font-mono font-bold text-slate-900">{completedCount}/8 Cleared</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Accredited</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[80px]">Production</span>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>Simulation Progress</span>
              <span>{Math.round((completedCount / 8) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / 8) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn-style Stage Feed Navigation Rail */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs space-y-1">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 px-3 py-1 block">
          Career Stages (School & Workplace)
        </span>

        <nav className="space-y-0.5">
          {career.phases.map((phase, idx) => {
            const numStr = String(idx + 1).padStart(2, '0');
            const isSelected = currentView === 'phase' && currentPhaseId === phase.id;
            const isCompleted = Boolean(progressMap[`${career.career_id}_${phase.id}`]?.evaluation);

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onSelectPhase(phase.id)}
                className={`w-full text-left py-2 px-3 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-sky-50 text-sky-900 font-bold border border-sky-100 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                    isSelected
                      ? 'bg-sky-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : numStr}
                </span>

                <span className="truncate flex-1 font-medium">{phase.label}</span>

                {isCompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
          <button
            type="button"
            onClick={onViewRecord}
            className={`w-full py-2 px-3 rounded-xl text-left transition-colors flex items-center gap-2 cursor-pointer ${
              currentView === 'record'
                ? 'bg-sky-600 text-white font-bold'
                : 'text-slate-700 hover:bg-slate-50 font-medium'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Capability Record</span>
          </button>

          <button
            type="button"
            onClick={onGoHome}
            className="w-full py-2 px-3 text-left text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch Career Track</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

interface MobilePhaseNavProps {
  career: Career;
  currentPhaseId: string;
  progressMap: Record<string, PhaseProgress>;
  onSelectPhase: (phaseId: string) => void;
}

export const MobilePhaseNav: React.FC<MobilePhaseNavProps> = ({
  career,
  currentPhaseId,
  progressMap,
  onSelectPhase,
}) => {
  return (
    <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 overflow-x-auto select-none sticky top-14 z-30 shadow-2xs">
      <div className="flex items-center gap-2 w-max">
        {career.phases.map((phase, idx) => {
          const numStr = String(idx + 1).padStart(2, '0');
          const isSelected = currentPhaseId === phase.id;
          const isCompleted = Boolean(progressMap[`${career.career_id}_${phase.id}`]?.evaluation);

          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelectPhase(phase.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span className={`font-mono text-[10px] ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                {numStr}
              </span>
              <span>{phase.label}</span>
              {isCompleted && (
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-600'}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
