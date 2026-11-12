/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Career, Phase, EvaluationResult } from '../types/career';
import { SchoolLearningStation } from './learning/SchoolLearningStation';
import { MobileWorkplaceEngine } from './careerSim/MobileWorkplaceEngine';

interface StageRealitySimulationProps {
  career: Career;
  phase: Phase;
  initialSubmission?: string;
  isMuted?: boolean;
  onComplete: (submissionText: string, evaluation: EvaluationResult, answers?: Record<string, string>) => void;
  onBack: () => void;
}

/**
 * StageRealitySimulation:
 * Routes Stage 1 ('learn') to the dedicated SchoolLearningStation
 * (pure interactive school foundations + progress quizzes with zero tasks).
 * 
 * Once school foundations are certified, subsequent career stages
 * ('internship', 'job_prep', 'trainee', 'junior', 'mid', 'senior', 'lead')
 * mount the MobileWorkplaceEngine (interactive code lab, live device simulator,
 * team standup with strict vs relaxed managers, salary negotiations, and pull requests).
 */
export const StageRealitySimulation: React.FC<StageRealitySimulationProps> = ({
  career,
  phase,
  initialSubmission = '',
  isMuted = false,
  onComplete,
  onBack,
}) => {
  // Stage 1 is pure school learning and quizzes: NO workplace tasks!
  if (phase.id === 'learn') {
    return (
      <SchoolLearningStation
        career={career}
        phase={phase}
        isMuted={isMuted}
        onComplete={onComplete}
        onBack={onBack}
      />
    );
  }

  // Stage 2 onwards: Internship, Job Prep, Trainee, Junior, Mid, Senior, Lead (Practicals & Engineering Tasks)
  return (
    <MobileWorkplaceEngine
      career={career}
      phase={phase}
      initialSubmission={initialSubmission}
      isMuted={isMuted}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
};
