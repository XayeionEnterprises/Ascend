import type { CheckinAnswers, ScoreBreakdown } from './types';
import { IMPROVEMENT_TIPS } from './constants';

/**
 * Convert a 0–20 raw answer score into 0–100.
 */
function normalize(score: number): number {
  return Math.round((score / 20) * 100);
}

/**
 * Calculate the Discipline Score (gym, diet, sleep, work).
 * Each contributes equally (25% each).
 */
function calcDiscipline(answers: CheckinAnswers): number {
  const avg = (answers.gym + answers.diet + answers.sleep + answers.work) / 4;
  return Math.round((avg / 20) * 100);
}

/**
 * Calculate the Aura Score (confidence + optional photo bonus).
 * Photo adds up to a 20-point bonus when provided.
 */
function calcAura(answers: CheckinAnswers): number {
  const confidenceBase = normalize(answers.confidence);
  // Photo bonus: 0–20 points (deterministic based on filename hash for MVP)
  const photoBonus = answers.photoUri ? derivePhotoScore(answers.photoUri) : 0;
  return Math.min(100, Math.round(confidenceBase * 0.8 + photoBonus));
}

/**
 * Derive a pseudo-score from the photo URI for MVP.
 * Real implementation would call a vision AI model.
 */
function derivePhotoScore(uri: string): number {
  let hash = 0;
  for (let i = 0; i < uri.length; i++) {
    hash = (hash * 31 + uri.charCodeAt(i)) & 0xffffffff;
  }
  return 10 + (Math.abs(hash) % 11); // 10–20 bonus
}

/**
 * Compute the full score breakdown from raw answers.
 */
export function computeScoreBreakdown(answers: CheckinAnswers): ScoreBreakdown {
  const discipline = calcDiscipline(answers);
  const aura = calcAura(answers);
  // Final = 60% discipline + 40% aura
  const final = Math.round(discipline * 0.6 + aura * 0.4);

  return {
    gym: normalize(answers.gym),
    diet: normalize(answers.diet),
    sleep: normalize(answers.sleep),
    work: normalize(answers.work),
    confidence: normalize(answers.confidence),
    aura,
    discipline,
    final,
  };
}

/**
 * Calculate XP earned for a session.
 */
export function calcXP(finalScore: number, streakDays: number): number {
  const base = Math.round(finalScore / 2); // 0–50 base
  const streakBonus = Math.min(streakDays * 2, 20); // up to +20
  return base + streakBonus;
}

/**
 * Format today's date as YYYY-MM-DD.
 */
export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Check if a date string is today.
 */
export function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return dateStr === todayString();
}

/**
 * Check if a date string was yesterday.
 */
export function isYesterday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === yesterday.toISOString().split('T')[0];
}

/**
 * Determine new streak count given the last checkin date.
 */
export function computeStreak(lastCheckinDate: string | null, currentStreak: number): number {
  if (!lastCheckinDate) return 1;
  if (isYesterday(lastCheckinDate)) return currentStreak + 1;
  if (isToday(lastCheckinDate)) return currentStreak; // already checked in
  return 1; // streak broken
}

/**
 * Pick the weakest category and return an improvement tip.
 */
export function getImprovementTip(breakdown: ScoreBreakdown): { category: string; tip: string } {
  const categories: Array<{ key: keyof typeof IMPROVEMENT_TIPS; score: number; label: string }> = [
    { key: 'gym', score: breakdown.gym, label: 'Exercise' },
    { key: 'diet', score: breakdown.diet, label: 'Diet' },
    { key: 'sleep', score: breakdown.sleep, label: 'Sleep' },
    { key: 'work', score: breakdown.work, label: 'Productivity' },
    { key: 'confidence', score: breakdown.confidence, label: 'Mindset' },
  ];

  categories.sort((a, b) => a.score - b.score);
  const weakest = categories[0];
  const tips = IMPROVEMENT_TIPS[weakest.key];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  return { category: weakest.label, tip };
}

/**
 * Score color based on value.
 */
export function scoreColor(score: number): string {
  if (score >= 85) return '#9F67FF'; // elite purple
  if (score >= 70) return '#10B981'; // green
  if (score >= 50) return '#F59E0B'; // gold
  if (score >= 30) return '#F97316'; // orange
  return '#EF4444'; // red
}
