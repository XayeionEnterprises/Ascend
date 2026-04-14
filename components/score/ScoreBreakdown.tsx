import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../lib/constants';
import { scoreColor } from '../../lib/scoring';
import type { ScoreBreakdown as ScoreBreakdownType } from '../../lib/types';

interface Props {
  breakdown: ScoreBreakdownType;
  locked?: boolean; // true for free tier
}

const CATEGORIES = [
  { key: 'gym' as const, label: 'Exercise', emoji: '💪' },
  { key: 'diet' as const, label: 'Diet', emoji: '🥗' },
  { key: 'sleep' as const, label: 'Sleep', emoji: '😴' },
  { key: 'work' as const, label: 'Productivity', emoji: '🧠' },
  { key: 'confidence' as const, label: 'Mindset', emoji: '⚡' },
];

export default function ScoreBreakdown({ breakdown, locked = false }: Props) {
  return (
    <View style={styles.container}>
      {/* Header row: Aura vs Discipline */}
      <View style={styles.headerRow}>
        <View style={styles.headerCard}>
          <Text style={styles.headerEmoji}>✨</Text>
          <Text style={[styles.headerScore, { color: scoreColor(breakdown.aura) }]}>
            {breakdown.aura}
          </Text>
          <Text style={styles.headerLabel}>Aura</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.headerCard}>
          <Text style={styles.headerEmoji}>🔒</Text>
          <Text style={[styles.headerScore, { color: scoreColor(breakdown.discipline) }]}>
            {breakdown.discipline}
          </Text>
          <Text style={styles.headerLabel}>Discipline</Text>
        </View>
      </View>

      {/* Per-category bars */}
      <View style={styles.bars}>
        {CATEGORIES.map(({ key, label, emoji }) => {
          const score = breakdown[key];
          const color = scoreColor(score);
          return (
            <View key={key} style={styles.barRow}>
              <Text style={styles.barEmoji}>{emoji}</Text>
              <View style={styles.barInfo}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barLabel}>{label}</Text>
                  <Text style={[styles.barScore, { color }]}>
                    {locked ? '—' : score}
                  </Text>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: locked ? '0%' : `${score}%`,
                        backgroundColor: color,
                        opacity: locked ? 0 : 1,
                      },
                    ]}
                  />
                  {locked && <View style={styles.lockedOverlay} />}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {locked && (
        <View style={styles.lockBanner}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockText}>Upgrade to Core to unlock full breakdown</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.base,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  headerCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.base,
    gap: 2,
  },
  headerEmoji: {
    fontSize: 20,
  },
  headerScore: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: '800',
  },
  headerLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  bars: {
    gap: SPACING.md,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  barEmoji: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  barInfo: {
    flex: 1,
    gap: 6,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  barScore: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
  barTrack: {
    height: 6,
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.surface3,
  },
  lockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  lockIcon: {
    fontSize: 16,
  },
  lockText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
});
