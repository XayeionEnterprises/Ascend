import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../../store/useUserStore';
import { useScoreStore } from '../../store/useScoreStore';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  getRank,
  getRankProgress,
  getNextRank,
} from '../../lib/constants';
import { isToday, scoreColor, getScoreLabel } from '../../lib/scoring';
import ScoreRing from '../../components/ui/ScoreRing';
import StreakBadge from '../../components/ui/StreakBadge';
import RankBadge from '../../components/ui/RankBadge';
import GradientCard from '../../components/ui/GradientCard';
import Button from '../../components/ui/Button';

export default function HomeScreen() {
  const profile = useUserStore((s) => s.profile);
  const { latestScore, getLast7Days } = useScoreStore();
  const last7 = getLast7Days();

  const hasCheckedInToday = isToday(latestScore?.date ?? null);
  const xp = profile?.xp ?? 0;
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const rankProgress = getRankProgress(xp);
  const streakDays = profile?.streakDays ?? 0;

  const score = hasCheckedInToday ? latestScore?.finalScore ?? 0 : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {profile?.name ?? 'Legend'} 👋
            </Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            {profile?.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>
                  {profile?.name?.[0]?.toUpperCase() ?? 'A'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Badges row */}
        <View style={styles.badgesRow}>
          <StreakBadge days={streakDays} />
          <RankBadge xp={xp} showXP />
        </View>

        {/* Main Score Card */}
        <GradientCard
          borderColors={
            hasCheckedInToday
              ? ([scoreColor(score), COLORS.primary] as [string, string])
              : ([COLORS.border, COLORS.borderLight] as [string, string])
          }
          style={styles.scoreCard}
          innerStyle={styles.scoreCardInner}
        >
          {hasCheckedInToday ? (
            <View style={styles.scoreContent}>
              <ScoreRing
                score={score}
                size={170}
                label="Today's Score"
                sublabel={getScoreLabel(score)}
              />
              <TouchableOpacity
                onPress={() => router.push('/score-result')}
                style={styles.viewResultBtn}
              >
                <Text style={styles.viewResultText}>View Full Breakdown →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.checkinPrompt}>
              <Text style={styles.checkinEmoji}>⚡</Text>
              <Text style={styles.checkinTitle}>No score yet today</Text>
              <Text style={styles.checkinSubtitle}>
                Complete your daily check-in to get your Aura + Discipline score.
              </Text>
              <Button
                label="Start Check-In"
                onPress={() => router.push('/(tabs)/checkin')}
                size="md"
                style={{ marginTop: SPACING.base }}
              />
            </View>
          )}
        </GradientCard>

        {/* XP Progress */}
        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpTitle}>
              {rank.emoji} {rank.name}
            </Text>
            {nextRank && (
              <Text style={styles.xpNext}>
                {(nextRank.minXP - xp).toLocaleString()} XP to {nextRank.name}
              </Text>
            )}
          </View>
          <View style={styles.xpTrack}>
            <View
              style={[
                styles.xpFill,
                {
                  width: `${rankProgress * 100}%`,
                  backgroundColor: rank.color,
                },
              ]}
            />
          </View>
          <Text style={styles.xpTotal}>{xp.toLocaleString()} XP total</Text>
        </View>

        {/* 7-day mini chart */}
        {last7.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Last 7 Days</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/progress')}>
                <Text style={styles.sectionLink}>See all →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.miniChart}>
              {Array.from({ length: 7 }).map((_, idx) => {
                const dayScore = last7[6 - idx];
                const h = dayScore ? Math.max((dayScore.finalScore / 100) * 60, 4) : 4;
                const color = dayScore ? scoreColor(dayScore.finalScore) : COLORS.surface3;
                return (
                  <View key={idx} style={styles.chartBarWrapper}>
                    <View
                      style={[
                        styles.chartBar,
                        { height: h, backgroundColor: color },
                      ]}
                    />
                    <Text style={styles.chartDay}>
                      {getDayLabel(6 - idx, last7.length)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Today's tip */}
        {hasCheckedInToday && latestScore && (
          <GradientCard
            borderColors={['#7C3AED', '#3B82F6']}
            style={styles.tipCard}
          >
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipTitle}>Today's Focus</Text>
            <Text style={styles.tipText}>
              Your weakest area today was sleep quality. Aim for 7–8 hours tonight — it directly impacts tomorrow's score.
            </Text>
          </GradientCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function getDayLabel(daysAgo: number, totalDays: number): string {
  if (daysAgo === 0) return 'Mon';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return days[d.getDay()];
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['2xl'],
    gap: SPACING.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: SPACING.base,
  },
  greeting: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarFallback: {
    backgroundColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.primary,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  scoreCard: {},
  scoreCardInner: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  scoreContent: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  viewResultBtn: {
    paddingVertical: SPACING.xs,
  },
  viewResultText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkinPrompt: {
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  checkinEmoji: {
    fontSize: 40,
  },
  checkinTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  checkinSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.sm * 1.6,
  },
  xpCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  xpNext: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  xpTrack: {
    height: 8,
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  xpTotal: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'right',
  },
  section: {
    gap: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionLink: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  chartBar: {
    width: '100%',
    borderRadius: RADIUS.sm,
    minHeight: 4,
  },
  chartDay: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  tipCard: {},
  tipEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  tipTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.sm * 1.6,
  },
});
