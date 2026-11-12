/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Career, Phase, EvaluationResult } from '../../types/career';
import {
  Briefcase,
  CheckCircle2,
  Send,
  AlertCircle,
  FileCode,
  Sparkles,
  Clock,
  Target,
  ShieldCheck,
  Building2,
  Layers
} from 'lucide-react';

interface TaskPhaseProps {
  career: Career;
  phase: Phase;
  initialSubmission?: string;
  onComplete: (submissionText: string, evaluation: EvaluationResult) => void;
  onBack: () => void;
}

export const TaskPhase: React.FC<TaskPhaseProps> = ({
  career,
  phase,
  initialSubmission = '',
  onComplete,
}) => {
  const [submission, setSubmission] = useState(initialSubmission);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStageNumber = (id: string) => {
    switch (id) {
      case 'internship':
        return 'Stage 05 of 08';
      case 'junior':
        return 'Stage 06 of 08';
      case 'mid':
        return 'Stage 07 of 08';
      case 'senior':
        return 'Stage 08 of 08';
      default:
        return 'Workplace Task';
    }
  };

  const getStageSeniority = (id: string) => {
    switch (id) {
      case 'internship':
        return 'Internship Trainee Deliverable';
      case 'junior':
        return 'Junior QS Site Valuation Audit';
      case 'mid':
        return 'Mid-Level Commercial Determination';
      case 'senior':
        return 'Executive Director Advisory Paper';
      default:
        return 'Workplace Task Deliverable';
    }
  };

  const handleSubmit = async () => {
    if (!submission.trim()) {
      setError('Please provide your work submission before submitting.');
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
      console.error('Task phase error:', err);
      setError(err.message || 'Failed to submit work. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const insertTemplate = () => {
    if (phase.id === 'internship') {
      setSubmission(`PRELIMINARY BILL OF QUANTITIES (BOQ) & COST-LOGIC BREAKDOWN
PROJECT: 3-Bedroom Detached Bungalow (140 m² GEA)
SITE CONDITIONS: Firm Sandy Clay, Dry Season, Assumed Water Table > 2.5m

1. WORK SECTIONS BREAKDOWN:
- Substructure:
  * Site clearance (topsoil stripping 150mm depth) - m²
  * Trench excavation for strip foundation (750mm depth x 675mm width) - m³
  * Plain concrete footing (1:3:6 / 15 N/mm² - 225mm thick) - m³
  * 225mm solid sandcrete foundation blockwork in 1:4 mortar up to DPC - m²
  * 150mm consolidated hardcore bed with 50mm sand blinding - m²
  * 1000-gauge polythene damp-proof membrane and bituminous DPC - m²
  * 150mm reinforced concrete ground floor slab (1:2:4 / 20 N/mm²) - m³

- Superstructure:
  * 225mm hollow sandcrete blockwork in 1:4 cement-sand mortar - m²
  * Reinforced concrete lintels, isolated columns, and continuous ring tie-beam (1:2:4) - m³

- Roof Structure & Covering:
  * Sawn hardwood timber trusses, purlins, and wall plates treated with anti-termite chemical - m
  * 0.55mm aluminium long-span roofing sheets with ridge caps, valleys, and flashing - m²

- Finishes & Fittings:
  * 12mm internal cement-sand plastering and external tyrolean rendering - m²
  * Vitrified non-slip ceramic floor tiles laid on screeded bed - m²
  * Panel internal hardwood doors, glazed aluminium sliding windows, and security doors - nr

- Services Rough-In & Preliminaries:
  * Electrical PVC conduit piping, wiring loop-in, and consumer distribution board - Item
  * 100mm PVC soil pipes, gully traps, and inspection chambers - Item
  * Preliminaries: temporary site hoardings, site office, water/power supply, plant mobilisation - Lump sum

2. STATED TECHNICAL ASSUMPTIONS:
- Waste allowances: Concrete 5%, Sandcrete blocks 7.5%, Floor tiles 8%, Timber 6%
- Mix designs: Blinding 1:4:8, Footings 1:3:6, Slabs/Columns 1:2:4
- Contingency: 5% provisional sum for subterranean obstructions

3. RATE BUILD-UP LOGIC (BESMM4 / NRM2):
- Unit Rate = Delivered Material Cost + Handling/Storage + Plant Hire + Direct Artisan Labour Output + 15% Overhead & Profit.`);
    } else if (phase.id === 'junior') {
      setSubmission(`INTERIM PAYMENT RECOMMENDATION & VARIATION AUDIT
PROJECT: Commercial Shopping Plaza (Contract Sum: ₦450,000,000.00)
CONTRACTOR APPLICATION: No. 04

1. ON-SITE PHYSICAL MEASUREMENT AUDIT:
- Substructure: 100% complete as measured on site. Verified against structural inspection sign-off sheets.
- Superstructure Frame: Ground to First floor columns certified at 60% completion. Total structural work verified = ₦68,500,000.00.

2. CONTRACTUAL VARIATION ASSESSMENT:
- Claim A (₦8.5M - Unexpected Foundation Deepening):
  * Determination: VALID. Subterranean conditions differed materially from geotechnical borehole logs. Architect issued Site Instruction No. 12 directing 1.2m additional excavation to reach firm strata.
  * Valuation: Measured on agreed contract bill rates for bulk excavation and mass concrete. Recommended allowance = ₦7,800,000.00.
- Claim B (₦5.7M - Equipment Standing Idle during Community Protest):
  * Determination: INVALID. Under standard contract terms, civil unrest constitutes a neutral Force Majeure event entitling contractor to Extension of Time (EOT) without financial prolongation damages. Rejected in full.

3. VALUATION CERTIFICATE RECOMMENDATION:
- Gross Value of Works Executed: ₦68,500,000.00
- Approved Variations: ₦7,800,000.00
- Total Gross Certified: ₦76,300,000.00
- Less: 5% Contract Retention: -₦3,815,000.00
- Less: Previous Certificates (Nos. 01-03): -₦42,000,000.00
- NET AMOUNT RECOMMENDED FOR PAYMENT: ₦30,485,000.00`);
    } else if (phase.id === 'mid') {
      setSubmission(`COMMERCIAL DETERMINATION REPORT: EXTENSION OF TIME & LOSS/EXPENSE
PROJECT: 10-Storey Commercial Development (₦2.8 Billion Contract)
CONTRACTOR CLAIM: 45 Days EOT & ₦52.8M Direct Loss/Expense

1. EXTENSION OF TIME (EOT) CRITICAL PATH ANALYSIS:
- Event 1 (Delayed MEP Basement Drawings): Architect issued drawings 28 days late, directly delaying the critical-path basement slab pour. Compensable Relevant Event = 28 Days EOT Granted.
- Event 2 (Logistics Union Fuel Strike): National transport strike constitutes a neutral statutory disruption. Non-compensable Force Majeure = 12 Days EOT Granted without financial prolongation.
- Total EOT Recommended: 40 Days (revised contract completion date adjusted accordingly).

2. DIRECT LOSS AND EXPENSE AUDIT:
- Site Overheads (Tower Crane, Resident PM, Site Security): Allowable for the 28-day employer-caused delay only = ₦18,400,000.00.
- Unabsorbed Head Office Overheads: Contractor applied uncalibrated Emden Formula without proving loss of other bidding opportunities. Disallowed.
- Financing & Inflation Claims: Disallowed per fixed-price contract provisions.
- Total Certified Loss and Expense: ₦18,400,000.00.

3. COMMERCIAL SETTLEMENT STRATEGY:
- Recommend immediate formal determination of 40 days EOT and ₦18.4M compensation in exchange for a binding contractor waiver of all consequential claims, safeguarding client milestone handover.`);
    } else if (phase.id === 'senior') {
      setSubmission(`EXECUTIVE ADVISORY PAPER: VALUE ENGINEERING & PROCUREMENT STRATEGY
PROJECT: Specialist Teaching Hospital (₦12 Billion Initial Budget)
EXCESS OVER BUDGET: 24% (₦2.88 Billion Tender Variance)

1. VALUE ENGINEERING (VE) INTERVENTIONS:
- Proposal 1 (Building Envelope): Substitute imported bespoke double-glazed unitized curtain walling with locally fabricated high-performance thermally broken aluminium composite panels and solar-control louvres. Expected saving: ₦820 Million (7.0% CapEx reduction).
- Proposal 2 (Structural Framing): Replace in-situ post-tensioned beam grid with precast hollow-core slab units and reinforced concrete frame. Expected saving: ₦480 Million (4.0% CapEx reduction).
- Proposal 3 (Modular MEP Plant): Standardize modular packaged air-cooled chillers rather than custom central absorption plant. Expected saving: ₦540 Million (4.5% CapEx reduction).
- Total Immediate CapEx Recovered: ₦1.84 Billion (15.5% savings achieved without compromising healthcare compliance).

2. PROCUREMENT ROUTE APPRAISAL:
- Recommendation: Two-Stage Early Contractor Involvement (ECI) transitioning into a Guaranteed Maximum Price (GMP) Design & Build contract.
- Rationale: Fully transfers foreign exchange fluctuation and material escalation risk to the contractor consortium while locking final milestone delivery.

3. 25-YEAR WHOLE LIFE COSTING (WLC) FRAMEWORK:
- Analysis demonstrates that high-efficiency LED smart controls and localized VRF air conditioning reduce annual energy consumption by 28%, offsetting CapEx differences within 4.2 years of clinical operations.`);
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
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                  {getStageNumber(phase.id)}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">{getStageSeniority(phase.id)}</span>
              </div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
                {phase.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>~12 min workplace deliverable</span>
            </div>
          </div>
        </div>

        {/* At-a-Glance Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Target className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Deliverable Type</span>
              <span className="font-semibold text-slate-800">Formal Consultancy Report & Quantities</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Evaluation Framework</span>
              <span className="font-semibold text-slate-800">{career.professional_body} Standards</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Evaluated Criteria</span>
              <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={phase.rubric.map((r) => r.criterion).join(', ')}>
                {phase.rubric.map((r) => r.criterion).join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Brief Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-slate-700">
              Workplace Project Brief & Instructions
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Consultancy Scenario</span>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          <div className="text-sm leading-relaxed text-slate-700 font-sans whitespace-pre-line">
            {phase.brief}
          </div>
        </div>
      </div>

      {/* Submission Composer Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <label htmlFor="taskSubmission" className="font-heading text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Your Technical Work Submission
            </label>
            <span className="text-[11px] text-slate-500">
              {wordCount} words · {submission.length} characters
            </span>
          </div>

          {/* Quick Insert Template Action */}
          <button
            type="button"
            onClick={insertTemplate}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <FileCode className="w-3.5 h-3.5 text-sky-600" />
            <span>Insert Industry Outline Template</span>
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            id="taskSubmission"
            rows={14}
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Document complete technical breakdown, stated assumptions, measurement calculations, and rate determinations... (Click 'Insert Industry Outline Template' above for standard consultancy structure)"
            className="w-full text-sm font-mono text-slate-900 bg-white border border-slate-300 p-4 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-100 outline-none transition-all resize-y min-h-[220px] leading-relaxed"
            disabled={submitting}
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
            <span>NRM2 / BESMM4 Standard Compatible</span>
            <span>Accreditation Ready</span>
          </div>
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
                <span>Evaluating Deliverable…</span>
              </span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Deliverable for Review</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
