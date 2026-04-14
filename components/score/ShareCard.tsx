import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, RADIUS, SPACING, getRank } from '../../lib/constants';
import { scoreColor, getScoreLabel } from '../../lib/scoring';
import type { DayScore } from '../../lib/types';

interface ShareCardProps {
  score: DayScore;
  userName: string;
  userPhoto?: string | null;
  xp: number;
}

export default function ShareCard({ score, userName, userPhoto, xp }: ShareCardProps) {
  const rank = getRank(xp);
  const color = scoreColor(score.finalScore);

  return (
    <LinearGradient
      colors={['#0A0A0B', '#1C1C1F']}
      style={styles.card}
    >
      {/* Top accent line */}
      <LinearGradient
        colors={COLORS.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topLine}
      />

      {/* Header */}
      <View style={styles.header}>
        {userPhoto ? (
          <Image source={{ uri: userPhoto }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>{userName[0]?.toUpperCase() ?? 'A'}</Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.username}>{userName}</Text>
          <Text style={styles.rankLabel}>{rank.emoji} {rank.name}</Text>
        </View>
        <Text style={styles.appName}>ASCEND</Text>
      </View>

      {/* Score */}
      <View style={styles.scoreSection}>
        <Text style={[styles.bigScore, { color }]}>{score.finalScore}</Text>
        <Text style={styles.scoreLabel}>{getScoreLabel(score.finalScore)}</Text>
        <Text style={styles.scoreSubLabel}>AURA + DISCIPLINE SCORE</Text>
      </View>

      {/* Mini breakdown */}
      <View style={styles.breakdown}>
        {[
          { emoji: '💪', val: Math.round(score.answers.gym * 5) },
          { emoji: '🥗', val: Math.round(score.answers.diet * 5) },
          { emoji: '😴', val: Math.round(score.answers.sleep * 5) },
          { emoji: '🧠', val: Math.round(score.answers.work * 5) },
          { emoji: '⚡', val: Math.round(score.answers.confidence * 5) },
        ].map(({ emoji, val }, idx) => (
          <View key={idx} style={styles.breakdownItem}>
            <Text style={styles.breakdownEmoji}>{emoji}</Text>
            <Text style={styles.breakdownVal}>{val}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerDate}>{score.date}</Text>
        <Text style={styles.footerTag}>#Ascend #AuraScore</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 320,
    borderRadius: RADIUS['2xl'],
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topLine: {
    height: 3,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
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
  headerText: {
    flex: 1,
  },
  username: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  rankLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
  },
  appName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  bigScore: {
    fontSize: 80,
    fontWeight: '900',
    lineHeight: 80,
    letterSpacing: -4,
  },
  scoreLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  scoreSubLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginTop: 4,
  },
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.base,
  },
  breakdownItem: {
    alignItems: 'center',
    gap: 4,
  },
  breakdownEmoji: {
    fontSize: 18,
  },
  breakdownVal: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.base,
  },
  footerDate: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  footerTag: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
