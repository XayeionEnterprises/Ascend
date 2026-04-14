import { create } from 'zustand';
import { CHECKIN_QUESTIONS } from '../lib/constants';

interface CheckinStore {
  currentStep: number;
  answers: Record<string, number>; // questionId → score (0–20)
  photoUri: string | null;

  setAnswer: (questionId: string, score: number) => void;
  setPhoto: (uri: string | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  isComplete: () => boolean;
  getAnswerForStep: (step: number) => number | undefined;
}

export const useCheckinStore = create<CheckinStore>((set, get) => ({
  currentStep: 0,
  answers: {},
  photoUri: null,

  setAnswer: (questionId, score) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: score } })),

  setPhoto: (uri) => set({ photoUri: uri }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, CHECKIN_QUESTIONS.length),
    })),

  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),

  reset: () => set({ currentStep: 0, answers: {}, photoUri: null }),

  isComplete: () => {
    const { answers } = get();
    return CHECKIN_QUESTIONS.every((q) => answers[q.id] !== undefined);
  },

  getAnswerForStep: (step) => {
    const { answers } = get();
    const question = CHECKIN_QUESTIONS[step];
    return question ? answers[question.id] : undefined;
  },
}));
