import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../../lib/constants';
import Button from '../../components/ui/Button';

/**
 * Login screen — MVP uses local-only profiles so this just
 * redirects back to signup. In a full build, wire up Supabase auth here.
 */
export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.emoji}>🔐</Text>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Cloud sync and multi-device support coming soon. For now, your progress is saved locally on this device.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Already using Ascend on this device?</Text>
          <Text style={styles.cardText}>
            Your profile and scores are already loaded automatically.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Continue to App"
          onPress={() => router.replace('/(tabs)')}
          fullWidth
          size="lg"
        />
        <Button
          label="Create New Profile"
          onPress={() => router.replace('/(auth)/signup')}
          variant="outline"
          fullWidth
          size="md"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  back: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
  },
  backText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING['2xl'],
    gap: SPACING.xl,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.base * 1.6,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.sm * 1.5,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['2xl'],
    gap: SPACING.sm,
  },
});
