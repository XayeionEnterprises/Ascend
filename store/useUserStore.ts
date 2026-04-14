import { create } from 'zustand';
import type { UserProfile } from '../lib/types';
import { saveUser, loadUser } from '../lib/storage';
import { todayString } from '../lib/scoring';

interface UserStore {
  profile: UserProfile | null;
  isLoaded: boolean;

  loadProfile: () => Promise<void>;
  createProfile: (name: string) => Promise<void>;
  updatePhoto: (uri: string) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  updateStreak: (streakDays: number) => Promise<void>;
  markCheckin: () => Promise<void>;
  setSubscription: (tier: UserProfile['subscription']) => Promise<void>;
  reset: () => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  id: Math.random().toString(36).slice(2),
  name: '',
  photoUri: null,
  joinedAt: new Date().toISOString(),
  subscription: 'free',
  xp: 0,
  streakDays: 0,
  lastCheckinDate: null,
  totalCheckins: 0,
};

export const useUserStore = create<UserStore>((set, get) => ({
  profile: null,
  isLoaded: false,

  loadProfile: async () => {
    const raw = await loadUser();
    if (raw) {
      set({ profile: raw as UserProfile, isLoaded: true });
    } else {
      set({ isLoaded: true });
    }
  },

  createProfile: async (name: string) => {
    const profile: UserProfile = { ...DEFAULT_PROFILE, id: Math.random().toString(36).slice(2), name };
    await saveUser(profile);
    set({ profile });
  },

  updatePhoto: async (uri: string) => {
    const profile = get().profile;
    if (!profile) return;
    const updated = { ...profile, photoUri: uri };
    await saveUser(updated);
    set({ profile: updated });
  },

  addXP: async (amount: number) => {
    const profile = get().profile;
    if (!profile) return;
    const updated = { ...profile, xp: profile.xp + amount };
    await saveUser(updated);
    set({ profile: updated });
  },

  updateStreak: async (streakDays: number) => {
    const profile = get().profile;
    if (!profile) return;
    const updated = { ...profile, streakDays };
    await saveUser(updated);
    set({ profile: updated });
  },

  markCheckin: async () => {
    const profile = get().profile;
    if (!profile) return;
    const updated = {
      ...profile,
      lastCheckinDate: todayString(),
      totalCheckins: profile.totalCheckins + 1,
    };
    await saveUser(updated);
    set({ profile: updated });
  },

  setSubscription: async (tier) => {
    const profile = get().profile;
    if (!profile) return;
    const updated = { ...profile, subscription: tier };
    await saveUser(updated);
    set({ profile: updated });
  },

  reset: async () => {
    set({ profile: null });
    await saveUser({});
  },
}));
