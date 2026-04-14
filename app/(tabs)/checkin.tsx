import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useCheckinStore } from '../../store/useCheckinStore';
import { useScoreStore } from '../../store/useScoreStore';
import { useUserStore } from '../../store/useUserStore';
import { CHECKIN_QUESTIONS, COLORS, FONT_SIZE, SPACING, RADIUS } from '../../lib/constants';
import { computeScoreBreakdown, calcXP, todayString, computeStreak, isToday } from '../../lib/scoring';
import type { DayScore, CheckinAnswers } from '../../lib/types';
import QuestionCard from '../../components/checkin/QuestionCard';
import CheckinProgressBar from '../../components/checkin/CheckinProgressBar';
import Button from '../../components/ui/Button';

const TOTAL_STEPS = CHECKIN_QUESTIONS.length + 1; // questions + photo step

export default function CheckinScreen() {
  const { currentStep, answers, photoUri, setAnswer, setPhoto, nextStep, prevStep, reset, getAnswerForStep } =
    useCheckinStore();
  const { addScore } = useScoreStore();
  const { profile, addXP, updateStreak, markCheckin } = useUserStore();
  const [submitting, setSubmitting] = useState(false);

  const alreadyCheckedIn = isToday(profile?.lastCheckinDate ?? null);

  async function handlePickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function handleCameraPhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Camera access is required for your Aura photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    try {
      const checkinAnswers: CheckinAnswers = {
        gym: answers['gym'] ?? 0,
        diet: answers['diet'] ?? 0,
        sleep: answers['sleep'] ?? 0,
        work: answers['work'] ?? 0,
        confidence: answers['confidence'] ?? 0,
        photoUri: photoUri,
      };

      const breakdown = computeScoreBreakdown(checkinAnswers);
      const newStreak = computeStreak(profile?.lastCheckinDate ?? null, profile?.streakDays ?? 0);
      const xpEarned = calcXP(breakdown.final, newStreak);

      const dayScore: DayScore = {
        date: todayString(),
        auraScore: breakdown.aura,
        disciplineScore: breakdown.discipline,
        finalScore: breakdown.final,
        xpEarned,
        answers: checkinAnswers,
        streakDay: newStreak,
      };

      await addScore(dayScore);
      await addXP(xpEarned);
      await updateStreak(newStreak);
      await markCheckin();

      reset();
      router.push('/score-result');
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadyCheckedIn) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.doneContainer}>
          <Text style={styles.doneEmoji}>✅</Text>
          <Text style={styles.doneTitle}>Already checked in today!</Text>
          <Text style={styles.doneSubtitle}>
            Come back tomorrow to keep your streak going.
          </Text>
          <Button
            label="View Today's Score"
            onPress={() => router.push('/score-result')}
            size="md"
            style={{ marginTop: SPACING.base }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const isPhotoStep = currentStep === CHECKIN_QUESTIONS.length;
  const currentQuestion = CHECKIN_QUESTIONS[currentStep];
  const selectedScore = getAnswerForStep(currentStep);
  const canProceed = isPhotoStep || selectedScore !== undefined;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          {currentStep > 0 ? (
            <TouchableOpacity onPress={prevStep} style={styles.backBtn}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}
          <Text style={styles.stepIndicator}>
            {currentStep + 1} / {TOTAL_STEPS}
          </Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressWrapper}>
          <CheckinProgressBar current={currentStep} total={TOTAL_STEPS} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isPhotoStep ? (
            <PhotoStep photoUri={photoUri} onPick={handlePickPhoto} onCamera={handleCameraPhoto} />
          ) : (
            <QuestionCard
              question={currentQuestion}
              selectedScore={selectedScore}
              onSelect={(score) => setAnswer(currentQuestion.id, score)}
            />
          )}
        </ScrollView>

        {/* Footer CTA */}
        <View style={styles.footer}>
          {isPhotoStep ? (
            <Button
              label="Calculate My Score"
              onPress={handleSubmit}
              loading={submitting}
              fullWidth
              size="lg"
            />
          ) : (
            <Button
              label="Next"
              onPress={nextStep}
              disabled={!canProceed}
              fullWidth
              size="lg"
            />
          )}
          {isPhotoStep && (
            <TouchableOpacity onPress={handleSubmit} style={styles.skipPhoto}>
              <Text style={styles.skipPhotoText}>Skip photo — score without Aura boost</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PhotoStep({
  photoUri,
  onPick,
  onCamera,
}: {
  photoUri: string | null;
  onPick: () => void;
  onCamera: () => void;
}) {
  return (
    <View style={styles.photoStep}>
      <Text style={styles.photoEmoji}>📸</Text>
      <Text style={styles.photoTitle}>Add your Aura photo</Text>
      <Text style={styles.photoSubtitle}>
        A selfie or full-body photo adds up to +20 bonus points to your Aura Score.
      </Text>

      {photoUri ? (
        <TouchableOpacity onPress={onPick} style={styles.photoPreviewWrapper}>
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          <View style={styles.photoEditBadge}>
            <Text style={styles.photoEditText}>Change</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.photoPickers}>
          <TouchableOpacity onPress={onCamera} style={styles.pickerBtn}>
            <Text style={styles.pickerEmoji}>📷</Text>
            <Text style={styles.pickerLabel}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPick} style={styles.pickerBtn}>
            <Text style={styles.pickerEmoji}>🖼️</Text>
            <Text style={styles.pickerLabel}>Choose Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.base,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full,
  },
  backText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
  },
  stepIndicator: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  progressWrapper: {
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.xl,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingVertical: SPACING.base,
    paddingBottom: SPACING['3xl'],
  },
  footer: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING['2xl'],
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  skipPhoto: {
    paddingVertical: SPACING.xs,
  },
  skipPhotoText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  doneEmoji: { fontSize: 64 },
  doneTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  doneSubtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.base * 1.6,
  },
  photoStep: {
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    gap: SPACING.base,
  },
  photoEmoji: { fontSize: 48 },
  photoTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  photoSubtitle: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZE.base * 1.6,
  },
  photoPreviewWrapper: {
    position: 'relative',
    marginTop: SPACING.sm,
  },
  photoPreview: {
    width: 200,
    height: 200,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  photoEditText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
  photoPickers: {
    flexDirection: 'row',
    gap: SPACING.base,
    marginTop: SPACING.sm,
  },
  pickerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    borderStyle: 'dashed',
  },
  pickerEmoji: { fontSize: 28 },
  pickerLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
