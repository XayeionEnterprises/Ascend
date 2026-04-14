import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { markOnboarded } from '../lib/storage';
import { COLORS, FONT_SIZE, RADIUS, SPACING } from '../lib/constants';
import Button from '../components/ui/Button';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '⚡',
    title: 'Level Up Daily',
    subtitle: 'Track your Aura & Discipline score every day. Watch yourself transform.',
    gradient: ['#7C3AED', '#3B82F6'] as const,
  },
  {
    id: '2',
    emoji: '🔥',
    title: 'Build Unbreakable Streaks',
    subtitle: 'Consistency is the cheat code. Log in daily, earn XP, climb the ranks.',
    gradient: ['#F59E0B', '#EF4444'] as const,
  },
  {
    id: '3',
    emoji: '📊',
    title: 'See What's Holding You Back',
    subtitle: 'Gym, diet, sleep, focus, mindset — see exactly where to improve.',
    gradient: ['#10B981', '#3B82F6'] as const,
  },
  {
    id: '4',
    emoji: '👑',
    title: 'Share Your Ascent',
    subtitle: 'Generate a viral score card. Show the world you're built different.',
    gradient: ['#9F67FF', '#F59E0B'] as const,
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const handleViewableChange = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  async function handleFinish() {
    await markOnboarded();
    router.replace('/(auth)/welcome');
  }

  function handleNext() {
    if (activeIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      handleFinish();
    }
  }

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableChange}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Big emoji with gradient background circle */}
            <View style={styles.emojiWrapper}>
              <LinearGradient
                colors={item.gradient}
                style={styles.emojiCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
              </LinearGradient>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              idx === activeIndex ? styles.dotActive : null,
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <Button
          label={isLast ? 'Get Started' : 'Next'}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
        {!isLast && (
          <TouchableOpacity onPress={handleFinish} style={styles.skip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingTop: SPACING['3xl'],
  },
  emojiWrapper: {
    marginBottom: SPACING['2xl'],
  },
  emojiCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  emoji: {
    fontSize: 60,
  },
  title: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.base,
    lineHeight: FONT_SIZE['2xl'] * 1.2,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.md * 1.6,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface3,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['2xl'],
    gap: SPACING.md,
  },
  skip: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
  },
  skipText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textMuted,
  },
});
