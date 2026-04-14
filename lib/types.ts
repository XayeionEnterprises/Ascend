import type { SubscriptionTier } from './constants';

export interface UserProfile {
  id: string;
  name: string;
  photoUri: string | null;
  joinedAt: string; // ISO date string
  subscription: SubscriptionTier;
  xp: number;
  streakDays: number;
  lastCheckinDate: string | null; // YYYY-MM-DD
  totalCheckins: number;
}

export interface CheckinAnswers {
  gym: number;    // 0–20
  diet: number;   // 0–20
  sleep: number;  // 0–20
  work: number;   // 0–20
  confidence: number; // 0–20
  photoUri: string | null;
}

export interface DayScore {
  date: string; // YYYY-MM-DD
  auraScore: number;       // 0–100
  disciplineScore: number; // 0–100
  finalScore: number;      // 0–100
  xpEarned: number;
  answers: CheckinAnswers;
  streakDay: number;
}

export interface ScoreBreakdown {
  gym: number;
  diet: number;
  sleep: number;
  work: number;
  confidence: number;
  aura: number;
  discipline: number;
  final: number;
}
