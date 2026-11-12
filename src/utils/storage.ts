/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhaseProgress } from '../types/career';

const STORAGE_KEY = 'careerloop_phase_progress_v2';

export function loadAllProgress(): Record<string, PhaseProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load progress from localStorage', err);
    return {};
  }
}

export function savePhaseProgress(progress: PhaseProgress): void {
  try {
    const existing = loadAllProgress();
    const key = `${progress.careerId}_${progress.phaseId}`;
    existing[key] = progress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

export function getPhaseProgress(careerId: string, phaseId: string): PhaseProgress | undefined {
  const all = loadAllProgress();
  return all[`${careerId}_${phaseId}`];
}

export function clearAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear progress', err);
  }
}
