/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CompletedStage {
  stage: number;
  score_avg: number;
  date: string;
}

export interface WeakCriterion {
  criterion: string;
  stage: number;
  score: number;
  remediation_received: string;
}

export interface StrongCriterion {
  criterion: string;
  stage: number;
  score: number;
}

export interface SessionSummary {
  session: number;
  bullets: string[];
}

export interface CareerLoopPreferences {
  explanation_style: string;
  wants_salary_guidance: boolean;
}

export interface CareerLoopMemory {
  version: number;
  career: string;
  career_label: string;
  current_stage: number;
  stage_label: string;
  completed_stages: CompletedStage[];
  weak_criteria: WeakCriterion[];
  strong_criteria: StrongCriterion[];
  patterns: string[];
  preferences: CareerLoopPreferences;
  session_summaries: SessionSummary[];
  last_updated: string;
}

const MEMORY_STORAGE_KEY = 'careerloop_memory';

export const STORAGE_WARNING_EVENT = 'careerloop_storage_warning';

function emitStorageWarning(message: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_WARNING_EVENT, { detail: message }));
  }
}

/**
 * Creates a blank memory object adhering strictly to the required schema.
 */
export function createInitialMemory(
  careerId: string = 'mobile_dev',
  careerLabel: string = 'Mobile App Developer',
  stageNumber: number = 1,
  stageLabel: string = '1. Career Foundations (School & Ecosystems)'
): CareerLoopMemory {
  return {
    version: 1,
    career: careerId,
    career_label: careerLabel,
    current_stage: stageNumber,
    stage_label: stageLabel,
    completed_stages: [],
    weak_criteria: [],
    strong_criteria: [],
    patterns: [],
    preferences: {
      explanation_style: 'concrete examples',
      wants_salary_guidance: false,
    },
    session_summaries: [],
    last_updated: new Date().toISOString(),
  };
}

/**
 * Loads current memory from localStorage. Returns newly initialized memory if missing or invalid.
 */
export function loadMentorMemory(
  careerId: string = 'mobile_dev',
  careerLabel: string = 'Mobile App Developer',
  stageNumber: number = 1,
  stageLabel: string = '1. Career Foundations (School & Ecosystems)'
): CareerLoopMemory {
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.version === 'number') {
        return parsed as CareerLoopMemory;
      }
    }
  } catch (err: any) {
    console.warn('Failed to load mentor memory from localStorage:', err);
    emitStorageWarning('Could not read existing mentor memory from local storage.');
  }

  const initial = createInitialMemory(careerId, careerLabel, stageNumber, stageLabel);
  saveMentorMemory(initial);
  return initial;
}

/**
 * Saves memory to localStorage. Automatically increments version.
 * Shows a non-blocking warning if localStorage fails.
 */
export function saveMentorMemory(memory: CareerLoopMemory): boolean {
  try {
    const updated: CareerLoopMemory = {
      ...memory,
      version: (memory.version || 0) + 1,
      last_updated: new Date().toISOString(),
    };
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(updated));
    // Also notify any listening components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('careerloop_memory_updated', { detail: updated }));
    }
    return true;
  } catch (err: any) {
    console.warn('localStorage write failed for careerloop_memory:', err);
    emitStorageWarning('Mentor memory could not be saved to disk due to storage limits.');
    return false;
  }
}

/**
 * Trigger A, after every stage evaluation:
 * Appends to completed_stages with average score and today's date.
 * Appends criteria with score <= 2 to weak_criteria.
 * Appends criteria with score >= 4 to strong_criteria.
 * Pure data operation (no AI model call).
 */
export function executeTriggerA_Evaluation(
  currentMemory: CareerLoopMemory,
  stageNumber: number,
  criteriaScores: Array<{ criterion: string; score: number; justification?: string }>,
  remediationsMap?: Record<string, string>
): CareerLoopMemory {
  if (!criteriaScores || criteriaScores.length === 0) {
    return currentMemory;
  }

  const totalScore = criteriaScores.reduce((sum, c) => sum + c.score, 0);
  const avg = Number((totalScore / criteriaScores.length).toFixed(2));
  const today = new Date().toISOString();

  // 1. Append to completed_stages
  const newCompletedStages: CompletedStage[] = [
    ...currentMemory.completed_stages,
    {
      stage: stageNumber,
      score_avg: avg,
      date: today,
    },
  ];

  // 2. Identify weak (<= 2) and strong (>= 4) criteria
  const newWeakCriteria: WeakCriterion[] = [...currentMemory.weak_criteria];
  const newStrongCriteria: StrongCriterion[] = [...currentMemory.strong_criteria];

  criteriaScores.forEach((c) => {
    if (c.score <= 2) {
      const remediationText =
        remediationsMap?.[c.criterion] ||
        c.justification ||
        `Targeted review recommended for ${c.criterion}: deepen technical rigor and align with platform specifications.`;

      newWeakCriteria.push({
        criterion: c.criterion,
        stage: stageNumber,
        score: c.score,
        remediation_received: remediationText,
      });
    } else if (c.score >= 4) {
      newStrongCriteria.push({
        criterion: c.criterion,
        stage: stageNumber,
        score: c.score,
      });
    }
  });

  const updated: CareerLoopMemory = {
    ...currentMemory,
    completed_stages: newCompletedStages,
    weak_criteria: newWeakCriteria,
    strong_criteria: newStrongCriteria,
  };

  saveMentorMemory(updated);
  return updated;
}

/**
 * Updates remediation received for a specific weak criterion once /api/remediate returns.
 */
export function updateWeakCriterionRemediation(
  currentMemory: CareerLoopMemory,
  criterionName: string,
  remediationText: string
): CareerLoopMemory {
  let matched = false;
  const updatedWeak = currentMemory.weak_criteria.map((w) => {
    if (w.criterion === criterionName && !matched) {
      matched = true;
      return { ...w, remediation_received: remediationText };
    }
    return w;
  });

  if (!matched) {
    updatedWeak.push({
      criterion: criterionName,
      stage: currentMemory.current_stage,
      score: 1,
      remediation_received: remediationText,
    });
  }

  const updated: CareerLoopMemory = {
    ...currentMemory,
    weak_criteria: updatedWeak,
  };

  saveMentorMemory(updated);
  return updated;
}

/**
 * Trigger B, after every stage completes:
 * Calls /api/mentor-patterns with the full weak_criteria and strong_criteria arrays.
 * Replaces patterns field with 3 to 5 plain-language behavioral patterns.
 */
export async function executeTriggerB_Patterns(
  currentMemory: CareerLoopMemory
): Promise<CareerLoopMemory> {
  try {
    const res = await fetch('/api/mentor-patterns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weak_criteria: currentMemory.weak_criteria,
        strong_criteria: currentMemory.strong_criteria,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.patterns) && data.patterns.length > 0) {
        const updated: CareerLoopMemory = {
          ...currentMemory,
          patterns: data.patterns,
        };
        saveMentorMemory(updated);
        return updated;
      }
    }
  } catch (err) {
    console.warn('Trigger B: /api/mentor-patterns failed:', err);
  }

  // Graceful fallback if API fails
  const updated: CareerLoopMemory = {
    ...currentMemory,
  };
  return updated;
}

/**
 * Trigger C, when the mentor panel closes or after every 8 messages:
 * Calls /api/mentor-summarize with recent transcript.
 * Appends to session_summaries.
 */
export async function executeTriggerC_Summarize(
  currentMemory: CareerLoopMemory,
  transcript: Array<{ role: 'user' | 'model'; content: string }>
): Promise<CareerLoopMemory> {
  if (!transcript || transcript.length === 0) {
    return currentMemory;
  }

  try {
    const res = await fetch('/api/mentor-summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.bullets) && data.bullets.length > 0) {
        const nextSessionNum = currentMemory.session_summaries.length + 1;
        const updated: CareerLoopMemory = {
          ...currentMemory,
          session_summaries: [
            ...currentMemory.session_summaries,
            {
              session: nextSessionNum,
              bullets: data.bullets,
            },
          ],
        };
        saveMentorMemory(updated);
        return updated;
      }
    }
  } catch (err) {
    console.warn('Trigger C: /api/mentor-summarize failed:', err);
  }

  return currentMemory;
}

/**
 * Computes N for the header indicator:
 * N = weak_criteria.length + strong_criteria.length + patterns.length + session_summaries.length
 */
export function calculateFactsCount(memory: CareerLoopMemory | null | undefined): number {
  if (!memory) return 0;
  return (
    (memory.weak_criteria?.length || 0) +
    (memory.strong_criteria?.length || 0) +
    (memory.patterns?.length || 0) +
    (memory.session_summaries?.length || 0)
  );
}
