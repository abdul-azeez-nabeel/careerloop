/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Career, Phase, EvaluationResult } from '../../types/career';
import { REALITY_SCENARIOS, RealityScenario } from '../../data/realityScenarios';
import { soundEffects } from '../../utils/soundEffects';
import {
  Code2,
  Terminal,
  Cpu,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Square,
  ArrowRight,
  ArrowLeft,
  X,
  Send,
  Users,
  ShieldCheck,
  TrendingUp,
  Sliders,
  DollarSign,
  FileCode,
  Layers,
  GitPullRequest,
  Check,
  Briefcase,
  Activity,
  Award
} from 'lucide-react';

interface MobileWorkplaceEngineProps {
  career: Career;
  phase: Phase;
  initialSubmission?: string;
  isMuted?: boolean;
  onComplete: (submissionText: string, evaluation: EvaluationResult, answers?: Record<string, string>) => void;
  onBack: () => void;
}

type WorkplaceTab = 'learn' | 'code' | 'team' | 'pr';

interface CodeArtifact {
  id: string;
  title: string;
  type: string;
  icon: string;
  path: string;
  description: string;
  technicalFinding: string;
  isInspected: boolean;
}

const STAGE_ARTIFACTS: Record<string, CodeArtifact[]> = {
  internship: [
    {
      id: 'a1',
      title: 'Systrace Main-Thread Jank Trace',
      type: 'Performance Profile',
      icon: '⏱️',
      path: 'traces/scrolling_jank_60fps.systrace',
      description: 'Choreographer trace showing 48 skipped frames during transaction feed scrolling.',
      technicalFinding: 'DIAGNOSIS: Date formatting and currency parsing executed synchronously on Dispatchers.Main; moving to Dispatchers.IO restores smooth 60 FPS.',
      isInspected: false
    },
    {
      id: 'a2',
      title: 'Room SQLite Offline Cache Entity',
      type: 'Database Schema',
      icon: '🗄️',
      path: 'data/local/TransactionEntity.kt',
      description: 'Offline database entity with sync_status and timestamp columns.',
      technicalFinding: 'ARCHITECTURE: Local persistence with optimistic UI ensures transactions display immediately even in offline subway tunnels.',
      isInspected: false
    },
    {
      id: 'a3',
      title: 'Background Coroutine Dispatcher PR',
      type: 'Git Diff',
      icon: '⚡',
      path: 'domain/usecases/FetchTransactionsUseCase.kt',
      description: 'Pull request isolating JSON payload deserialization to background worker isolates.',
      technicalFinding: 'BENCHMARK: Main-thread bind duration drops from 28ms to 1.4ms per cell.',
      isInspected: false
    },
    {
      id: 'a4',
      title: 'Pull-To-Refresh Shimmer Loader',
      type: 'UI Component Spec',
      icon: '✨',
      path: 'ui/components/TransactionShimmerList.kt',
      description: 'Skeleton layout tokens preventing UI jumping while cached data streams from disk.',
      technicalFinding: 'UX SPEC: Shimmer placeholders meet accessibility contrast ratios and provide instant visual feedback.',
      isInspected: false
    }
  ],

  job_prep: [
    {
      id: 'a1',
      title: 'LRU Cache Downsampling Algorithm',
      type: 'Code Sandbox',
      icon: '🖼️',
      path: 'cache/ImageLruCache.kt',
      description: 'In-memory bitmap downsampler checking inJustDecodeBounds to prevent OOM memory spikes.',
      technicalFinding: 'SYSTEM DESIGN: Bounds image memory to 1/8th of available heap, eliminating Out-Of-Memory crashes.',
      isInspected: false
    },
    {
      id: 'a2',
      title: 'Production GitHub Portfolio Repo',
      type: 'Open Source Repo',
      icon: '💻',
      path: 'github.com/candidate/offline-mobile-app',
      description: 'Clean Architecture mobile repository demonstrating 99.8% crash-free sessions and CI unit tests.',
      technicalFinding: 'REPUTATION: Proves end-to-end production competency far beyond standard tutorial clone projects.',
      isInspected: false
    },
    {
      id: 'a3',
      title: 'Mobile Architecture Whiteboard Diagram',
      type: 'System Architecture',
      icon: '📐',
      path: 'docs/architecture/MVI_Unidirectional_Flow.png',
      description: 'State machine diagram comparing MVVM, MVI, and Clean Architecture state reducers.',
      technicalFinding: 'DEFENSE: MVI state immutability ensures predictable transitions under concurrent user actions.',
      isInspected: false
    },
    {
      id: 'a4',
      title: 'Levels.fyi Salary Benchmark Data',
      type: 'Compensation Benchmark',
      icon: '💵',
      path: 'careers/benchmarks/mobile_engineer_2025.pdf',
      description: 'Verified market salary survey for entry-to-junior mobile software engineers ($58,000 - $65,000 base).',
      technicalFinding: 'LEVERAGE: Data-backed benchmarks support professional counter-proposals with equity options.',
      isInspected: false
    }
  ],

  trainee: [
    {
      id: 'a1',
      title: 'OAuth 401 Concurrency Network Dump',
      type: 'Network Capture',
      icon: '🔄',
      path: 'network/captures/parallel_401_race_condition.pcap',
      description: 'Network log showing 4 concurrent API calls triggering duplicate token refresh requests.',
      technicalFinding: 'RACE CONDITION: Lack of mutex locking triggers OAuth refresh token replay defenses, kicking users out.',
      isInspected: false
    },
    {
      id: 'a2',
      title: 'Android KeyStore / iOS Keychain Cryptor',
      type: 'Security Module',
      icon: '🔐',
      path: 'security/crypto/BiometricKeyStoreManager.kt',
      description: 'Hardware-backed MasterKey and kSecAccessControlBiometryAny implementation.',
      technicalFinding: 'HARDWARE ENCLAVE: Tokens encrypted with hardware cryptographic keys cannot be extracted even on rooted devices.',
      isInspected: false
    },
    {
      id: 'a3',
      title: 'Strict Tech Lead Marcus PR Review',
      icon: '🛑',
      path: 'pull_requests/104/review_comments.md',
      type: 'Code Review',
      description: '32 code review comments demanding mutex thread synchronization and mock engine unit tests.',
      technicalFinding: 'QUALITY MANDATE: Rejects PR without MockWebServer unit tests and synchronized semaphore queue.',
      isInspected: false
    },
    {
      id: 'a4',
      title: 'CI/CD Concurrency Test Suite Results',
      type: 'Automated Test Report',
      icon: '✅',
      path: 'build/reports/tests/TokenRefreshConcurrencyTest.html',
      description: '20-thread simulated concurrency test proving 100% token renewal success without race conditions.',
      technicalFinding: 'VERIFIED RESILIENCE: Mutex queue successfully queues and replays all 4 paused network requests.',
      isInspected: false
    }
  ],

  junior: [
    {
      id: 'a1',
      title: 'CameraX ImageProxy Recycle Benchmark',
      type: 'Vision ML Benchmark',
      icon: '📷',
      path: 'vision/ocr/DocumentScannerAnalyzer.kt',
      description: 'On-device OCR pipeline analyzing identity document frames at 5 FPS while viewfinder renders at 60 FPS.',
      technicalFinding: 'OPTIMAL PIPELINE: Explicit imageProxy.close() invocations prevent camera frame starvation and memory churn.',
      isInspected: false
    },
    {
      id: 'a2',
      title: 'KYC Telemetry & Onboarding Metrics',
      type: 'Product Analytics',
      icon: '📊',
      path: 'analytics/dashboards/kyc_conversion_q3.csv',
      description: 'Product telemetry proving on-device OCR reduced user onboarding drop-off by 28% and saved $140,000 in API costs.',
      technicalFinding: 'BUSINESS IMPACT: High-impact production delivery providing undeniable justification for mid-level promotion.',
      isInspected: false
    },
    {
      id: 'a3',
      title: 'Annual Performance Review Evaluation',
      type: 'HR Evaluation Matrix',
      icon: '📈',
      path: 'hr/reviews/annual_engineering_matrix.pdf',
      description: 'Annual performance score showing Top 5% ranking across delivery velocity, code health, and intern mentoring.',
      technicalFinding: 'PROMOTION READY: Candidate exhibits mid-level autonomy and leadership across all technical rubrics.',
      isInspected: false
    },
    {
      id: 'a4',
      title: '40% Salary Promotion Counter-Proposal',
      type: 'Compensation Proposal',
      icon: '💰',
      path: 'compensation/proposals/junior_to_mid_promotion.pdf',
      description: 'Formal promotion compensation proposal targeting $95,000 - $110,000 mid-level base + stock grant.',
      technicalFinding: 'STRATEGIC NEGOTIATION: Leverages $140K in verified savings to command competitive market-rate compensation.',
      isInspected: false
    }
  ],

  mid: [
    {
      id: 'a1',
      title: 'Multi-Module Dependency Graph',
      type: 'Gradle Architecture',
      icon: '🧩',
      path: 'buildSrc/module_dependency_graph.svg',
      description: 'Clean modular architecture isolating :core:network, :core:designsystem, :feature:rides, and :feature:wallet.',
      technicalFinding: 'MODULAR ISOLATION: Feature modules decouple cleanly, dropping clean CI build duration from 22 minutes to 4.5 minutes.',
      isInspected: false
    },
    {
      id: 'a2',
      title: 'Cold Startup 1.1s Flamegraph Trace',
      type: 'Android Vitals Trace',
      icon: '🚀',
      path: 'perf/startup/cold_launch_trace.pprof',
      description: 'Cold launch trace demonstrating app start time reduction from 3.8s down to 1.1s.',
      technicalFinding: 'STARTUP OPTIMIZATION: Deferring 12 non-critical SDKs to background coroutines brings app to Top 10% on Google Play Vitals.',
      isInspected: false
    },
    {
      id: 'a3',
      title: 'Architect PR Veto vs PM Fast-Track Memo',
      type: 'Engineering RFC',
      icon: '⚖️',
      path: 'docs/rfcs/0022-modular-architecture.md',
      description: 'Resolution reconciling strict Architect Marcus’s quality bar with relaxed PM Sam’s ride-splitting launch date.',
      technicalFinding: 'LEADERSHIP BALANCE: Phased modularization unblocks parallel feature delivery without accumulating technical debt.',
      isInspected: false
    },
    {
      id: 'a4',
      title: '99.85% Crash-Free Session Dashboard',
      type: 'Crashlytics Metrics',
      icon: '🛡️',
      path: 'telemetry/crashlytics/stability_report.json',
      description: 'Production stability metrics across 1.5M daily active users on 4,000+ distinct Android and iOS hardware profiles.',
      technicalFinding: 'ENTERPRISE STABILITY: Defends production stability against device fragmentation and low-memory kills.',
      isInspected: false
    }
  ],

  senior: [
    {
      id: 'a1',
      title: 'Dynamic Feature Module Bundle Spec',
      type: 'Google Play Bundle Spec',
      icon: '📦',
      path: 'app/dynamic-features/bundle-config.json',
      description: 'App bundle configuration slashing initial download size from 120MB down to 22MB base APK.',
      technicalFinding: 'GLOBAL CONVERSION: Shrinking base bundle yields 35% install surge across bandwidth-constrained international markets.',
      isInspected: false
    },
    {
      id: 'a2',
      title: 'Multi-Region Anycast Edge Telemetry',
      type: 'Cloudflare / AWS Telemetry',
      icon: '🌐',
      path: 'infra/cdn/anycast_latency_metrics.csv',
      description: 'Network metrics showing 420ms latency reduction across Latin America and African edge nodes.',
      technicalFinding: 'LATENCY MASTERY: Edge worker caching and TLS 1.3 resumption drastically accelerate round-trip API responses.',
      isInspected: false
    },
    {
      id: 'a3',
      title: 'Engineering Mentorship & Review Rubric',
      type: 'Team Engineering Standards',
      icon: '👥',
      path: 'wiki/engineering/mentorship_rubric.md',
      description: 'Standardized PR review guidelines, onboarding guides, and weekly pair programming curriculum for 16 engineers.',
      technicalFinding: 'ORGANIZATIONAL MULTIPLIER: Upskills junior engineers into self-sufficient mid-level contributors within 6 months.',
      isInspected: false
    },
    {
      id: 'a4',
      title: 'Staff Principal Term Sheet ($165K + Equity)',
      type: 'Executive Term Sheet',
      icon: '📈',
      path: 'legal/compensation/principal_architect_terms.pdf',
      description: 'Executive compensation agreement with $165,000 base, 25,000 stock options, and 1-year cliff vesting terms.',
      technicalFinding: 'EXECUTIVE WEALTH CREATION: Aligns principal engineering leadership directly with upcoming company IPO valuation.',
      isInspected: false
    }
  ],

  lead: [
    {
      id: 'a1',
      title: '5-Year Dual-Native vs Cross-Platform TCO Model',
      type: 'Board Financial Model',
      icon: '📊',
      path: 'board/decks/2026_mobile_tech_tco_model.xlsx',
      description: 'Comprehensive financial Total Cost of Ownership model comparing native Kotlin/Swift, Flutter, and KMP Hybrid.',
      technicalFinding: 'STRATEGIC TCO: A complete rewrite costs $12M in lost revenue due to a 14-month feature freeze; KMP Hybrid saves $3.2M without freezing.',
      isInspected: false
    },
    {
      id: 'a2',
      title: 'Pre-IPO Mobile Security Penetration Audit',
      type: 'External Security Audit',
      icon: '🛡️',
      path: 'security/audit/pre_ipo_mobile_pen_test.pdf',
      description: 'Penetration testing report verifying RASP, anti-tampering, biometric enclaves, and certificate pinning compliance.',
      technicalFinding: 'ENTERPRISE COMPLIANCE: 100% clean audit score, clearing the company for public stock exchange listing.',
      isInspected: false
    },
    {
      id: 'a3',
      title: 'Board Strategy Presentation Slide Deck',
      type: 'Executive Slide Deck',
      icon: '🎯',
      path: 'executive/presentations/board_q4_mobile_strategy.pdf',
      description: 'Definitive strategy presentation for CEO Victoria Sterling and lead investor Arthur.',
      technicalFinding: 'UNANIMOUS GOVERNANCE: Wins board consensus to avoid risky full rewrites in favor of pragmatic modular architecture.',
      isInspected: false
    },
    {
      id: 'a4',
      title: '48-Person Engineering Salary Band Matrix',
      type: 'Org Architecture Ladder',
      icon: '🏛️',
      path: 'org/people/mobile_engineering_career_ladder.xlsx',
      description: 'Standardized mobile career ladders across Junior, Mid, Senior, Staff, and Principal engineering tiers.',
      technicalFinding: 'TALENT RETENTION: Competitive transparent bands reduce engineering turnover to under 4% ahead of public IPO.',
      isInspected: false
    }
  ]
};

export const MobileWorkplaceEngine: React.FC<MobileWorkplaceEngineProps> = ({
  career,
  phase,
  initialSubmission = '',
  isMuted = false,
  onComplete,
  onBack,
}) => {
  // Sync sound settings
  useEffect(() => {
    soundEffects.enabled = !isMuted;
  }, [isMuted]);

  const scenario: RealityScenario = REALITY_SCENARIOS[phase.id] || REALITY_SCENARIOS['internship'];

  // Workplace Step Tabs: 1. Doctrine -> 2. Code Lab -> 3. Team Standup -> 4. Pull Request
  const [activeTab, setActiveTab] = useState<WorkplaceTab>('learn');
  const [knowledgeVerified, setKnowledgeVerified] = useState<boolean>(false);
  const [knowledgeCheckChoice, setKnowledgeCheckChoice] = useState<number | null>(null);

  // Code Lab Interactive State
  const [codeToggles, setCodeToggles] = useState({
    useBackgroundThread: true,
    enableOfflineCache: true,
    useMutexLock: true,
    deferStartupSDKs: true,
  });
  const [targetFps, setTargetFps] = useState<number>(60);
  const [activeFileTab, setActiveFileTab] = useState<number>(0);

  // Inspectable Technical Artifacts
  const [artifacts, setArtifacts] = useState<CodeArtifact[]>(() => {
    return (STAGE_ARTIFACTS[phase.id] || STAGE_ARTIFACTS['internship']).map((a) => ({ ...a }));
  });
  const [inspectedArtifact, setInspectedArtifact] = useState<CodeArtifact | null>(null);

  // Team Standup / Superiors Review State
  const [alignedTeamMembers, setAlignedTeamMembers] = useState<Record<string, boolean>>({});
  const [activeTeamDialogue, setActiveTeamDialogue] = useState<{ speaker: string; text: string; outcome: string } | null>(null);
  const [salaryChoiceIdx, setSalaryChoiceIdx] = useState<number | null>(null);

  // Pull Request & Deliverable State
  const [engineeringPosture, setEngineeringPosture] = useState<'excellence' | 'pragmatic' | 'shortcut'>('excellence');
  const [submission, setSubmission] = useState<string>(initialSubmission || '');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Audio Narrator
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);

  // Reset when phase changes
  useEffect(() => {
    setActiveTab('learn');
    setKnowledgeVerified(false);
    setKnowledgeCheckChoice(null);
    setArtifacts((STAGE_ARTIFACTS[phase.id] || STAGE_ARTIFACTS['internship']).map((a) => ({ ...a })));
    setInspectedArtifact(null);
    setAlignedTeamMembers({});
    setActiveTeamDialogue(null);
    setSalaryChoiceIdx(null);
    setSubmission(initialSubmission || '');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [phase.id]);

  const inspectedCount = artifacts.filter((a) => a.isInspected).length;

  // Handle artifact inspection
  const handleInspectArtifact = (artifact: CodeArtifact) => {
    soundEffects.playClick();
    if (!artifact.isInspected) {
      soundEffects.playAchievement();
      setArtifacts((prev) =>
        prev.map((a) => (a.id === artifact.id ? { ...a, isInspected: true } : a))
      );
    }
    setInspectedArtifact(artifact);
  };

  // Play audio voice
  const handlePlayVoice = async (text: string) => {
    if (isMuted) return;
    if (isPlayingAudio) {
      soundEffects.playClick();
      setIsPlayingAudio(false);
      return;
    }

    soundEffects.playMeetingRing();
    setLoadingAudio(true);
    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        setLoadingAudio(false);
        return;
      }

      const data = await res.json();
      if (!data || !data.audio_base64) {
        setLoadingAudio(false);
        return;
      }

      const binary = atob(data.audio_base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => setIsPlayingAudio(false);

      setLoadingAudio(false);
      setIsPlayingAudio(true);
      audio.play().catch(() => setIsPlayingAudio(false));
    } catch (err) {
      console.warn('TTS error:', err);
      setLoadingAudio(false);
      setIsPlayingAudio(false);
    }
  };

  // Auto-draft Pull Request Description
  const handleAutoDraftPR = () => {
    soundEffects.playClick();
    const verifiedArtifacts = artifacts.filter((a) => a.isInspected);

    const prDescription = `PULL REQUEST / ENGINEERING RFC: ${scenario.briefing.subject.replace('URGENT: ', '').replace('BUG SQUASH: ', '').replace('PR REJECTED: ', '').replace('ANNUAL PERFORMANCE & PROMOTION REVIEW: ', '').replace('CODEBASE RESCUE: ', '').replace('GLOBAL EXPANSION: ', '').replace('BOARD OF DIRECTORS PRESENTATION: ', '').toUpperCase()}
Lead Mobile Engineer: A. Nabeel · Track: Mobile App Engineering
Accredited Standard: ${career.professional_body}
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}

1. SUMMARY OF CHANGES & ARCHITECTURAL OBJECTIVE:
${scenario.briefing.situationOverview}

2. PRODUCTION BENCHMARKS & GOVERNING CODE:
- Standard: ${scenario.technicalDrill.standardReference}
- Doctrine: ${scenario.technicalDrill.doctrineRule}

3. EXAMINED CODE ARTIFACTS & PROFILER VALIDATION (${verifiedArtifacts.length} OF ${artifacts.length} VERIFIED):
${verifiedArtifacts.length > 0 ? verifiedArtifacts.map((a, i) => `- Artifact #${i + 1} (${a.title} · ${a.path}): ${a.technicalFinding}`).join('\n') : '- Code analysis completed with profiler traces verified against frame budget.'}

4. TEAM REVIEWS, SUPERIOR CONSENSUS & COMPENSATION ALIGNMENT:
${Object.keys(alignedTeamMembers).length > 0 ? `Aligned with ${Object.keys(alignedTeamMembers).length} technical and leadership stakeholder(s). Strategic and compensation frameworks documented.` : 'Team consultations and code reviews concluded in adherence with engineering standards.'}

5. ENGINEERING POSTURE:
- Selected Posture: ${engineeringPosture === 'excellence' ? 'PRODUCTION EXCELLENCE. Zero memory leaks, 60/120 FPS hardware thread budgets, and market-rate compensation negotiation.' : engineeringPosture === 'pragmatic' ? 'PRAGMATIC PHASED COMPROMISE. Unblocks immediate product release while scheduling modular debt cleanup.' : 'SHORTCUT. Note: Rushing unencrypted or unoptimized code incurs technical debt.'}
- Primary Deliverable: ${scenario.deliverable.title}`;

    setSubmission(prDescription);
    soundEffects.playStamp();
  };

  useEffect(() => {
    if (activeTab === 'pr' && !submission.trim()) {
      handleAutoDraftPR();
    }
  }, [activeTab]);

  // Submit Pull Request for Evaluation
  const handleSubmitPR = async () => {
    if (!submission.trim()) {
      setError('Please review or auto-generate your Pull Request deliverable before submitting.');
      return;
    }

    setError(null);
    setSubmitting(true);
    soundEffects.playStamp();

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
      soundEffects.playSuccess();
      onComplete(submission, evalResult, {
        posture: engineeringPosture,
        artifactsInspected: String(inspectedCount),
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit PR. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = submission.trim() ? submission.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 select-none font-sans">
      {/* =========================================================================
          WORKPLACE HEADER CARD (LinkedIn / Facebook Clean Style)
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-7 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0a66c2]">
                STAGE #{scenario.stageNumber} WORKPLACE LAB · {career.name.toUpperCase()}
              </span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {scenario.briefing.subject.replace('URGENT: ', '').replace('BUG SQUASH: ', '').replace('PR REJECTED: ', '')}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Role: A. Nabeel (Mobile Engineer) · Standard: {career.professional_body}
            </p>
          </div>

          {/* Clean Metric Pills */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 border border-slate-200 p-2 sm:px-3 sm:py-2 rounded-2xl">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
              <FileCode className="w-4 h-4 text-[#0a66c2]" />
              <div className="text-right">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">ARTIFACTS</span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {inspectedCount} / {artifacts.length} Verified
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <div className="text-right">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">TEAM CONSENSUS</span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  {Object.keys(alignedTeamMembers).length} / {scenario.meetingSimulation.attendees.length} Aligned
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Objective Bar */}
        <div className="flex items-center justify-between text-xs font-sans text-slate-700 bg-sky-50/70 border border-sky-100 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0a66c2] shrink-0" />
            <span className="font-semibold text-slate-900">Sprint Goal:</span>
            <span>{scenario.briefing.coreObjective}</span>
          </div>
          <span className="font-mono text-[11px] text-[#0a66c2] font-bold hidden md:inline">
            Stage #{scenario.stageNumber}
          </span>
        </div>
      </div>

      {/* =========================================================================
          AUTHENTIC WORKPLACE STEP NAVIGATION TABS (LinkedIn Clean Style)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 shadow-sm space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Step 1: Technical Doctrine */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('learn');
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              activeTab === 'learn'
                ? 'bg-[#0a66c2] text-white font-bold border-[#0a66c2] shadow-sm'
                : knowledgeVerified
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div>
              <span className={`text-[9px] uppercase font-mono block ${activeTab === 'learn' ? 'text-sky-200' : 'text-slate-400'}`}>
                Step 1
              </span>
              <span className="text-xs font-bold block truncate">
                📖 Doctrine {knowledgeVerified ? '✓' : ''}
              </span>
            </div>
            {knowledgeVerified && <Check className={`w-4 h-4 ${activeTab === 'learn' ? 'text-white' : 'text-emerald-600'}`} />}
          </button>

          {/* Step 2: Code Lab & Simulator */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('code');
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              activeTab === 'code'
                ? 'bg-[#0a66c2] text-white font-bold border-[#0a66c2] shadow-sm'
                : inspectedCount >= 3
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div>
              <span className={`text-[9px] uppercase font-mono block ${activeTab === 'code' ? 'text-sky-200' : 'text-slate-400'}`}>
                Step 2
              </span>
              <span className="text-xs font-bold block truncate">
                💻 Code Lab {inspectedCount >= 3 ? '✓' : `(${inspectedCount}/4)`}
              </span>
            </div>
            {inspectedCount >= 3 && <Check className={`w-4 h-4 ${activeTab === 'code' ? 'text-white' : 'text-emerald-600'}`} />}
          </button>

          {/* Step 3: Team Standup & Reviews */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('team');
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              activeTab === 'team'
                ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-sm'
                : Object.keys(alignedTeamMembers).length > 0
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div>
              <span className={`text-[9px] uppercase font-mono block ${activeTab === 'team' ? 'text-indigo-200' : 'text-slate-400'}`}>
                Step 3
              </span>
              <span className="text-xs font-bold block truncate">
                👥 Team Review {Object.keys(alignedTeamMembers).length > 0 ? '✓' : ''}
              </span>
            </div>
            {Object.keys(alignedTeamMembers).length > 0 && <Check className={`w-4 h-4 ${activeTab === 'team' ? 'text-white' : 'text-emerald-600'}`} />}
          </button>

          {/* Step 4: Pull Request & Ship */}
          <button
            type="button"
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('pr');
            }}
            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
              activeTab === 'pr'
                ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div>
              <span className={`text-[9px] uppercase font-mono block ${activeTab === 'pr' ? 'text-emerald-200' : 'text-slate-400'}`}>
                Step 4
              </span>
              <span className="text-xs font-bold block truncate">
                🚀 Pull Request
              </span>
            </div>
            <GitPullRequest className={`w-4 h-4 ${activeTab === 'pr' ? 'text-white' : 'text-slate-400'}`} />
          </button>
        </div>

        {/* Guidance Tip */}
        <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center justify-between text-xs font-mono">
          <span className="text-slate-700">
            {activeTab === 'learn' && '👉 Step 1: Read the technical doctrine and answer the knowledge check before coding'}
            {activeTab === 'code' && '👉 Step 2: Test code parameters in the IDE and verify real-time performance on the device simulator'}
            {activeTab === 'team' && '👉 Step 3: Present your technical architecture to strict vs relaxed superiors and negotiate promotion/salary'}
            {activeTab === 'pr' && '👉 Step 4: Assemble your Pull Request description and submit for formal engineering assessment'}
          </span>
          <span className="text-[#0a66c2] font-bold hidden md:inline">LinkedIn Tech Track</span>
        </div>
      </div>

      {/* =========================================================================
          STEP 1: TECHNICAL DOCTRINE & LEARNING (Always Precedes Tasks)
      ========================================================================= */}
      {activeTab === 'learn' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0a66c2] bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100">
                STEP 1 OF 4 · CORE ARCHITECTURE DOCTRINE
              </span>
              <h2 className="font-heading font-black text-slate-900 text-lg sm:text-2xl">
                {scenario.technicalDrill.topicTitle}
              </h2>
            </div>

            <button
              type="button"
              disabled={isMuted}
              onClick={() =>
                handlePlayVoice(
                  `${scenario.technicalDrill.topicTitle}. Standard: ${scenario.technicalDrill.standardReference}. ${scenario.technicalDrill.doctrineRule}`
                )
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMuted
                  ? 'opacity-40 text-slate-400 bg-slate-100'
                  : isPlayingAudio
                  ? 'bg-[#0a66c2] text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
              }`}
            >
              {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{loadingAudio ? 'Synthesizing…' : isPlayingAudio ? 'Stop Voice' : 'Listen to Lesson (AI Voice)'}</span>
            </button>
          </div>

          {/* Standard reference banner */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-slate-500">GOVERNING STANDARD:</span>
            <span className="text-emerald-800 font-bold">{scenario.technicalDrill.standardReference}</span>
          </div>

          {/* Doctrine Rule Content */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0a66c2] block">
              PRODUCTION ARCHITECTURE RULE:
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line">
              {scenario.technicalDrill.doctrineRule}
            </p>
          </div>

          {/* Workplace Situation Brief */}
          <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-600 pb-1 border-b border-sky-200/60">
              <span>DISPATCHED BY: {scenario.briefing.senderName} ({scenario.briefing.senderRole})</span>
              <span className="text-amber-700 font-bold">{scenario.briefing.urgency}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans pt-1">
              {scenario.briefing.situationOverview}
            </p>
          </div>

          {/* Knowledge Check */}
          <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Knowledge Check: Verify Comprehension Before Coding</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#0a66c2]">
                {knowledgeVerified ? 'VERIFIED ✓' : 'UNANSWERED'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
              {scenario.technicalDrill.interactiveTask.question}
            </p>

            <div className="space-y-2">
              {scenario.technicalDrill.interactiveTask.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setKnowledgeCheckChoice(idx);
                    if (opt.isCorrect) {
                      soundEffects.playAchievement();
                      setKnowledgeVerified(true);
                    }
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-3 ${
                    knowledgeCheckChoice === idx
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 text-emerald-950 font-bold'
                        : 'bg-red-50 border-red-500 ring-2 ring-red-200 text-red-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      knowledgeCheckChoice === idx
                        ? opt.isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="space-y-1">
                    <span className="font-semibold block leading-relaxed">{opt.label}</span>
                    {knowledgeCheckChoice === idx && (
                      <p className={`text-[11px] leading-relaxed pt-1 font-mono ${opt.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700'}`}>
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Advance to Step 2 */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setKnowledgeVerified(true);
                setActiveTab('code');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-heading text-xs font-black shadow-md cursor-pointer transition-all"
            >
              <span>Proceed to Step 2: Code Lab & Device Simulator 👉</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: CODE LAB & LIVE DEVICE SIMULATOR (Real IDE Experience)
      ========================================================================= */}
      {activeTab === 'code' && (
        <div className="space-y-6">
          <div className="bg-[#0f172a] rounded-3xl border-2 border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-7 space-y-6 text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="font-heading font-black text-white text-base sm:text-lg">
                    MOBILE WORKBENCH & DEVICE SIMULATOR
                  </h3>
                  <p className="text-xs text-sky-400 font-mono">
                    Test code isolation and inspect live frame timings on the mobile chassis
                  </p>
                </div>
              </div>

              {/* Target FPS Selector */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 px-2 font-bold">FRAME RATE:</span>
                {[60, 120].map((fps) => (
                  <button
                    key={fps}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setTargetFps(fps);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      targetFps === fps ? 'bg-[#0a66c2] text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {fps} FPS {fps === 60 ? '(Standard)' : '(ProMotion)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen: Left = Modern Code Editor, Right = Live Smartphone Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Code Editor & Architecture Controls (7 Cols) */}
              <div className="lg:col-span-7 bg-[#020617] rounded-2xl border border-slate-800 p-4 space-y-4">
                {/* Editor Tab Bar */}
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
                  {['TransactionViewModel.kt', 'NetworkInterceptor.kt', 'RoomDatabase.kt'].map((tabName, idx) => (
                    <button
                      key={tabName}
                      type="button"
                      onClick={() => setActiveFileTab(idx)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        activeFileTab === idx
                          ? 'bg-slate-800 text-sky-400 font-bold border border-slate-700'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{tabName}</span>
                    </button>
                  ))}
                </div>

                {/* Code Window */}
                <div className="font-mono text-xs text-slate-300 leading-relaxed bg-[#0b0f19] p-4 rounded-xl border border-slate-800/80 space-y-1 overflow-x-auto">
                  <div className="text-slate-500">// Mobile Production Implementation</div>
                  <div><span className="text-sky-400">class</span> <span className="text-amber-300">MobileAppEngine</span> @Inject <span className="text-sky-400">constructor</span>(</div>
                  <div className="pl-4">private val repository: DataRepository,</div>
                  <div className="pl-4">private val mutex: Mutex = Mutex()</div>
                  <div>) : ViewModel() &#123;</div>
                  <div className="pl-4 text-emerald-400">// Asynchronous Thread Isolation</div>
                  <div className="pl-4"><span className="text-purple-400">fun</span> <span className="text-amber-300">executeTask</span>() = viewModelScope.launch(</div>
                  <div className="pl-8">
                    <span className={codeToggles.useBackgroundThread ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {codeToggles.useBackgroundThread ? 'Dispatchers.IO' : 'Dispatchers.Main /* JANK TRIGGER */'}
                    </span>
                  </div>
                  <div className="pl-4">) &#123;</div>
                  <div className="pl-8">mutex.withLock &#123;</div>
                  <div className="pl-12">repository.syncDataWithOfflineCache()</div>
                  <div className="pl-8">&#125;</div>
                  <div className="pl-4">&#125;</div>
                  <div>&#125;</div>
                </div>

                {/* Interactive Code Architecture Toggles */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    INTERACTIVE CODE ARCHITECTURE SWITCHES:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setCodeToggles((prev) => ({ ...prev, useBackgroundThread: !prev.useBackgroundThread }));
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                        codeToggles.useBackgroundThread
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                          : 'bg-red-950/80 border-red-500 text-red-200'
                      }`}
                    >
                      <span>Thread Isolation</span>
                      <span className="font-bold">{codeToggles.useBackgroundThread ? 'Dispatchers.IO ✓' : 'Dispatchers.Main ⚠️'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        setCodeToggles((prev) => ({ ...prev, enableOfflineCache: !prev.enableOfflineCache }));
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between ${
                        codeToggles.enableOfflineCache
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                          : 'bg-amber-950/80 border-amber-500 text-amber-200'
                      }`}
                    >
                      <span>SQLite Local Cache</span>
                      <span className="font-bold">{codeToggles.enableOfflineCache ? 'Room Enabled ✓' : 'Network Only ⚠️'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Mobile Device Simulator (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-[260px] h-[480px] bg-[#020617] rounded-[40px] border-4 border-slate-700 shadow-2xl p-3 flex flex-col justify-between relative overflow-hidden ring-4 ring-slate-800/60">
                  {/* Dynamic Island / Notch */}
                  <div className="w-24 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-end px-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  {/* App Screen Canvas */}
                  <div className="flex-1 bg-slate-900 rounded-2xl p-3 flex flex-col justify-between overflow-hidden border border-slate-800">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono pb-1 border-b border-slate-800">
                        <span className="text-white font-bold">PaySwift Mobile</span>
                        <span className={codeToggles.useBackgroundThread ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {codeToggles.useBackgroundThread ? `${targetFps}.0 FPS` : '22.4 FPS (JANK)'}
                        </span>
                      </div>

                      {/* Live Feed Simulator Cards */}
                      <div className="space-y-1.5">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className={`p-2 rounded-xl text-[10px] font-mono flex items-center justify-between ${
                              codeToggles.useBackgroundThread
                                ? 'bg-slate-800 border border-slate-700 text-slate-200'
                                : 'bg-red-950/60 border border-red-800/80 text-red-200 animate-pulse'
                            }`}
                          >
                            <div>
                              <span className="font-bold block">Payment Ref #{item * 104}</span>
                              <span className="text-[9px] text-slate-400">
                                {codeToggles.enableOfflineCache ? 'Cached in SQLite (1.2ms)' : 'Fetching from Network...'}
                              </span>
                            </div>
                            <span className="font-bold text-emerald-400">$240.00</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Simulator Bottom Status */}
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-400">MEMORY HEAP:</span>
                        <span className="text-sky-400 font-bold">34.8 MB / 192 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">THREAD:</span>
                        <span className={codeToggles.useBackgroundThread ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {codeToggles.useBackgroundThread ? 'IO Pool (0 Jank)' : 'Main Thread Blocked'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
                </div>
              </div>
            </div>

            {/* Inspectable Technical Code Artifacts Grid */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-xs font-heading font-black uppercase text-sky-400 tracking-wider block">
                AUDIT TECHNICAL ARTIFACTS & LOGS (TAP TO INSPECT):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {artifacts.map((artifact, idx) => (
                  <button
                    key={artifact.id}
                    type="button"
                    onClick={() => handleInspectArtifact(artifact)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                      artifact.isInspected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{artifact.icon}</span>
                      <span className="text-[10px] font-mono text-sky-400 uppercase">
                        {artifact.isInspected ? 'VERIFIED ✓' : `Artifact #${idx + 1}`}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-white block truncate">{artifact.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">{artifact.path}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advance to Step 3 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('learn')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>👈 Back to Step 1: Doctrine</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveTab('team');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading text-xs font-black shadow-md cursor-pointer transition-all"
              >
                <span>Proceed to Step 3: Team Standup & Reviews 👉</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: TEAM STANDUP & REVIEWS (Strict vs Relaxed Superiors + Salary)
      ========================================================================= */}
      {activeTab === 'team' && (
        <div className="bg-[#0f172a] rounded-3xl border-2 border-indigo-700 overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-white animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-800">
                STEP 3 OF 4 · TEAM STANDUP & SUPERIOR REVIEWS
              </span>
              <h2 className="font-heading font-black text-white text-lg sm:text-2xl">
                {scenario.meetingSimulation.meetingTitle}
              </h2>
              <p className="text-xs text-indigo-300 font-mono">
                {scenario.meetingSimulation.context}
              </p>
            </div>

            <button
              type="button"
              disabled={isMuted}
              onClick={() =>
                handlePlayVoice(scenario.meetingSimulation.transcript.map((t) => `${t.speaker}: ${t.text}`).join(' '))
              }
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isMuted
                  ? 'opacity-40 text-slate-500 bg-slate-900'
                  : isPlayingAudio
                  ? 'bg-indigo-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isPlayingAudio ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{loadingAudio ? 'Synthesizing…' : isPlayingAudio ? 'Stop Voice' : 'Listen to Standup (AI Voice)'}</span>
            </button>
          </div>

          {/* Attendees Grid: Strict Superior vs Relaxed Superior */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {scenario.meetingSimulation.attendees.map((attendee, idx) => {
              const isAligned = alignedTeamMembers[attendee.name];
              const transcriptLine =
                scenario.meetingSimulation.transcript.find((t) => t.speaker.includes(attendee.name.split(' ')[0])) ||
                scenario.meetingSimulation.transcript[idx % scenario.meetingSimulation.transcript.length];

              return (
                <div key={idx} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3 relative overflow-hidden">
                  {isAligned && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600/90 text-white font-mono font-black text-[9px] uppercase border border-emerald-400">
                      CONSENSUS REACHED ✓
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-900/50 border border-indigo-500 text-indigo-300 font-black flex items-center justify-center text-xl shrink-0">
                      {attendee.avatar}
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-white text-sm">{attendee.name}</h4>
                      <span className="text-[10px] text-indigo-400 font-mono uppercase font-bold block">
                        {attendee.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic font-serif line-clamp-3">
                    "{transcriptLine ? transcriptLine.text : 'Reviewing engineering metrics and sprint velocity.'}"
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playAgreement();
                      setAlignedTeamMembers((prev) => ({ ...prev, [attendee.name]: true }));
                      setActiveTeamDialogue({
                        speaker: attendee.name,
                        text: transcriptLine ? transcriptLine.text : '',
                        outcome: `CONSENSUS: ${attendee.name} reviewed your mobile architecture choices and approves your approach.`,
                      });
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isAligned
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    <span>{isAligned ? '✓ Aligned' : `Review with ${attendee.name.split(' ')[0]} 💬`}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Standup Outcome Box */}
          {activeTeamDialogue && (
            <div className="p-4 rounded-2xl bg-indigo-950/70 border-2 border-indigo-500 text-xs font-mono space-y-1 animate-in fade-in">
              <span className="text-indigo-300 font-bold uppercase block">
                📋 TEAM ALIGNMENT NOTE: {activeTeamDialogue.speaker}
              </span>
              <p className="text-white text-sm font-sans font-semibold">
                {activeTeamDialogue.outcome}
              </p>
            </div>
          )}

          {/* Strategic Decision & Salary Negotiation Flow */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-heading font-black text-amber-400 uppercase tracking-wider block">
              💼 STRATEGIC ENGINEERING & COMPENSATION NEGOTIATION:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 font-sans">
              {scenario.meetingSimulation.dilemmaPrompt}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {scenario.meetingSimulation.dilemmaOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    soundEffects.playClick();
                    setSalaryChoiceIdx(idx);
                  }}
                  className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    salaryChoiceIdx === idx
                      ? 'bg-indigo-950 border-indigo-400 ring-2 ring-indigo-400/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">
                      {opt.posture}
                    </span>
                    <span className="font-bold text-white block">{opt.label}</span>
                  </div>
                  {salaryChoiceIdx === idx && (
                    <p className="text-[11px] text-emerald-300 font-mono pt-2 border-t border-slate-800 mt-2">
                      {opt.feedback}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Advance to Step 4 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>👈 Back to Step 2: Code Lab</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveTab('pr');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading text-xs font-black shadow-md cursor-pointer transition-all"
            >
              <span>Proceed to Step 4: Pull Request 👉</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 4: PULL REQUEST & DELIVERABLE (Review, Posture & Submit)
      ========================================================================= */}
      {activeTab === 'pr' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#0a66c2] block">
                STAGE #{scenario.stageNumber} PULL REQUEST & RFC
              </span>
              <h3 className="font-heading font-black text-slate-900 text-lg sm:text-2xl">
                {scenario.deliverable.title}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleAutoDraftPR}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-heading text-xs font-black shadow-md cursor-pointer transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>✨ Re-Assemble PR from Benchmarks</span>
            </button>
          </div>

          {/* Engineering Posture Selection */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 block">
              SELECT ENGINEERING RELEASE POSTURE:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setEngineeringPosture('excellence')}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  engineeringPosture === 'excellence'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 text-emerald-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="block text-sm font-heading font-black mb-1">🚀 Production Excellence</span>
                <span className="text-[11px] font-normal leading-relaxed">
                  Full adherence to thread isolation, memory safety, 60/120 FPS budgets, and market-rate compensation.
                </span>
              </label>

              <label
                onClick={() => setEngineeringPosture('pragmatic')}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  engineeringPosture === 'pragmatic'
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-200 text-amber-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="block text-sm font-heading font-black mb-1">🤝 Pragmatic Phased Release</span>
                <span className="text-[11px] font-normal leading-relaxed">
                  Ship critical user features immediately while isolating debt behind clean module interfaces.
                </span>
              </label>

              <label
                onClick={() => setEngineeringPosture('shortcut')}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  engineeringPosture === 'shortcut'
                    ? 'bg-red-50 border-red-500 ring-2 ring-red-200 text-red-950 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="block text-sm font-heading font-black mb-1">❌ Technical Debt Shortcut</span>
                <span className="text-[11px] font-normal leading-relaxed">
                  Bypass unit tests or accept low-ball compensation without negotiating market value.
                </span>
              </label>
            </div>
          </div>

          {/* Pull Request Document Editor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-heading font-black uppercase text-slate-800 tracking-wider">
                Formal Pull Request Description & Technical RFC:
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                {wordCount} words
              </span>
            </div>

            <textarea
              rows={13}
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Click 'Re-Assemble PR from Benchmarks' above to generate your pull request..."
              className="w-full text-xs sm:text-sm font-mono text-slate-900 bg-slate-50 border border-slate-300 p-4 rounded-2xl focus:border-[#0a66c2] focus:ring-2 focus:ring-sky-100 outline-none transition-all leading-relaxed"
              disabled={submitting}
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 border border-red-200">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>👈 Back to Step 3: Team Standup</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitPR}
              disabled={submitting || !submission.trim()}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-heading text-xs font-black text-white shadow-xl cursor-pointer transition-all ${
                submitting || !submission.trim()
                  ? 'bg-slate-400 opacity-60 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 active:scale-98'
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Evaluating Pull Request Against {career.professional_body.split('/')[0].trim()} Rubric…</span>
                </span>
              ) : (
                <>
                  <GitPullRequest className="w-4 h-4" />
                  <span>SUBMIT PULL REQUEST FOR PROFESSIONAL EVALUATION</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TECHNICAL ARTIFACT INSPECTION MODAL (Clean Developer Log View)
      ========================================================================= */}
      {inspectedArtifact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0f172a] text-white rounded-3xl max-w-lg w-full border-2 border-[#0a66c2] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{inspectedArtifact.icon}</span>
                <span className="font-heading font-black text-sky-400 text-sm uppercase">
                  {inspectedArtifact.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInspectedArtifact(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-mono text-[10px] text-sky-400 uppercase font-bold block">
                  Artifact Path: {inspectedArtifact.path}
                </span>
                <p className="text-slate-300 leading-relaxed font-mono">
                  {inspectedArtifact.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-950/70 border border-sky-500/80 space-y-1">
                <span className="font-mono text-[10px] text-sky-300 uppercase font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>TECHNICAL AUDIT DETERMINATION:</span>
                </span>
                <p className="text-white text-xs sm:text-sm font-semibold leading-relaxed">
                  {inspectedArtifact.technicalFinding}
                </p>
              </div>
            </div>

            <div className="px-5 py-4 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectedArtifact(null)}
                className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:bg-[#004182] transition-colors"
              >
                Log Into Pull Request File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
