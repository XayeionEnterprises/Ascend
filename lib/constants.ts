// ─── Palette ───────────────────────────────────────────────────────────────
export const COLORS = {
  // Backgrounds
  bg: '#0A0A0B',
  surface: '#141416',
  surface2: '#1C1C1F',
  surface3: '#242428',

  // Borders
  border: '#2C2C30',
  borderLight: '#3A3A3F',

  // Brand
  primary: '#7C3AED',
  primaryLight: '#9F67FF',
  primaryDim: '#3B1E7A',

  // Accent
  accent: '#3B82F6',
  accentLight: '#60A5FA',

  // Semantic
  gold: '#F59E0B',
  goldLight: '#FCD34D',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F97316',

  // Text
  text: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',

  // Gradients (used as arrays in LinearGradient)
  gradientPrimary: ['#7C3AED', '#3B82F6'] as const,
  gradientGold: ['#F59E0B', '#EF4444'] as const,
  gradientDark: ['#1C1C1F', '#141416'] as const,
};

// ─── Typography ─────────────────────────────────────────────────────────────
export const FONT = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 30,
  '3xl': 38,
  '4xl': 48,
};

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

// ─── Border Radius ───────────────────────────────────────────────────────────
export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
};

// ─── Ranks ───────────────────────────────────────────────────────────────────
export interface Rank {
  id: string;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
  gradient: readonly [string, string];
  emoji: string;
  description: string;
}

export const RANKS: Rank[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    minXP: 0,
    maxXP: 999,
    color: '#CD7F32',
    gradient: ['#CD7F32', '#8B5A2B'],
    emoji: '🥉',
    description: 'Just getting started',
  },
  {
    id: 'silver',
    name: 'Silver',
    minXP: 1000,
    maxXP: 2499,
    color: '#9CA3AF',
    gradient: ['#C0C0C0', '#9CA3AF'],
    emoji: '🥈',
    description: 'Building the habit',
  },
  {
    id: 'gold',
    name: 'Gold',
    minXP: 2500,
    maxXP: 4999,
    color: '#F59E0B',
    gradient: ['#F59E0B', '#D97706'],
    emoji: '🥇',
    description: 'Serious about growth',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minXP: 5000,
    maxXP: 9999,
    color: '#E5E4E2',
    gradient: ['#E5E4E2', '#B8B8B6'],
    emoji: '💎',
    description: 'Disciplined & focused',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    minXP: 10000,
    maxXP: 19999,
    color: '#67E8F9',
    gradient: ['#67E8F9', '#22D3EE'],
    emoji: '💠',
    description: 'Elite performer',
  },
  {
    id: 'elite',
    name: 'Elite',
    minXP: 20000,
    maxXP: Infinity,
    color: '#9F67FF',
    gradient: ['#9F67FF', '#7C3AED'],
    emoji: '👑',
    description: 'The 1%',
  },
];

export function getRank(xp: number): Rank {
  return RANKS.slice().reverse().find((r) => xp >= r.minXP) ?? RANKS[0];
}

export function getNextRank(xp: number): Rank | null {
  const current = getRank(xp);
  const idx = RANKS.findIndex((r) => r.id === current.id);
  return RANKS[idx + 1] ?? null;
}

export function getRankProgress(xp: number): number {
  const rank = getRank(xp);
  if (rank.maxXP === Infinity) return 1;
  const range = rank.maxXP - rank.minXP;
  const progress = xp - rank.minXP;
  return Math.min(progress / range, 1);
}

// ─── Score Labels ─────────────────────────────────────────────────────────────
export const SCORE_LABELS: Record<number, string> = {
  0: 'Getting Started',
  20: 'Below Average',
  40: 'Average',
  60: 'Above Average',
  75: 'Strong',
  85: 'Elite',
  95: 'Legendary',
};

export function getScoreLabel(score: number): string {
  const thresholds = Object.keys(SCORE_LABELS)
    .map(Number)
    .sort((a, b) => b - a);
  const match = thresholds.find((t) => score >= t);
  return SCORE_LABELS[match ?? 0];
}

// ─── Subscription Tiers ───────────────────────────────────────────────────────
export type SubscriptionTier = 'free' | 'core' | 'pro';

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, string[]> = {
  free: [
    '1 daily score',
    'Basic Aura + Discipline view',
    'Limited insights',
  ],
  core: [
    'Daily tracking',
    'Streak system',
    '30-day score history',
    'Basic improvement tips',
    'Enhanced share card',
  ],
  pro: [
    'Everything in Core',
    'Advanced score breakdown',
    'Personalized improvement plans',
    'Weekly progress reports',
    'Leaderboards & rankings',
    'Priority AI feedback',
  ],
};

// ─── Check-in Questions ────────────────────────────────────────────────────────
export interface CheckinQuestion {
  id: string;
  category: 'gym' | 'diet' | 'sleep' | 'work' | 'confidence';
  emoji: string;
  question: string;
  options: string[];
  scores: number[]; // 0–20 per option
}

export const CHECKIN_QUESTIONS: CheckinQuestion[] = [
  {
    id: 'gym',
    category: 'gym',
    emoji: '💪',
    question: 'Did you exercise today?',
    options: ['Rest day', 'Light walk', 'Moderate workout', 'Hard session', 'Beast mode'],
    scores: [4, 8, 12, 17, 20],
  },
  {
    id: 'diet',
    category: 'diet',
    emoji: '🥗',
    question: 'How clean was your diet?',
    options: ['Terrible', 'Not great', 'Average', 'Pretty good', 'Perfect'],
    scores: [2, 6, 11, 16, 20],
  },
  {
    id: 'sleep',
    category: 'sleep',
    emoji: '😴',
    question: 'How much sleep did you get?',
    options: ['Under 5h', '5–6 hours', '6–7 hours', '7–8 hours', '8+ hours'],
    scores: [2, 7, 12, 18, 20],
  },
  {
    id: 'work',
    category: 'work',
    emoji: '🧠',
    question: 'How productive were you?',
    options: ['Wasted day', 'Low output', 'Average', 'High output', 'Peak focus'],
    scores: [2, 6, 11, 16, 20],
  },
  {
    id: 'confidence',
    category: 'confidence',
    emoji: '⚡',
    question: 'How was your mindset today?',
    options: ['Very low', 'Below avg', 'Average', 'High energy', 'Unstoppable'],
    scores: [2, 6, 11, 16, 20],
  },
];

// ─── Improvement Tips ─────────────────────────────────────────────────────────
export const IMPROVEMENT_TIPS: Record<CheckinQuestion['category'], string[]> = {
  gym: [
    'Aim for at least 30 min of movement every day.',
    'Progressive overload: add 2.5% more weight each week.',
    'Consistency beats intensity — show up even on low-energy days.',
  ],
  diet: [
    'Prioritize protein at every meal to preserve muscle.',
    'Meal prep Sunday saves willpower for the rest of the week.',
    'Cut liquid calories — water and black coffee are your allies.',
  ],
  sleep: [
    'Sleep is when you build muscle and consolidate memory.',
    'No screens 30 min before bed for better sleep quality.',
    'Keep a consistent sleep schedule, even on weekends.',
  ],
  work: [
    'Time-block deep work in 90-min sessions.',
    'Your first 2 hours after waking are your most productive.',
    'Identify your top 3 tasks the night before.',
  ],
  confidence: [
    'Posture and eye contact signal confidence before you feel it.',
    'Cold showers build mental resilience daily.',
    'Daily wins compound — celebrate small progress.',
  ],
};
