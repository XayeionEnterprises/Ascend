import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../lib/constants';
import { getRank } from '../../lib/constants';

interface RankBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  showXP?: boolean;
}

export default function RankBadge({ xp, size = 'md', style, showXP = false }: RankBadgeProps) {
  const rank = getRank(xp);

  const paddings: Record<string, { h: number; v: number }> = {
    sm: { h: SPACING.sm, v: 3 },
    md: { h: SPACING.md, v: SPACING.xs },
    lg: { h: SPACING.base, v: SPACING.sm },
  };

  const fontSizes: Record<string, number> = {
    sm: FONT_SIZE.xs,
    md: FONT_SIZE.sm,
    lg: FONT_SIZE.base,
  };

  return (
    <LinearGradient
      colors={rank.gradient}
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
      <Text style={{ fontSize: fontSizes[size] + 2 }}>{rank.emoji}</Text>
      <Text style={[styles.name, { fontSize: fontSizes[size] }]}>{rank.name}</Text>
      {showXP && (
        <Text style={[styles.xp, { fontSize: fontSizes[size] - 1 }]}>{xp.toLocaleString()} XP</Text>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    color: '#FFF',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  xp: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginLeft: 2,
  },
});
