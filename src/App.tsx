/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Career, Phase, PhaseProgress, EvaluationResult } from './types/career';
import careersData from './data/careers.json';
import { Header } from './components/Header';
import { Sidebar, MobilePhaseNav } from './components/Sidebar';
import { RightWidgetRail } from './components/RightWidgetRail';
import { CareerSelect } from './components/CareerSelect';
import { CareerTimeline } from './components/CareerTimeline';
import { StageRealitySimulation } from './components/StageRealitySimulation';
import { FeedbackPanel } from './components/FeedbackPanel';
import { RemediationPanel } from './components/RemediationPanel';
import { CareerLoopRecord } from './components/CareerLoopRecord';
import { loadAllProgress, savePhaseProgress, clearAllProgress } from './utils/storage';
import { MentorPanel } from './components/mentor/MentorPanel';
import {
  CareerLoopMemory,
  loadMentorMemory,
  saveMentorMemory,
  executeTriggerA_Evaluation,
  executeTriggerB_Patterns,
  updateWeakCriterionRemediation,
  calculateFactsCount,
} from './utils/mentorMemory';
import { Sparkles } from 'lucide-react';

type AppView = 'select' | 'timeline' | 'phase' | 'feedback' | 'remediation' | 'record';

export default function App() {
  const careers: Career[] = careersData as Career[];

  // Default to 'phase' view so user directly lands inside the active career simulation, or restore saved view
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const saved = localStorage.getItem('careerloop_current_view');
      if (saved && ['select', 'timeline', 'phase', 'feedback', 'remediation', 'record'].includes(saved)) {
        return saved as AppView;
      }
    } catch (e) {}
    return 'phase';
  });

  const [selectedCareerId, setSelectedCareerId] = useState<string>('mobile_dev');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('careerloop_selected_phase');
      if (saved) return saved;
    } catch (e) {}
    return 'learn';
  });

  // Remediate state selection
  const [activeRemediationCriterion, setActiveRemediationCriterion] = useState<{
    criterion: string;
    description: string;
    justification: string;
  } | null>(null);

  // Global TTS mute state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // All phase progress records mapped by `${careerId}_${phaseId}`
  const [progressMap, setProgressMap] = useState<Record<string, PhaseProgress>>({});

  // Persistent CareerLoop Memory for AI Mentor
  const [mentorMemory, setMentorMemory] = useState<CareerLoopMemory>(() => {
    const careerObj = (careersData as Career[]).find((c) => c.career_id === 'mobile_dev') || (careersData as Career[])[0];
    const initialPhase = careerObj?.phases[0];
    return loadMentorMemory(
      careerObj.career_id,
      careerObj.name,
      1,
      initialPhase?.label || '1. Career Foundations (School & Ecosystems)'
    );
  });

  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(true);
  const [isMobileMentorModalOpen, setIsMobileMentorModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const saved = loadAllProgress();
    setProgressMap(saved);
  }, []);

  // Listen for memory updates from other triggers
  useEffect(() => {
    const handleMemoryUpdated = (e: Event) => {
      const custom = e as CustomEvent<CareerLoopMemory>;
      if (custom.detail) {
        setMentorMemory(custom.detail);
      }
    };
    window.addEventListener('careerloop_memory_updated', handleMemoryUpdated);
    return () => window.removeEventListener('careerloop_memory_updated', handleMemoryUpdated);
  }, []);

  const changeView = (view: AppView) => {
    setCurrentView(view);
    try {
      localStorage.setItem('careerloop_current_view', view);
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedCareer = careers.find((c) => c.career_id === selectedCareerId) || careers[0];
  const selectedPhase =
    selectedCareer?.phases.find((p) => p.id === selectedPhaseId) || selectedCareer.phases[0];
  const currentProgressKey = `${selectedCareerId}_${selectedPhaseId}`;
  const currentProgress = progressMap[currentProgressKey];

  // Group completed phases by career
  const completedPhasesByCareer: Record<string, string[]> = {};
  Object.values(progressMap).forEach((p) => {
    if (p.evaluation) {
      if (!completedPhasesByCareer[p.careerId]) {
        completedPhasesByCareer[p.careerId] = [];
      }
      completedPhasesByCareer[p.careerId].push(p.phaseId);
    }
  });

  const completedCount = selectedCareer.phases.filter(
    (p) => progressMap[`${selectedCareer.career_id}_${p.id}`]?.evaluation
  ).length;

  const handleSelectCareer = (careerId: string) => {
    setSelectedCareerId(careerId);
    const careerObj = careers.find((c) => c.career_id === careerId) || careers[0];
    const firstPhase = careerObj.phases[0];
    const newStageNum = 1;
    const newStageLabel = firstPhase?.label || '';
    setSelectedPhaseId(firstPhase.id);

    // Initialise career track in mentor memory (increments version)
    const updatedMem: CareerLoopMemory = {
      ...mentorMemory,
      career: careerObj.career_id,
      career_label: careerObj.name,
      current_stage: newStageNum,
      stage_label: newStageLabel,
    };
    saveMentorMemory(updatedMem);
    setMentorMemory(updatedMem);

    changeView('phase');
  };

  const handleSelectPhase = (phaseId: string) => {
    setSelectedPhaseId(phaseId);
    try {
      localStorage.setItem('careerloop_selected_phase', phaseId);
    } catch (e) {}

    const phaseIndex = selectedCareer.phases.findIndex((p) => p.id === phaseId);
    const newStageNum = phaseIndex >= 0 ? phaseIndex + 1 : 1;
    const targetPhase = selectedCareer.phases[phaseIndex] || selectedCareer.phases[0];

    const updatedMem: CareerLoopMemory = {
      ...mentorMemory,
      current_stage: newStageNum,
      stage_label: targetPhase.label,
    };
    saveMentorMemory(updatedMem);
    setMentorMemory(updatedMem);

    changeView('phase');
  };

  const handleViewRecord = () => {
    changeView('record');
  };

  const handlePhaseComplete = (
    submissionText: string,
    evaluation: EvaluationResult,
    answers?: Record<string, string>
  ) => {
    const updated: PhaseProgress = {
      careerId: selectedCareerId,
      phaseId: selectedPhaseId,
      phaseLabel: selectedPhase.label,
      phaseType: selectedPhase.type,
      promptText: selectedPhase.brief || selectedPhase.content || '',
      answers,
      submissionText,
      evaluation,
      completedAt: new Date().toISOString(),
    };

    savePhaseProgress(updated);
    setProgressMap((prev) => ({
      ...prev,
      [currentProgressKey]: updated,
    }));

    // Trigger A: after every stage evaluation (pure data, do not call an AI model)
    const phaseIndex = selectedCareer.phases.findIndex((p) => p.id === selectedPhaseId);
    const stageNumber = phaseIndex >= 0 ? phaseIndex + 1 : 1;

    const memoryAfterTriggerA = executeTriggerA_Evaluation(
      mentorMemory,
      stageNumber,
      evaluation.criteria
    );
    setMentorMemory(memoryAfterTriggerA);

    // Asynchronously resolve /api/remediate for any criteria scoring <= 2 to enrich remediation_received
    evaluation.criteria
      .filter((c) => c.score <= 2)
      .forEach(async (c) => {
        try {
          const res = await fetch('/api/remediate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              criterion: c.criterion,
              criterionDescription:
                selectedPhase.rubric?.find((r) => r.criterion === c.criterion)?.description || '',
              submission: submissionText,
              justification: c.justification,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.lesson) {
              setMentorMemory((current) =>
                updateWeakCriterionRemediation(current, c.criterion, data.lesson)
              );
            }
          }
        } catch (err) {
          console.warn('Background /api/remediate fetch error:', err);
        }
      });

    // Trigger B: after every stage completes, call /api/mentor-patterns and update patterns
    executeTriggerB_Patterns(memoryAfterTriggerA).then((memoryAfterTriggerB) => {
      setMentorMemory(memoryAfterTriggerB);
    });

    changeView('feedback');
  };

  const handleStartRemediation = (
    criterion: string,
    criterionDesc: string,
    justification: string
  ) => {
    setActiveRemediationCriterion({
      criterion,
      description: criterionDesc,
      justification,
    });
    changeView('remediation');
  };

  const handleCompleteRevision = (
    lesson: string,
    practiceItem: string,
    revisedSubmission: string,
    revisedEvaluation: EvaluationResult
  ) => {
    if (!currentProgress) return;

    const updated: PhaseProgress = {
      ...currentProgress,
      remediation: {
        criterion: activeRemediationCriterion?.criterion || '',
        criterionDescription: activeRemediationCriterion?.description || '',
        lesson,
        practice_item: practiceItem,
        revisedSubmission,
        revisedEvaluation,
      },
    };

    savePhaseProgress(updated);
    setProgressMap((prev) => ({
      ...prev,
      [currentProgressKey]: updated,
    }));

    // Update weak criterion's remediation text in memory
    if (activeRemediationCriterion?.criterion && lesson) {
      const updatedMem = updateWeakCriterionRemediation(
        mentorMemory,
        activeRemediationCriterion.criterion,
        lesson
      );
      setMentorMemory(updatedMem);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset all career simulation progress and recorded capability records?')) {
      clearAllProgress();
      setProgressMap({});
      changeView('select');
    }
  };

  const hasAnyCompletedPhases = Object.values(progressMap).some(
    (p) => p.careerId === selectedCareerId && Boolean(p.evaluation)
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 flex flex-col font-sans antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* LinkedIn / Facebook Style Top Navigation Header */}
      <Header
        currentView={currentView}
        careerName={selectedCareer?.name}
        phaseLabel={currentView !== 'select' && currentView !== 'timeline' ? selectedPhase?.label : undefined}
        hasAnyCompletedPhases={hasAnyCompletedPhases}
        completedCount={completedCount}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((prev) => !prev)}
        onGoHome={() => changeView('select')}
        onGoTimeline={() => changeView('timeline')}
        onGoSimulation={() => changeView('phase')}
        onViewRecord={handleViewRecord}
        onResetProgress={Object.keys(progressMap).length > 0 ? handleResetProgress : undefined}
      />

      {/* Mobile Horizontal Stage Navigation */}
      {currentView !== 'select' && (
        <MobilePhaseNav
          career={selectedCareer}
          currentPhaseId={selectedPhaseId}
          progressMap={progressMap}
          onSelectPhase={handleSelectPhase}
        />
      )}

      {/* Main Experience Router */}
      {currentView === 'select' ? (
        <main className="flex-1">
          <CareerSelect
            careers={careers}
            onSelectCareer={handleSelectCareer}
            completedPhasesByCareer={completedPhasesByCareer}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
          />
        </main>
      ) : (
        /* LinkedIn & Facebook Modern 3-Column Architecture */
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex justify-center gap-6 items-start">
          {/* Left Column: Candidate Profile Card + Stages Navigation Rail */}
          <div className="hidden lg:block w-64 shrink-0 sticky top-20">
            <Sidebar
              career={selectedCareer}
              currentPhaseId={selectedPhaseId}
              currentView={currentView}
              progressMap={progressMap}
              onSelectPhase={handleSelectPhase}
              onGoHome={() => changeView('select')}
              onGoTimeline={() => changeView('timeline')}
              onViewRecord={handleViewRecord}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((prev) => !prev)}
            />
          </div>

          {/* Center Column: Social Case Feed / Active Simulation */}
          <main className="flex-1 min-w-0 max-w-3xl w-full">
            {currentView === 'timeline' && (
              <CareerTimeline
                career={selectedCareer}
                phaseProgressMap={progressMap}
                onSelectPhase={handleSelectPhase}
                onViewRecord={handleViewRecord}
                onBackToSelect={() => changeView('select')}
              />
            )}

            {/* Mobile Engineering Career Simulation Engine */}
            {currentView === 'phase' && selectedPhase && (
              <StageRealitySimulation
                career={selectedCareer}
                phase={selectedPhase}
                initialSubmission={currentProgress?.submissionText || ''}
                isMuted={isMuted}
                onComplete={(sub, ev, ans) => handlePhaseComplete(sub, ev, ans)}
                onBack={() => changeView('timeline')}
              />
            )}

            {/* Feedback Surface */}
            {currentView === 'feedback' && currentProgress?.evaluation && (
              <FeedbackPanel
                career={selectedCareer}
                phase={selectedPhase}
                evaluation={currentProgress.evaluation}
                isMuted={isMuted}
                onStartRemediation={handleStartRemediation}
                onViewRecord={handleViewRecord}
                onReturnTimeline={() => changeView('timeline')}
                onRetryPhase={() => changeView('phase')}
              />
            )}

            {/* Remediation Surface */}
            {currentView === 'remediation' && currentProgress && activeRemediationCriterion && (
              <RemediationPanel
                career={selectedCareer}
                phase={selectedPhase}
                criterion={activeRemediationCriterion.criterion}
                criterionDescription={activeRemediationCriterion.description}
                originalSubmission={currentProgress.submissionText}
                assessorJustification={activeRemediationCriterion.justification}
                existingRemediation={currentProgress.remediation}
                onCompleteRevision={handleCompleteRevision}
                onBack={() => changeView('feedback')}
              />
            )}

            {/* Capability Record */}
            {currentView === 'record' && (
              <CareerLoopRecord
                career={selectedCareer}
                allProgress={progressMap}
                onBackToTimeline={() => changeView('timeline')}
              />
            )}
          </main>

          {/* Right Column: Trending Insights, Degree Gap Benchmark Rail */}
          <RightWidgetRail
            career={selectedCareer}
            currentPhase={selectedPhase}
            progressMap={progressMap}
            onViewRecord={handleViewRecord}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted((prev) => !prev)}
          >
            {/* AI Persistent Mentor Panel docked below the right widgets */}
            <div className="pt-2">
              <MentorPanel
                memory={mentorMemory}
                onUpdateMemory={setMentorMemory}
                isOpen={isMentorOpen}
                onToggleOpen={() => setIsMentorOpen((prev) => !prev)}
              />
            </div>
          </RightWidgetRail>
        </div>
      )}

      {/* Floating Mentor Toggle on smaller screens or mobile */}
      {currentView !== 'select' && (
        <div className="xl:hidden fixed bottom-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setIsMobileMentorModalOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 transition-all border border-slate-700 font-medium text-xs cursor-pointer active:scale-95"
          >
            <div className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>Mentor</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
              {calculateFactsCount(mentorMemory)} facts
            </span>
          </button>
        </div>
      )}

      {/* Mobile Drawer Modal when open on smaller viewports */}
      {isMobileMentorModalOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <MentorPanel
              memory={mentorMemory}
              onUpdateMemory={setMentorMemory}
              isOpen={true}
              onToggleOpen={() => setIsMobileMentorModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
