import { create } from 'zustand';
import type { DayScore } from '../lib/types';
import { saveScores, loadScores } from '../lib/storage';

interface ScoreStore {
  scores: DayScore[];
  latestScore: DayScore | null;
  isLoaded: boolean;

  loadScores: () => Promise<void>;
  addScore: (score: DayScore) => Promise<void>;
  getScoreForDate: (date: string) => DayScore | undefined;
  getLast7Days: () => DayScore[];
  getLast30Days: () => DayScore[];
  getAverageScore: () => number;
}

export const useScoreStore = create<ScoreStore>((set, get) => ({
  scores: [],
  latestScore: null,
  isLoaded: false,

  loadScores: async () => {
    const raw = (await loadScores()) as DayScore[];
    const sorted = raw.sort((a, b) => b.date.localeCompare(a.date));
    set({ scores: sorted, latestScore: sorted[0] ?? null, isLoaded: true });
  },

  addScore: async (score) => {
    const scores = get().scores;
    // Replace if same date
    const filtered = scores.filter((s) => s.date !== score.date);
    const updated = [score, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    await saveScores(updated);
    set({ scores: updated, latestScore: updated[0] ?? null });
  },

  getScoreForDate: (date) => get().scores.find((s) => s.date === date),

  getLast7Days: () => get().scores.slice(0, 7),

  getLast30Days: () => get().scores.slice(0, 30),

  getAverageScore: () => {
    const scores = get().getLast7Days();
    if (!scores.length) return 0;
    return Math.round(scores.reduce((acc, s) => acc + s.finalScore, 0) / scores.length);
  },
}));
