import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../../store/useUserStore';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  RADIUS,
  getRank,
  getRankProgress,
  getNextRank,
  SUBSCRIPTION_FEATURES,
} from '../../lib/constants';
import RankBadge from '../../components/ui/RankBadge';
import StreakBadge from '../../components/ui/StreakBadge';
import Button from '../../components/ui/Button';

export default function ProfileScreen() {
  const { profile, updatePhoto, reset } = useUserStore();
  const xp = profile?.xp ?? 0;
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const rankProgress = getRankProgress(xp);

  async function handleChangePhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      await updatePhoto(result.assets[0].uri);
    }
  }

  function handleResetAccount() {
    Alert.alert(
      'Reset Account',
      'This will delete all your scores and progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await reset();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  }

  const subTier = profile?.subscription ?? 'free';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handleChangePhoto} style={styles.avatarWrapper}>
            {profile?.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarInitial}>
                  {profile?.name?.[0]?.toUpperCase() ?? 'A'}
                </Text>
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{profile?.name ?? 'Anonymous'}</Text>
          <View style={styles.badgeRow}>
            <StreakBadge days={profile?.streakDays ?? 0} />
            <RankBadge xp={xp} showXP />
          </View>
        </View>

        {/* Rank Progress */}
        <View style={styles.rankCard}>
          <View style={styles.rankHeader}>
            <Text style={styles.rankTitle}>{rank.emoji} {rank.name} Rank</Text>
            {nextRank && (
              <Text style={styles.rankNext}>
                {(nextRank.minXP - xp).toLocaleString()} XP → {nextRank.name}
              </Text>
            )}
          </View>
          <View style={styles.rankTrack}>
            <View
              style={[
                styles.rankFill,
                {
                  width: `${rankProgress * 100}%`,
                  backgroundColor: rank.color,
                },
              ]}
            />
          </View>
          <View style={styles.rankStats}>
            <StatChip label="Total XP" value={xp.toLocaleString()} />
            <StatChip label="Check-ins" value={String(profile?.totalCheckins ?? 0)} />
            <StatChip label="Best Streak" value={`${profile?.streakDays ?? 0}🔥`} />
          </View>
        </View>

        {/* Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <View style={styles.subCard}>
            <View style={styles.subHeader}>
              <View>
                <Text style={styles.subTier}>{subTier.charAt(0).toUpperCase() + subTier.slice(1)} Plan</Text>
                <Text style={styles.subPrice}>
                  {subTier === 'free' ? 'Free' : subTier === 'core' ? '$9.99/month' : '$19.99/month'}
                </Text>
              </View>
              {subTier === 'free' && (
                <Button
                  label="Upgrade"
                  onPress={() => router.push('/paywall')}
                  size="sm"
                />
              )}
            </View>
            <View style={styles.featureList}>
              {SUBSCRIPTION_FEATURES[subTier].map((feat, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsList}>
            <SettingRow emoji="🔔" label="Daily Reminders" hasSwitch defaultValue />
            <SettingRow emoji="🌙" label="Dark Mode" hasSwitch defaultValue disabled />
            <SettingRow
              emoji="📤"
              label="Share Profile"
              onPress={() => Alert.alert('Coming soon', 'Profile sharing coming soon!')}
            />
            <SettingRow
              emoji="⭐"
              label="Rate Ascend"
              onPress={() => Alert.alert('Thank you!', 'Rating support coming soon.')}
            />
            <SettingRow
              emoji="💌"
              label="Contact Support"
              onPress={() => Alert.alert('Support', 'Email us at support@ascendapp.io')}
            />
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.section}>
          <Button
            label="Reset Account"
            onPress={handleResetAccount}
            variant="outline"
            fullWidth
            textStyle={{ color: COLORS.danger }}
            style={{ borderColor: COLORS.danger }}
          />
          <Text style={styles.version}>Ascend v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statChipValue}>{value}</Text>
      <Text style={styles.statChipLabel}>{label}</Text>
    </View>
  );
}

function SettingRow({
  emoji,
  label,
  hasSwitch,
  defaultValue,
  onPress,
  disabled,
}: {
  emoji: string;
  label: string;
  hasSwitch?: boolean;
  defaultValue?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? false);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={hasSwitch || disabled}
      style={styles.settingRow}
      activeOpacity={0.7}
    >
      <Text style={styles.settingEmoji}>{emoji}</Text>
      <Text style={styles.settingLabel}>{label}</Text>
      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={setValue}
          trackColor={{ false: COLORS.surface3, true: COLORS.primary }}
          thumbColor="#FFF"
          disabled={disabled}
        />
      ) : (
        <Text style={styles.settingArrow}>→</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['3xl'],
    gap: SPACING.base,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
    gap: SPACING.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.full,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarFallback: {
    backgroundColor: COLORS.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  editBadgeText: { fontSize: 12 },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  rankCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  rankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rankTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  rankNext: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  rankTrack: {
    height: 8,
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  rankFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  rankStats: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statChip: {
    flex: 1,
    backgroundColor: COLORS.surface2,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    gap: 2,
  },
  statChipValue: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  statChipLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
  },
  section: {
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  subCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  subTier: {
    fontSize: FONT_SIZE.base,
    fontWeight: '700',
    color: COLORS.text,
  },
  subPrice: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  featureList: {
    padding: SPACING.base,
    gap: SPACING.sm,
  },
  featureRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  featureCheck: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
    fontWeight: '700',
    marginTop: 1,
  },
  featureText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  settingsList: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  settingEmoji: { fontSize: 18 },
  settingLabel: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textMuted,
  },
  version: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingTop: SPACING.sm,
  },
});
