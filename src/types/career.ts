/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PhaseType = 'reading' | 'lesson' | 'application' | 'interview' | 'task';

export interface RubricCriterion {
  criterion: string;
  description: string;
}

export interface LessonItem {
  title?: string;
  content: string;
  practice: string;
}

export interface Phase {
  id: string;
  label: string;
  type: PhaseType;
  status: 'live' | 'designed';
  rubric: RubricCriterion[];
  content?: string; // reading
  questions?: string[]; // reading, interview
  lessons?: LessonItem[]; // lesson
  brief?: string; // application, task
}

export interface Career {
  career_id: string;
  name: string;
  degree_gate: string;
  professional_body: string;
  phases: Phase[];
}

export interface CriterionEvaluation {
  criterion: string;
  score: number;
  max: number;
  justification: string;
  quote_from_user: string;
}

export interface EvaluationResult {
  criteria: CriterionEvaluation[];
}

export interface RemediationResponse {
  lesson: string;
  practice_item: string;
}

export interface PhaseProgress {
  careerId: string;
  phaseId: string;
  phaseLabel: string;
  phaseType: PhaseType;
  promptText: string; // The questions, brief, or lesson practice prompt
  answers?: Record<string, string>;
  submissionText: string;
  evaluation?: EvaluationResult;
  remediation?: {
    criterion: string;
    criterionDescription: string;
    lesson: string;
    practice_item: string;
    revisedSubmission?: string;
    revisedEvaluation?: EvaluationResult;
  };
  completedAt?: string;
}
