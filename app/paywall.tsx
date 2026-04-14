import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../store/useUserStore';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  SUBSCRIPTION_FEATURES,
} from '../lib/constants';
import Button from '../components/ui/Button';

type Plan = 'core' | 'pro';

export default function PaywallScreen() {
  const [selected, setSelected] = useState<Plan>('pro');
  const [loading, setLoading] = useState(false);
  const { setSubscription } = useUserStore();

  async function handlePurchase() {
    setLoading(true);
    // In production: integrate RevenueCat or Stripe here
    await new Promise((r) => setTimeout(r, 1000));
    Alert.alert(
      'Coming Soon',
      'Payment integration is coming soon. You\'ve been upgraded to ' + selected + ' for free while in beta!',
      [
        {
          text: 'Let\'s Go!',
          onPress: async () => {
            await setSubscription(selected);
            router.back();
          },
        },
      ]
    );
    setLoading(false);
  }

  async function handleOneTime() {
    Alert.alert(
      'Single Report — $2.99',
      'Unlock full score analysis for today\'s report. Coming soon!',
      [{ text: 'OK' }]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Close */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>Upgrade Ascend</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>👑</Text>
          <Text style={styles.heroTitle}>Unlock Your Full Potential</Text>
          <Text style={styles.heroSubtitle}>
            Go deeper, track further, and rise through the ranks faster.
          </Text>
        </View>

        {/* Plan cards */}
        <View style={styles.plans}>
          <PlanCard
            id="core"
            name="Core"
            price="$9.99"
            period="/ month"
            tagline="Build the habit"
            features={SUBSCRIPTION_FEATURES.core}
            selected={selected === 'core'}
            onSelect={() => setSelected('core')}
            gradient={['#1C1C1F', '#2A2A2F']}
            accentColor={COLORS.accent}
          />

          <PlanCard
            id="pro"
            name="Pro"
            price="$19.99"
            period="/ month"
            tagline="For serious growth"
            features={SUBSCRIPTION_FEATURES.pro}
            selected={selected === 'pro'}
            onSelect={() => setSelected('pro')}
            gradient={['#3B1E7A', '#1E3A6E']}
            accentColor={COLORS.primary}
            badge="Most Popular"
          />
        </View>

        {/* CTA */}
        <Button
          label={`Get ${selected.charAt(0).toUpperCase() + selected.slice(1)} — ${selected === 'core' ? '$9.99' : '$19.99'}/mo`}
          onPress={handlePurchase}
          loading={loading}
          fullWidth
          size="lg"
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* One-time purchase */}
        <TouchableOpacity onPress={handleOneTime} style={styles.oneTimeCard} activeOpacity={0.8}>
          <View style={styles.oneTimeLeft}>
            <Text style={styles.oneTimeEmoji}>📊</Text>
            <View>
              <Text style={styles.oneTimeTitle}>Single Score Report</Text>
              <Text style={styles.oneTimeSub}>Full breakdown for today only</Text>
            </View>
          </View>
          <Text style={styles.oneTimePrice}>$2.99</Text>
        </TouchableOpacity>

        {/* Trust signals */}
        <View style={styles.trustRow}>
          {['🔒 Secure', '↩️ Cancel anytime', '🚀 Instant access'].map((t, idx) => (
            <Text key={idx} style={styles.trustItem}>{t}</Text>
          ))}
        </View>

        <Text style={styles.legal}>
          Subscriptions auto-renew monthly. Cancel anytime in your device settings.
          Prices shown in USD.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanCard({
  id,
  name,
  price,
  period,
  tagline,
  features,
  selected,
  onSelect,
  gradient,
  accentColor,
  badge,
}: {
  id: Plan;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  selected: boolean;
  onSelect: () => void;
  gradient: [string, string];
  accentColor: string;
  badge?: string;
}) {
  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.85} style={styles.planCardWrapper}>
      <LinearGradient
        colors={selected ? [accentColor + '40', accentColor + '20'] : gradient}
        style={[
          styles.planCard,
          selected && { borderColor: accentColor },
        ]}
      >
        {badge && (
          <View style={[styles.planBadge, { backgroundColor: accentColor }]}>
            <Text style={styles.planBadgeText}>{badge}</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <View>
            <Text style={styles.planName}>{name}</Text>
            <Text style={styles.planTagline}>{tagline}</Text>
          </View>
          <View style={styles.planPriceWrapper}>
            <Text style={[styles.planPrice, { color: selected ? accentColor : COLORS.text }]}>
              {price}
            </Text>
            <Text style={styles.planPeriod}>{period}</Text>
          </View>
        </View>

        <View style={styles.planFeatures}>
          {features.slice(0, 4).map((feat, idx) => (
            <View key={idx} style={styles.planFeatureRow}>
              <Text style={[styles.planFeatureCheck, { color: accentColor }]}>✓</Text>
              <Text style={styles.planFeatureText}>{feat}</Text>
            </View>
          ))}
          {features.length > 4 && (
            <Text style={styles.planMoreFeatures}>+{features.length - 4} more features</Text>
          )}
        </View>

        {/* Radio indicator */}
        <View style={styles.planSelector}>
          <View
            style={[
              styles.planRadio,
              selected && { borderColor: accentColor },
            ]}
          >
            {selected && (
              <View style={[styles.planRadioFill, { backgroundColor: accentColor }]} />
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
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
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['3xl'],
    gap: SPACING.base,
    paddingTop: SPACING.xl,
  },
  hero: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  heroEmoji: { fontSize: 48 },
  heroTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.base * 1.5,
  },
  plans: {
    gap: SPACING.sm,
  },
  planCardWrapper: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  planCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    position: 'relative',
  },
  planBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  planBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: '#FFF',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  planName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  planTagline: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  planPriceWrapper: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: '900',
  },
  planPeriod: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  planFeatures: {
    gap: SPACING.xs,
  },
  planFeatureRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  planFeatureCheck: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginTop: 1,
  },
  planFeatureText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  planMoreFeatures: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  planSelector: {
    alignSelf: 'flex-end',
  },
  planRadio: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioFill: {
    width: 10,
    height: 10,
    borderRadius: RADIUS.full,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  oneTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  oneTimeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  oneTimeEmoji: { fontSize: 24 },
  oneTimeTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  oneTimeSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  oneTimePrice: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trustItem: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  legal: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
