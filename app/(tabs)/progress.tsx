import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../../store/useUserStore';
import { useScoreStore } from '../../store/useScoreStore';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  RADIUS,
} from '../../lib/constants';
import { scoreColor } from '../../lib/scoring';
import Button from '../../components/ui/Button';
import GradientCard from '../../components/ui/GradientCard';
import ScoreRing from '../../components/ui/ScoreRing';

export default function ProgressScreen() {
  const profile = useUserStore((s) => s.profile);
  const { scores, getLast30Days, getAverageScore } = useScoreStore();

  const isPaid = profile?.subscription === 'core' || profile?.subscription === 'pro';
  const last30 = getLast30Days();
  const avgScore = getAverageScore();

  if (!isPaid && scores.length > 0) {
    return <LockedProgress onUpgrade={() => router.push('/paywall')} avgScore={avgScore} sampleScores={scores.slice(0, 3)} />;
  }

  if (scores.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>No data yet</Text>
          <Text style={styles.emptySubtitle}>
            Complete your first daily check-in to start tracking your progress.
          </Text>
          <Button
            label="Do My First Check-In"
            onPress={() => router.push('/(tabs)/checkin')}
            size="md"
            style={{ marginTop: SPACING.base }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const maxScore = Math.max(...last30.map((s) => s.finalScore));
  const totalXP = scores.reduce((acc, s) => acc + s.xpEarned, 0);
  const bestStreak = Math.max(...scores.map((s) => s.streakDay));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Progress</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Avg Score', value: avgScore, suffix: '' },
            { label: 'Check-ins', value: scores.length, suffix: '' },
            { label: 'Best Streak', value: bestStreak, suffix: '🔥' },
          ].map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <Text style={[styles.statValue, { color: scoreColor(typeof stat.value === 'number' && stat.label === 'Avg Score' ? stat.value : 70) }]}>
                {stat.value}{stat.suffix}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Bar chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last {last30.length} Days</Text>
          <View style={styles.barChart}>
            {last30.slice().reverse().map((dayScore, idx) => {
              const h = Math.max((dayScore.finalScore / 100) * 80, 4);
              const color = scoreColor(dayScore.finalScore);
              return (
                <View key={idx} style={styles.barChartItem}>
                  <Text style={styles.barChartScore}>{dayScore.finalScore}</Text>
                  <View style={[styles.barChartBar, { height: h, backgroundColor: color }]} />
                  <Text style={styles.barChartDate}>
                    {dayScore.date.slice(8)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Score history list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          <View style={styles.historyList}>
            {scores.map((dayScore, idx) => (
              <View key={idx} style={styles.historyRow}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyDate}>{formatHistoryDate(dayScore.date)}</Text>
                  <Text style={styles.historyStreak}>🔥 Day {dayScore.streakDay}</Text>
                </View>
                <View style={styles.historyScores}>
                  <View style={styles.historyMini}>
                    <Text style={styles.historyMiniLabel}>✨</Text>
                    <Text style={styles.historyMiniVal}>{dayScore.auraScore}</Text>
                  </View>
                  <View style={styles.historyMini}>
                    <Text style={styles.historyMiniLabel}>🔒</Text>
                    <Text style={styles.historyMiniVal}>{dayScore.disciplineScore}</Text>
                  </View>
                </View>
                <Text style={[styles.historyFinal, { color: scoreColor(dayScore.finalScore) }]}>
                  {dayScore.finalScore}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LockedProgress({
  onUpgrade,
  avgScore,
  sampleScores,
}: {
  onUpgrade: () => void;
  avgScore: number;
  sampleScores: Array<{ finalScore: number; date: string }>;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: SPACING.xl }]}>
        <Text style={styles.pageTitle}>Progress</Text>

        {/* Blurred preview */}
        <View style={styles.lockedPreview}>
          <View style={styles.lockedBars}>
            {[72, 45, 88, 61, 79, 54, 83].map((h, idx) => (
              <View
                key={idx}
                style={[
                  styles.lockedBar,
                  { height: Math.max((h / 100) * 80, 4), opacity: 0.3 },
                ]}
              />
            ))}
          </View>
          <View style={styles.lockOverlay}>
            <Text style={styles.lockEmoji}>🔒</Text>
            <Text style={styles.lockTitle}>Unlock Progress Tracking</Text>
            <Text style={styles.lockSubtitle}>
              See your score history, trends, and 30-day charts with Core.
            </Text>
            <Button
              label="Upgrade to Core — $9.99/mo"
              onPress={onUpgrade}
              size="md"
              style={{ marginTop: SPACING.base }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatHistoryDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['2xl'],
    gap: SPACING.base,
  },
  pageTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: '800',
    color: COLORS.text,
    paddingTop: SPACING.base,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  section: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
    height: 120,
  },
  barChartItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
  },
  barChartScore: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  barChartBar: {
    width: '100%',
    borderRadius: 2,
    minHeight: 4,
  },
  barChartDate: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  historyList: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  historyLeft: {
    flex: 1,
    gap: 3,
  },
  historyDate: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  historyStreak: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  historyScores: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  historyMini: {
    alignItems: 'center',
    gap: 2,
  },
  historyMiniLabel: {
    fontSize: 12,
  },
  historyMiniVal: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  historyFinal: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    minWidth: 36,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.base * 1.6,
  },
  lockedPreview: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  lockedBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.base,
    gap: 6,
    height: 120,
  },
  lockedBar: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  lockOverlay: {
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  lockEmoji: { fontSize: 32 },
  lockTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  lockSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.sm * 1.6,
  },
});
