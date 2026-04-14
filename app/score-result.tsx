import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../store/useUserStore';
import { useScoreStore } from '../store/useScoreStore';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  getRank,
} from '../lib/constants';
import {
  scoreColor,
  getScoreLabel,
  getImprovementTip,
  computeScoreBreakdown,
} from '../lib/scoring';
import ScoreRing from '../components/ui/ScoreRing';
import ScoreBreakdown from '../components/score/ScoreBreakdown';
import StreakBadge from '../components/ui/StreakBadge';
import RankBadge from '../components/ui/RankBadge';
import Button from '../components/ui/Button';

export default function ScoreResultScreen() {
  const profile = useUserStore((s) => s.profile);
  const { latestScore } = useScoreStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
      }),
    ]).start();
  }, []);

  if (!latestScore) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No score yet. Complete your check-in first.</Text>
          <Button
            label="Go to Check-In"
            onPress={() => {
              router.back();
              router.push('/(tabs)/checkin');
            }}
            size="md"
            style={{ marginTop: SPACING.base }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const score = latestScore.finalScore;
  const color = scoreColor(score);
  const label = getScoreLabel(score);
  const xp = profile?.xp ?? 0;
  const rank = getRank(xp);

  const breakdown = computeScoreBreakdown(latestScore.answers);
  const tip = getImprovementTip(breakdown);
  const isPaid = profile?.subscription === 'core' || profile?.subscription === 'pro';
  const isPro = profile?.subscription === 'pro';

  async function handleShare() {
    try {
      await Share.share({
        message: `🔥 My Ascend Score today: ${score}/100 (${label})\n⚡ Aura: ${latestScore.auraScore} | 🔒 Discipline: ${latestScore.disciplineScore}\n🔥 ${latestScore.streakDay}-day streak\n\nDownload Ascend — track your aura daily.`,
        title: 'My Ascend Score',
      });
    } catch {
      Alert.alert('Could not share', 'Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Close button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Today's Score</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Score hero */}
        <Animated.View
          style={[
            styles.heroSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* XP earned badge */}
          <View style={styles.xpBadge}>
            <LinearGradient
              colors={COLORS.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.xpBadgeGrad}
            >
              <Text style={styles.xpBadgeText}>+{latestScore.xpEarned} XP earned</Text>
            </LinearGradient>
          </View>

          <ScoreRing
            score={score}
            size={200}
            strokeWidth={16}
            label="Final Score"
            sublabel={label}
            color={color}
          />

          {/* Streak + Rank */}
          <View style={styles.badgeRow}>
            <StreakBadge days={latestScore.streakDay} />
            <RankBadge xp={xp} />
          </View>
        </Animated.View>

        {/* Score breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Breakdown</Text>
          <ScoreBreakdown breakdown={breakdown} locked={!isPaid} />
        </View>

        {/* Improvement tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipEmoji}>🎯</Text>
            <Text style={styles.tipTitle}>Today's Focus: {tip.category}</Text>
          </View>
          <Text style={styles.tipText}>{tip.tip}</Text>
        </View>

        {/* Pro insights (locked) */}
        {!isPro && (
          <TouchableOpacity
            onPress={() => router.push('/paywall')}
            style={styles.proTeaser}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#7C3AED', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.proTeaserGrad}
            >
              <View style={styles.proTeaserContent}>
                <Text style={styles.proTeaserEmoji}>👑</Text>
                <View style={styles.proTeaserText}>
                  <Text style={styles.proTeaserTitle}>Unlock Pro Insights</Text>
                  <Text style={styles.proTeaserSub}>
                    Personalized plan, weekly reports & leaderboards
                  </Text>
                </View>
                <Text style={styles.proTeaserArrow}>→</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Share CTA */}
        <Button
          label="Share Your Score"
          onPress={handleShare}
          fullWidth
          size="lg"
        />

        <Button
          label="Back to Home"
          onPress={() => router.replace('/(tabs)')}
          variant="ghost"
          fullWidth
          size="md"
          textStyle={{ color: COLORS.textSecondary }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
  },
  topTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  shareBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.full,
  },
  shareText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['3xl'],
    gap: SPACING.base,
    paddingTop: SPACING.base,
  },
  heroSection: {
    alignItems: 'center',
    gap: SPACING.base,
    paddingVertical: SPACING.base,
  },
  xpBadge: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  xpBadgeGrad: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  xpBadgeText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: '#FFF',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  section: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  tipCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tipEmoji: { fontSize: 20 },
  tipTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.sm * 1.6,
  },
  proTeaser: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  proTeaserGrad: {
    borderRadius: RADIUS.xl,
  },
  proTeaserContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    gap: SPACING.md,
  },
  proTeaserEmoji: { fontSize: 24 },
  proTeaserText: { flex: 1 },
  proTeaserTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: '#FFF',
  },
  proTeaserSub: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255,255,255,0.75)',
  },
  proTeaserArrow: {
    fontSize: FONT_SIZE.lg,
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
