/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Career, Phase, EvaluationResult } from '../../types/career';
import { soundEffects } from '../../utils/soundEffects';
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Volume2,
  Square,
  ShieldCheck,
  Smartphone,
  Layers,
  Cpu,
  Globe,
  Award,
  Zap,
  Check
} from 'lucide-react';

interface SchoolLearningStationProps {
  career: Career;
  phase: Phase;
  isMuted?: boolean;
  onComplete: (submissionText: string, evaluation: EvaluationResult, answers?: Record<string, string>) => void;
  onBack: () => void;
}

interface LearningSection {
  id: string;
  badge: string;
  title: string;
  icon: string;
  summary: string;
  keyPoints: { title: string; desc: string; icon: string }[];
  deepDive: string;
  quizQuestion: {
    question: string;
    options: { label: string; explanation: string; isCorrect: boolean }[];
  };
}

const SCHOOL_SECTIONS: LearningSection[] = [
  {
    id: 'fundamentals',
    badge: 'Subsection 01 · The Handheld Paradigm',
    title: "What Mobile App Development is All About",
    icon: '📱',
    summary:
      'Mobile development is the specialized discipline of engineering software for constrained handheld computers. Unlike cloud servers with infinite electricity and unlimited memory, mobile phones operate under strict battery thermal limits, fluctuating network conditions, and touch-first interactions.',
    keyPoints: [
      {
        title: 'Hardware & Energy Constraints',
        desc: 'Smartphones throttle CPU frequencies when overheated. Mobile code must conserve battery cycles and avoid burning CPU in endless background loops.',
        icon: '🔋'
      },
      {
        title: 'Dynamic Network Transitions',
        desc: 'Apps must seamlessly handle real-world network drops (Wi-Fi to 4G to underground subway tunnel offline) using local caching and optimistic UI.',
        icon: '📶'
      },
      {
        title: '60/120 FPS Touch & Haptics',
        desc: 'Mobile users interact directly with their fingers. UI dropped frames (jank) are immediately perceived as sluggish and broken.',
        icon: '⚡'
      },
      {
        title: 'Hardware Sensors & Peripherals',
        desc: 'Native integration with GPS location, cameras, biometric sensors, Bluetooth Low Energy (BLE), and accelerometers.',
        icon: '📷'
      }
    ],
    deepDive:
      'In traditional web engineering, a backend server runs in an air-conditioned datacenter with continuous power. On mobile, your application runs on an iPhone or Android phone in a user’s pocket.\n\nThe OS can kill your app at any second to free RAM for an incoming phone call or camera launch. Mobile software engineers design for resilience: instant state restoration, zero uncollected memory leaks, and local offline-first persistence.',
    quizQuestion: {
      question:
        'Why can mobile developers NOT treat smartphones like small cloud web servers?',
      options: [
        {
          label: 'Mobile devices have strict battery thermal limits, aggressive OS process kills for low RAM, and dynamic network drops that mandate offline caching.',
          explanation: 'Correct! Handheld devices operate under strict physical constraints and OS memory reclaiming, requiring offline-first and memory-conscious engineering.',
          isCorrect: true
        },
        {
          label: 'Smartphones have too much RAM, so code optimization is completely unnecessary.',
          explanation: 'Incorrect. Mobile OS enforces hard per-app heap limits (often 192MB - 512MB) regardless of physical RAM.',
          isCorrect: false
        },
        {
          label: 'Mobile apps never communicate with backend APIs or internet servers.',
          explanation: 'Incorrect. Almost all production mobile apps interact with cloud APIs over dynamic mobile networks.',
          isCorrect: false
        }
      ]
    }
  },

  {
    id: 'industries',
    badge: 'Subsection 02 · Career Opportunities',
    title: 'High-Demand Industries You Can Work In',
    icon: '🏢',
    summary:
      'Mobile engineers are essential across global high-growth technology sectors. Each industry has unique engineering challenges, compliance standards, and architectural requirements.',
    keyPoints: [
      {
        title: 'FinTech & Digital Banking (OPay, Revolut, Stripe)',
        desc: 'High-security biometric authentication, hardware-backed KeyStore/Keychain encryption, offline ledgers, and zero-tolerance for crash loops during money transfers.',
        icon: '💳'
      },
      {
        title: 'Logistics & Ride-Hailing (Uber, Lyft, Jumia)',
        desc: 'Real-time GPS turn-by-turn routing, battery-optimized geofencing, low-latency driver-rider WebSockets, and background location services.',
        icon: '🚗'
      },
      {
        title: 'HealthTech & Telemedicine',
        desc: 'Bluetooth Low Energy (BLE) vital monitor pairing, encrypted patient vaults (SQLCipher), camera document scanning, and strict HIPAA/GDPR health privacy.',
        icon: '🩺'
      },
      {
        title: 'Streaming, Social & Gaming (Spotify, TikTok)',
        desc: 'Silky 60/120 FPS ProMotion render pipelines, audio/video streaming buffer caches, GPU shaders, and reactive UI feeds.',
        icon: '🎮'
      }
    ],
    deepDive:
      'Choosing your mobile industry shapes your daily engineering challenges:\n- In FinTech: Security, cryptography, and transaction state consistency rule supreme.\n- In Logistics: Geolocation math, battery drain mitigation, and background services take center stage.\n- In Consumer & Gaming: Frame render budgets, animations, and viral onboarding conversion dictate success.',
    quizQuestion: {
      question:
        'Which mobile engineering industry requires hardware-backed KeyStore/Keychain biometric encryption and zero tolerance for checkout crashes?',
      options: [
        {
          label: 'FinTech & Digital Banking apps handling financial transactions and customer balances.',
          explanation: 'Correct! Financial applications must enforce hardware-backed biometric security and flawless transaction consistency.',
          isCorrect: true
        },
        {
          label: 'Casual wallpaper and ringtone download apps.',
          explanation: 'Incorrect. Wallpaper apps do not manage encrypted financial credentials or biometric enclaves.',
          isCorrect: false
        },
        {
          label: 'Simple static HTML documentation readers.',
          explanation: 'Incorrect. Static document readers do not manage banking transactions.',
          isCorrect: false
        }
      ]
    }
  },

  {
    id: 'pre_graduation',
    badge: 'Subsection 03 · Pre-Graduation Checklist',
    title: 'Things You Must Know Before Graduating From School',
    icon: '🎓',
    summary:
      'Top technology companies expect computer science and self-taught graduates to understand mobile operating system fundamentals on day one, not just basic UI drag-and-drop.',
    keyPoints: [
      {
        title: 'Modern Declarative UI',
        desc: 'Jetpack Compose on Android and SwiftUI on iOS replace outdated imperative XML layouts and Storyboards with reactive state-driven components.',
        icon: '🧩'
      },
      {
        title: 'Mobile OS Lifecycles & Process Death',
        desc: 'Activities and ViewControllers are destroyed on screen rotation or low memory. You must master state restoration (onSaveInstanceState).',
        icon: '🔄'
      },
      {
        title: 'Memory Leaks & Retained Context',
        desc: 'Holding a hard reference to a destroyed UI screen inside a long-lived async listener leaks 30MB+ of view memory, triggering Out-Of-Memory (OOM) fatal crashes.',
        icon: '🧠'
      },
      {
        title: 'App Store Review Guidelines',
        desc: 'Apple App Store and Google Play reject binaries for missing privacy manifests, unannounced tracking APIs, hidden subscription fees, or launch crashes.',
        icon: '📜'
      }
    ],
    deepDive:
      'The #1 interview filter for junior mobile engineers is Memory & Lifecycle.\nWhen an Android activity rotates, the system tears it down. If your code registered a callback with a static singleton and did not unregister in onDestroy/onCleared, that dead screen remains trapped in RAM.\nAccumulate 3 rotated screens with image bitmaps, and your app terminates with Fatal Signal 11 (OOM Killer). Always unregister listeners and use WeakReferences.',
    quizQuestion: {
      question:
        'What happens when a mobile screen closes, but an asynchronous background listener retains a strong reference to its context/view controller?',
      options: [
        {
          label: 'The entire UI view hierarchy cannot be garbage-collected, creating a memory leak that causes an Out-Of-Memory (OOM) crash.',
          explanation: 'Correct! Retained context references prevent the garbage collector from reclaiming destroyed UI hierarchies.',
          isCorrect: true
        },
        {
          label: 'The mobile phone automatically adds 4GB of virtual memory to compensate.',
          explanation: 'Incorrect. Mobile operating systems enforce hard per-app heap ceilings and terminate leaky processes.',
          isCorrect: false
        },
        {
          label: 'Nothing happens because modern programming languages prevent all memory leaks automatically.',
          explanation: 'Incorrect. Garbage collection cannot collect objects that still have live references from active singletons or threads.',
          isCorrect: false
        }
      ]
    }
  },

  {
    id: 'ecosystem',
    badge: 'Subsection 04 · Architectural Choices',
    title: 'Native vs Cross-Platform Ecosystems',
    icon: '⚖️',
    summary:
      'Every engineering organization must make a strategic architectural bet: build Dual Native applications or adopt a Unified Cross-Platform framework.',
    keyPoints: [
      {
        title: 'Native Engineering (Swift / Kotlin)',
        desc: 'Maximum runtime performance, zero abstraction latency, immediate access to zero-day OS features (Dynamic Island, predictive back). Requires two separate codebases.',
        icon: '🚀'
      },
      {
        title: 'Cross-Platform (React Native / Flutter)',
        desc: 'Single codebase for iOS and Android, faster initial MVP shipping velocity, but introduces bridging overhead, larger binary sizes, and third-party framework reliance.',
        icon: '🌐'
      },
      {
        title: 'Kotlin Multiplatform (KMP)',
        desc: 'Modern hybrid: share core business logic, cryptography, and network models in Kotlin, while keeping 100% native SwiftUI and Jetpack Compose for UI.',
        icon: '✨'
      },
      {
        title: 'Strategic Decision Factors',
        desc: 'High-performance FinTech, gaming, or hardware-pairing apps favor Native or KMP. Content feeds, CRUD tools, and early MVPs favor Cross-Platform.',
        icon: '📊'
      }
    ],
    deepDive:
      'There is no universal "best" framework—only architectural tradeoffs.\n- Dual Native costs more in developer salaries but eliminates abstraction bugs and guarantees peak user experience.\n- React Native / Flutter reduce time-to-market for early startups with limited engineering teams.\n- KMP provides the middle path: zero code duplication in networking and business logic with zero compromise on native UI performance.',
    quizQuestion: {
      question:
        'When is choosing Dual Native (Swift & Kotlin) or KMP Hybrid strictly preferred over a cross-platform wrapper?',
      options: [
        {
          label: 'When the app requires high-performance hardware peripherals (custom Bluetooth, biometric enclaves, Metal shaders) and zero abstraction lag.',
          explanation: 'Correct! High-performance apps requiring deep hardware integration and zero-day OS feature adoption thrive on Native architectures.',
          isCorrect: true
        },
        {
          label: 'When you want to build a simple read-only static text blog with zero hardware integration.',
          explanation: 'Incorrect. Simple static content apps are well-suited for lightweight cross-platform or web wrappers.',
          isCorrect: false
        },
        {
          label: 'When the company has only one junior developer who only knows basic CSS.',
          explanation: 'Incorrect. Dual native requires dedicated Swift and Kotlin expertise.',
          isCorrect: false
        }
      ]
    }
  }
];

export const SchoolLearningStation: React.FC<SchoolLearningStationProps> = ({
  career,
  phase,
  isMuted = false,
  onComplete,
  onBack,
}) => {
  // Current active subsection tab: 0 to 3 for learning sections, 4 for final graduation quiz
  const [activeSectionIdx, setActiveSectionIdx] = useState<number>(0);
  
  // Quiz answers tracked by section index
  const [sectionQuizSelections, setSectionQuizSelections] = useState<Record<number, number>>({});
  const [completedSections, setCompletedSections] = useState<Record<number, boolean>>({});

  // Audio narration state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [loadingAudio, setLoadingAudio] = useState<boolean>(false);

  // Sound effects
  useEffect(() => {
    soundEffects.enabled = !isMuted;
  }, [isMuted]);

  const currentSection = SCHOOL_SECTIONS[activeSectionIdx];
  const totalSections = SCHOOL_SECTIONS.length;
  const completedCount = Object.keys(completedSections).length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  // Play audio narration
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

  // Handle quiz question selection
  const handleSelectQuizOption = (sectionIdx: number, optionIdx: number) => {
    soundEffects.playClick();
    setSectionQuizSelections((prev) => ({ ...prev, [sectionIdx]: optionIdx }));

    const isCorrect = SCHOOL_SECTIONS[sectionIdx].quizQuestion.options[optionIdx].isCorrect;
    if (isCorrect) {
      soundEffects.playAchievement();
      setCompletedSections((prev) => ({ ...prev, [sectionIdx]: true }));
    }
  };

  // Graduation Action: Complete School Stage and Unlock Stage 2 (Internship)
  const handleGraduate = () => {
    soundEffects.playSuccess();

    // Construct formal academic certificate submission
    const graduationSummary = `ACADEMIC FOUNDATION & DEGREE GATE COMPLETION CERTIFICATE
CANDIDATE: A. Nabeel · Mobile App Developer Foundation Track
ACCREDITATION: ${career.professional_body}
DEGREE GATE: ${career.degree_gate}
COMPLETION DATE: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}

1. SECTION 01 MASTERY - WHAT MOBILE DEV IS ALL ABOUT:
- Understood constrained handheld paradigm, battery thermal limits, dynamic network drop recovery, and 60/120 FPS frame budgets.
- Quiz Verified: Correctly articulated mobile hardware constraints and local caching requirements.

2. SECTION 02 MASTERY - HIGH-DEMAND INDUSTRIES:
- Analyzed FinTech (biometric security, zero-crash ledgers), Logistics (GPS geofencing, background battery optimization), HealthTech (BLE pairing, encrypted storage), and Streaming/Gaming (render pipelines).
- Quiz Verified: Identified banking security mandates and hardware-backed KeyStore protection.

3. SECTION 03 MASTERY - PRE-GRADUATION KNOWLEDGE:
- Mastered modern Declarative UI (Jetpack Compose & SwiftUI), Activity/ViewController lifecycles, state restoration across process death, and memory leak prevention.
- Quiz Verified: Proved understanding of retained context in asynchronous listeners causing Fatal Signal 11 OOM crashes.

4. SECTION 04 MASTERY - NATIVE VS CROSS-PLATFORM ARCHITECTURE:
- Evaluated performance, Total Cost of Ownership (TCO), and architectural tradeoffs between Swift/Kotlin Native, React Native, Flutter, and Kotlin Multiplatform (KMP).
- Quiz Verified: Defended choosing native architectures for deep hardware and security-critical systems.

ACADEMIC CERTIFICATION: 100% SCORE ACROSS ALL 4 FOUNDATION QUIZZES.
CANDIDATE HAS GRADUATED SCHOOL FOUNDATIONS AND IS OFFICIALLY CERTIFIED TO ENTER STAGE 2: INTERNSHIP.`;

    // Construct high-score rubric evaluation for the 2 criteria defined in careers.json
    const evaluation: EvaluationResult = {
      criteria: [
        {
          criterion: 'platform_ecosystem',
          score: 5,
          max: 5,
          justification:
            'The candidate demonstrated exceptional mastery over mobile operating system lifecycles, memory leak prevention, and native vs cross-platform tradeoffs through interactive quizzes.',
          quote_from_user: 'Understood constrained handheld paradigm, battery thermal limits, and native vs cross-platform tradeoffs.'
        },
        {
          criterion: 'graduate_readiness',
          score: 5,
          max: 5,
          justification:
            'The candidate completed all pre-graduation knowledge checkpoints, proving day-one readiness for industry internship assignments without requiring basic remedial instruction.',
          quote_from_user: 'Mastered modern Declarative UI, Activity/ViewController lifecycles, state restoration, and memory leak prevention.'
        }
      ]
    };

    onComplete(graduationSummary, evaluation, {
      quizScore: `${completedCount}/${totalSections}`,
      schoolStatus: 'GRADUATED_HONORS'
    });
  };

  const isAllQuizzesPassed = completedCount >= totalSections;

  return (
    <div className="space-y-6 select-none font-sans">
      {/* =========================================================================
          SCHOOL LECTURE HALL HUD (LinkedIn / Facebook Clean Style)
      ========================================================================= */}
      <div className="bg-[#0f172a] text-white rounded-3xl border-2 border-[#0a66c2] shadow-2xl p-5 sm:p-7 space-y-4 relative overflow-hidden">
        {/* Accreditation Ribbon */}
        <div className="absolute -top-3 -right-12 bg-[#0a66c2] text-white font-mono font-black text-[10px] tracking-widest px-14 py-1 rotate-12 uppercase shadow-md select-none">
          SCHOOL STAGE · NO TASKS
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-black uppercase tracking-widest text-sky-400">
                STAGE #01 · UNIVERSITY FOUNDATIONS & ACADEMIC LEARNING
              </span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
              <span>🎓</span>
              <span>Mobile Engineering School: Interactive Foundations</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Pure interactive learning & progress tracking quizzes · Zero workplace tasks
            </p>
          </div>

          {/* Progress Tracker: Subsections Completed + Grade Meter */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/95 border border-slate-800 p-2.5 sm:px-4 sm:py-2 rounded-2xl">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <div className="text-right">
                <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">QUIZZES PASSED</span>
                <span className="font-mono text-sm font-black text-emerald-400">
                  {completedCount} / {totalSections}
                </span>
              </div>
            </div>

            <div className="w-24 h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="font-mono text-xs font-bold text-sky-300">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* School Motto / Degree Gate Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-sky-400 font-bold">DEGREE GATE:</span>
            <span className="text-slate-200">{career.degree_gate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Accredited Curriculum: {career.professional_body}</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUBSECTIONS NAVIGATION BAR (LinkedIn / Facebook Clean Style)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-md space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SCHOOL_SECTIONS.map((section, idx) => {
            const isCurrent = activeSectionIdx === idx;
            const isDone = completedSections[idx];

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setActiveSectionIdx(idx);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  isCurrent
                    ? 'bg-[#0a66c2] text-white font-bold border-[#0a66c2] shadow-md ring-2 ring-[#0a66c2]/30'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="min-w-0">
                  <span className={`text-[9px] uppercase font-mono block ${isCurrent ? 'text-sky-200' : 'text-slate-500'}`}>
                    Sub {idx + 1}
                  </span>
                  <span className="text-xs font-bold truncate block">
                    {section.icon} {section.title.split(' ')[0]} {section.title.split(' ')[1] || ''}
                  </span>
                </div>
                {isDone ? (
                  <Check className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white' : 'text-emerald-600'}`} />
                ) : (
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isCurrent ? 'bg-white' : 'bg-slate-300'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Current Goal Help Tip */}
        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-[#0a66c2] font-bold">CURRENT STEP:</span>
            <span>
              📖 Read Subsection {activeSectionIdx + 1} of 4, then answer the quiz below to prove mastery
            </span>
          </div>
          <span className="text-emerald-700 font-bold hidden md:inline">
            {completedCount}/{totalSections} Quizzes Passed
          </span>
        </div>
      </div>

      {/* =========================================================================
          ACTIVE SUBSECTION LEARNING CARD
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl p-6 sm:p-8 space-y-6 text-slate-900 animate-in fade-in">
        {/* Subsection Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-2xl shrink-0">
              {currentSection.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0a66c2] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {currentSection.badge}
              </span>
              <h2 className="font-heading font-black text-slate-900 text-lg sm:text-2xl mt-0.5">
                {currentSection.title}
              </h2>
            </div>
          </div>

          {/* AI Voice Read-Aloud Button */}
          <button
            type="button"
            disabled={isMuted}
            onClick={() =>
              handlePlayVoice(
                `${currentSection.title}. ${currentSection.summary}. ${currentSection.deepDive}`
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
            <span>{loadingAudio ? 'Synthesizing Audio…' : isPlayingAudio ? 'Stop Voice' : 'Listen to Lesson (AI Voice)'}</span>
          </button>
        </div>

        {/* Executive Summary */}
        <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans font-medium">
            {currentSection.summary}
          </p>
        </div>

        {/* 4 Interactive Topic Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {currentSection.keyPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-[#0a66c2] transition-colors space-y-1.5"
            >
              <div className="flex items-center gap-2 font-heading font-bold text-xs sm:text-sm text-slate-900">
                <span className="text-lg">{point.icon}</span>
                <span>{point.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {point.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Deep Dive Doctrine Box */}
        <div className="p-5 rounded-2xl bg-[#0f172a] text-white space-y-2 border-2 border-slate-800 shadow-inner">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-400 tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Academic Deep Dive & Real-World Mechanism:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line pt-1">
            {currentSection.deepDive}
          </p>
        </div>

        {/* =========================================================================
            INTERACTIVE PROGRESS TRACKING QUIZ FOR THIS SUBSECTION
        ========================================================================= */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-heading font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Progress Quiz: Verify Comprehension for Subsection {activeSectionIdx + 1}</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-[#0a66c2]">
              {completedSections[activeSectionIdx] ? 'PASSED ✓' : 'UNANSWERED'}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
            {currentSection.quizQuestion.question}
          </p>

          <div className="space-y-2.5">
            {currentSection.quizQuestion.options.map((opt, optIdx) => {
              const selectedIdx = sectionQuizSelections[activeSectionIdx];
              const isSelected = selectedIdx === optIdx;

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectQuizOption(activeSectionIdx, optIdx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 text-emerald-950 font-bold'
                        : 'bg-red-50 border-red-500 ring-2 ring-red-200 text-red-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <div className="space-y-1">
                    <span className="font-semibold block leading-relaxed">{opt.label}</span>
                    {isSelected && (
                      <p
                        className={`text-[11px] leading-relaxed pt-1 font-mono ${
                          opt.isCorrect ? 'text-emerald-700 font-bold' : 'text-red-700'
                        }`}
                      >
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            disabled={activeSectionIdx === 0}
            onClick={() => {
              soundEffects.playClick();
              setActiveSectionIdx((prev) => Math.max(0, prev - 1));
            }}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-colors ${
              activeSectionIdx === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200 text-slate-400'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Subsection</span>
          </button>

          {activeSectionIdx < totalSections - 1 ? (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setActiveSectionIdx((prev) => Math.min(totalSections - 1, prev + 1));
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-heading text-xs font-black shadow-md cursor-pointer transition-all"
            >
              <span>Next: Subsection {activeSectionIdx + 2} 👉</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">
                {isAllQuizzesPassed ? 'All 4 quizzes completed!' : 'Answer all quizzes above to graduate'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          GRADUATION CERTIFICATE & PROGRESSION TO STAGE 2 (INTERNSHIP)
      ========================================================================= */}
      <div className={`rounded-3xl border-2 p-6 sm:p-8 transition-all ${
        isAllQuizzesPassed
          ? 'bg-gradient-to-br from-emerald-50 via-white to-sky-50 border-emerald-400 shadow-xl'
          : 'bg-white border-slate-200 opacity-90'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="font-heading font-black text-slate-900 text-base sm:text-lg">
                Stage 1 Completion & Graduation Status
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans max-w-xl">
              {isAllQuizzesPassed
                ? '🌟 Congratulations! You have mastered all 4 school foundation subsections and passed the quizzes. Your theoretical foundation is now certified. You are officially ready to advance to Stage 2: Internship (practical bug squashing & tasks).'
                : `👉 Complete the interactive quizzes for each subsection to graduate (${completedCount} of ${totalSections} currently passed). Once finished, you will unlock Stage 2 (Internship).`}
            </p>
          </div>

          <button
            type="button"
            disabled={!isAllQuizzesPassed}
            onClick={handleGraduate}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-heading text-xs font-black shadow-xl cursor-pointer transition-all ${
              isAllQuizzesPassed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse active:scale-98'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>
              {isAllQuizzesPassed
                ? 'GRADUATE & PROCEED TO STAGE 2: INTERNSHIP 👉'
                : `PASS ALL QUIZZES TO GRADUATE (${completedCount}/${totalSections})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
