/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Career } from '../types/career';
import { ArrowRight, Lock } from 'lucide-react';

interface CareerSelectProps {
  careers: Career[];
  onSelectCareer: (careerId: string) => void;
  completedPhasesByCareer: Record<string, string[]>;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const CareerSelect: React.FC<CareerSelectProps> = ({
  careers,
  onSelectCareer,
  completedPhasesByCareer,
}) => {
  const liveCareer = careers.find((c) => c.career_id === 'mobile_dev') || careers[0];
  const upcomingCareers = careers.filter((c) => c.career_id !== liveCareer.career_id);
  const liveCompletedCount = (completedPhasesByCareer[liveCareer.career_id] || []).length;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#f3f2ef] text-slate-900 flex items-center justify-center px-4 sm:px-8 py-10">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Wordmark & Tagline Entrance */}
        <div className="lg:col-span-5 space-y-6 pt-2">
          {/* Card Shell */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center font-black text-xl shadow-xs">
                CL
              </div>
              <div>
                <span className="font-heading font-black text-xl text-slate-900 tracking-tight leading-none block">
                  Career<span className="text-[#0a66c2]">Loop</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Interactive Professional Career Game
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="font-heading text-2xl font-black text-slate-900 tracking-tight leading-snug">
                Live your career before committing to it.
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Experience every stage of your real-world career — from school fundamentals and interactive practical internships to high-stakes recruitment, salary negotiations, and demanding executive deliverables.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-900 font-bold text-sm">8 Stages</span>
                <span className="text-[10px] text-slate-500">School to VP</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-900 font-bold text-sm">Interactive</span>
                <span className="text-[10px] text-slate-500">Tasks & Code</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-slate-900 font-bold text-sm">Negotiate</span>
                <span className="text-[10px] text-slate-500">Salary & PRs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Stacked Career Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
              Available Career Tracks
            </span>
            <span className="font-mono text-xs text-[#0a66c2] font-semibold bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
              1 Active Simulation · 7 Upcoming
            </span>
          </div>

          {/* Active Live Mobile Dev Card */}
          {liveCareer && (
            <div
              onClick={() => onSelectCareer(liveCareer.career_id)}
              className="bg-white rounded-2xl border-2 border-[#0a66c2]/80 p-6 shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md hover:border-[#0a66c2] group select-none relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-[#0a66c2] text-white text-[10px] font-mono font-bold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                FEATURED CAREER GAME
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    <h2 className="font-heading text-xl font-black text-slate-900 group-hover:text-[#0a66c2] transition-colors">
                      {liveCareer.name}
                    </h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    Journey through 8 realistic career stages: from Computer Science fundamentals to internship debugging, technical coding interviews, salary negotiations with strict vs relaxed managers, and scaling apps to millions of daily users.
                  </p>

                  <div className="space-y-1 pt-1 text-[11px] text-slate-500 font-mono">
                    <p className="truncate">🎯 Prerequisite: {liveCareer.degree_gate}</p>
                    <p className="truncate">🏛️ Standard: {liveCareer.professional_body}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 self-center">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a66c2] group-hover:bg-[#004182] text-white text-xs font-heading font-black shadow-sm transition-all"
                  >
                    <span>{liveCompletedCount > 0 ? `Resume (${liveCompletedCount}/8)` : 'Play Career Game'}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <span className="font-mono text-[10px] text-slate-400">
                    Live Simulator · Zero Setup
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Tracks Stack */}
          <div className="space-y-2.5 pt-1">
            {upcomingCareers.slice(0, 3).map((career) => (
              <div
                key={career.career_id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 opacity-70 select-none flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5 min-w-0">
                  <h3 className="font-heading text-sm font-bold text-slate-900">
                    {career.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    {career.degree_gate}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 shrink-0 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                  <Lock className="w-3 h-3" />
                  <span>Next Update</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
