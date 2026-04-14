import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../../lib/constants';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  innerStyle?: ViewStyle;
  /** Show a gradient border. Pass gradient colors or use default primary. */
  borderColors?: readonly [string, string, ...string[]];
  borderWidth?: number;
  noPadding?: boolean;
}

export default function GradientCard({
  children,
  style,
  innerStyle,
  borderColors,
  borderWidth = 1,
  noPadding = false,
}: GradientCardProps) {
  const colors = borderColors ?? ([COLORS.border, COLORS.borderLight] as const);

  return (
    <View style={[styles.wrapper, style]}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { borderRadius: RADIUS.xl + borderWidth }]}
      >
        <View
          style={[
            styles.inner,
            { borderRadius: RADIUS.xl, padding: noPadding ? 0 : SPACING.base },
            innerStyle,
          ]}
        >
          {children}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: RADIUS.xl,
  },
  gradient: {
    padding: 1,
  },
  inner: {
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
});
