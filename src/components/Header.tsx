/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  FileText,
  Volume2,
  VolumeX,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Layers,
  Play
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  careerName?: string;
  phaseLabel?: string;
  hasAnyCompletedPhases?: boolean;
  completedCount?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onGoHome: () => void;
  onGoTimeline?: () => void;
  onGoSimulation?: () => void;
  onViewRecord?: () => void;
  onResetProgress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  careerName = 'Mobile App Developer',
  phaseLabel,
  completedCount = 0,
  isMuted = false,
  onToggleMute,
  onGoHome,
  onGoTimeline,
  onGoSimulation,
  onViewRecord,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 h-14 select-none shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: Brand Icon & Search Box */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            title="CareerLoop Home"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0a66c2] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-[#004182] transition-colors">
              CL
            </div>
            <div className="hidden sm:block">
              <span className="font-heading font-black text-lg text-slate-900 tracking-tight leading-none block">
                Career<span className="text-[#0a66c2]">Loop</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-medium block leading-tight">
                Career Simulation Network
              </span>
            </div>
          </button>

          {/* LinkedIn-style Search Bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <input
              type="text"
              readOnly
              value="Search workplace tasks, BESMM4, milestones..."
              className="w-full bg-[#edf3f8] hover:bg-[#e4ecf3] text-slate-600 text-xs rounded-md pl-8 pr-3 py-1.5 border border-transparent focus:outline-none cursor-pointer font-sans"
              onClick={onGoTimeline}
            />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Center: Social Navigation Tabs (LinkedIn / Facebook Top Bar) */}
        <nav className="flex items-center justify-center gap-1 sm:gap-4 md:gap-6">
          {/* Home / Tracks */}
          <button
            type="button"
            onClick={onGoHome}
            className={`flex flex-col items-center justify-center px-2 py-1 transition-colors cursor-pointer relative group ${
              currentView === 'select'
                ? 'text-slate-900'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium hidden sm:block">Tracks</span>
            {currentView === 'select' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
            )}
          </button>

          {/* All 8 Stages */}
          {onGoTimeline && (
            <button
              type="button"
              onClick={onGoTimeline}
              className={`flex flex-col items-center justify-center px-2 py-1 transition-colors cursor-pointer relative group ${
                currentView === 'timeline'
                  ? 'text-[#0a66c2]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Layers className="w-5 h-5 mb-0.5" />
                <span className="absolute -top-1 -right-2 bg-slate-100 text-slate-700 text-[9px] font-mono font-bold px-1 rounded-full border border-slate-300">
                  8
                </span>
              </div>
              <span className="text-[10px] font-medium hidden sm:block">Career Stages</span>
              {currentView === 'timeline' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a66c2] rounded-full" />
              )}
            </button>
          )}

          {/* Workplace Career Simulation */}
          {onGoSimulation && (
            <button
              type="button"
              onClick={onGoSimulation}
              className={`flex flex-col items-center justify-center px-2 py-1 transition-colors cursor-pointer relative group ${
                currentView === 'phase'
                  ? 'text-[#0a66c2]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Play className="w-5 h-5 mb-0.5 fill-current" />
                <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-medium hidden sm:block">Workplace Sim</span>
              {currentView === 'phase' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a66c2] rounded-full" />
              )}
            </button>
          )}

          {/* Capability Record */}
          {onViewRecord && (
            <button
              type="button"
              onClick={onViewRecord}
              className={`flex flex-col items-center justify-center px-2 py-1 transition-colors cursor-pointer relative group ${
                currentView === 'record'
                  ? 'text-[#0a66c2]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <FileText className="w-5 h-5 mb-0.5" />
                {completedCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-emerald-600 text-white text-[9px] font-mono font-bold px-1 rounded-full">
                    {completedCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium hidden sm:block">Portfolio Audit</span>
              {currentView === 'record' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a66c2] rounded-full" />
              )}
            </button>
          )}
        </nav>

        {/* Right: Audio Narration & Candidate Profile Pill */}
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
          {/* TTS Audio Narration Toggle */}
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Audio Narration' : 'Mute Audio Narration'}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#0a66c2]" />}
              <span className="text-[11px] hidden lg:inline font-medium">{isMuted ? 'Muted' : 'Audio ON'}</span>
            </button>
          )}

          {/* Regulated Accreditation Badge */}
          <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-50 text-[#0a66c2] text-[11px] font-medium border border-sky-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0a66c2]" />
            <span>IEEE · ACM · DEV</span>
          </div>

          {/* Candidate Profile Avatar (LinkedIn style) */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={onViewRecord}>
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0a66c2] to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs">
                AN
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight group-hover:text-[#0a66c2]">
                A. Nabeel
              </span>
              <span className="text-[10px] text-slate-500 font-mono block leading-tight">
                Mobile Engineer
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
