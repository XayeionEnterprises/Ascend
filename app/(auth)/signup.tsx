import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../../store/useUserStore';
import { COLORS, FONT_SIZE, SPACING, RADIUS } from '../../lib/constants';
import Button from '../../components/ui/Button';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createProfile, updatePhoto } = useUserStore();

  async function handleSignup() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createProfile(name.trim());
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create your profile</Text>
            <Text style={styles.subtitle}>
              What should we call you? You can always change this later.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Your name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Alex"
                placeholderTextColor={COLORS.textMuted}
                autoFocus
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoEmoji}>💡</Text>
              <Text style={styles.infoText}>
                No email needed to get started. Your data is stored securely on your device.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              label="Start Ascending"
              onPress={handleSignup}
              loading={loading}
              disabled={!name.trim()}
              fullWidth
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.base,
    paddingBottom: SPACING['2xl'],
  },
  back: {
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  backText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.textSecondary,
  },
  header: {
    marginBottom: SPACING['2xl'],
    gap: SPACING.sm,
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
  form: {
    flex: 1,
    gap: SPACING.base,
  },
  field: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md + 2,
    fontSize: FONT_SIZE.lg,
    color: COLORS.text,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
  },
  infoEmoji: {
    fontSize: 16,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZE.sm * 1.6,
  },
  footer: {
    marginTop: SPACING['2xl'],
  },
});
