import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../../lib/constants';
import type { CheckinQuestion } from '../../lib/constants';

interface QuestionCardProps {
  question: CheckinQuestion;
  selectedScore: number | undefined;
  onSelect: (score: number) => void;
}

export default function QuestionCard({ question, selectedScore, onSelect }: QuestionCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{question.emoji}</Text>
      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.options}>
        {question.options.map((option, idx) => {
          const score = question.scores[idx];
          const isSelected = selectedScore === score;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => onSelect(score)}
              activeOpacity={0.75}
              style={[
                styles.option,
                isSelected && styles.optionSelected,
              ]}
            >
              <View style={[styles.dot, isSelected && styles.dotSelected]}>
                {isSelected && <View style={styles.dotInner} />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
              {/* Level indicator dots */}
              <View style={styles.levelDots}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.levelDot,
                      i <= idx ? styles.levelDotActive : null,
                    ]}
                  />
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.base,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: SPACING.base,
  },
  question: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
    lineHeight: FONT_SIZE.xl * 1.3,
  },
  options: {
    gap: SPACING.sm,
  },
  option: {
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
  optionSelected: {
    backgroundColor: COLORS.primaryDim,
    borderColor: COLORS.primary,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotSelected: {
    borderColor: COLORS.primary,
  },
  dotInner: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  optionText: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },
  levelDots: {
    flexDirection: 'row',
    gap: 3,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  levelDotActive: {
    backgroundColor: COLORS.primary,
  },
});
