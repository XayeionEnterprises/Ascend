import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../lib/constants';

interface StreakBadgeProps {
  days: number;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  showLabel?: boolean;
}

export default function StreakBadge({ days, size = 'md', style, showLabel = true }: StreakBadgeProps) {
  const isActive = days > 0;
  const isHot = days >= 7;

  const paddings: Record<string, { h: number; v: number }> = {
    sm: { h: SPACING.sm, v: SPACING.xs },
    md: { h: SPACING.md, v: SPACING.sm },
    lg: { h: SPACING.base, v: SPACING.md },
  };

  const fontSizes: Record<string, number> = {
    sm: FONT_SIZE.xs,
    md: FONT_SIZE.sm,
    lg: FONT_SIZE.base,
  };

  const colors: readonly [string, string] = isHot
    ? (['#F59E0B', '#EF4444'] as const)
    : isActive
    ? (['#F97316', '#F59E0B'] as const)
    : (['#2C2C30', '#1C1C1F'] as const);

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        styles.badge,
        {
          paddingHorizontal: paddings[size].h,
          paddingVertical: paddings[size].v,
          borderRadius: RADIUS.full,
        },
        style,
      ]}
    >
      <Text style={[styles.flame, { fontSize: fontSizes[size] + 2 }]}>
        {isHot ? '🔥' : isActive ? '⚡' : '💤'}
      </Text>
      <Text
        style={[
          styles.text,
          {
            fontSize: fontSizes[size],
            color: isActive ? '#FFF' : COLORS.textMuted,
          },
        ]}
      >
        {days}
        {showLabel && <Text style={styles.label}> day{days !== 1 ? 's' : ''}</Text>}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flame: {},
  text: {
    fontWeight: '700',
  },
  label: {
    fontWeight: '500',
  },
});
