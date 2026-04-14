import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../../lib/constants';
import Button from '../../components/ui/Button';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      {/* Background gradient orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoArea}>
          <LinearGradient
            colors={COLORS.gradientPrimary}
            style={styles.logoCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoEmoji}>⚡</Text>
          </LinearGradient>
          <Text style={styles.appName}>ASCEND</Text>
          <Text style={styles.tagline}>Your daily score. Your daily grind.</Text>
        </View>

        {/* Feature pills */}
        <View style={styles.pills}>
          {[
            { icon: '📊', text: 'Aura + Discipline Score' },
            { icon: '🔥', text: 'Daily Streaks & XP' },
            { icon: '👑', text: 'Rank Up to Elite' },
            { icon: '📱', text: 'Shareable Score Cards' },
          ].map((pill, idx) => (
            <View key={idx} style={styles.pill}>
              <Text style={styles.pillIcon}>{pill.icon}</Text>
              <Text style={styles.pillText}>{pill.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Button
          label="Create Account"
          onPress={() => router.push('/(auth)/signup')}
          fullWidth
          size="lg"
        />
        <Button
          label="I already have an account"
          onPress={() => router.push('/(auth)/login')}
          variant="ghost"
          fullWidth
          size="md"
          textStyle={{ color: COLORS.textSecondary }}
        />
        <Text style={styles.terms}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  orb1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primary,
    opacity: 0.08,
  },
  orb2: {
    position: 'absolute',
    bottom: 100,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: COLORS.accent,
    opacity: 0.06,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING['2xl'],
  },
  logoArea: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: SPACING.sm,
  },
  logoEmoji: {
    fontSize: 44,
  },
  appName: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 6,
  },
  tagline: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  pills: {
    gap: SPACING.sm,
    width: '100%',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  pillIcon: {
    fontSize: 20,
  },
  pillText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['2xl'],
    gap: SPACING.sm,
    alignItems: 'center',
  },
  terms: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingTop: SPACING.xs,
  },
});
