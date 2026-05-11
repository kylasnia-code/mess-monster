import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { deriveMood, usePetStore } from '@/store/use-pet-store';
import { usePlayerStore } from '@/store/use-player-store';

const MOOD_CONFIG = {
  thriving: {
    emoji: '🌟',
    bg: '#b8f5c8',
    darkBg: '#1a4d2e',
    message: 'Nilly is absolutely thriving!',
  },
  happy: {
    emoji: '😊',
    bg: '#d4f0b8',
    darkBg: '#2a4a1a',
    message: 'Nilly is happy and content.',
  },
  neutral: {
    emoji: '😐',
    bg: '#f5f0c0',
    darkBg: '#3d3a10',
    message: 'Nilly could use some attention.',
  },
  sad: {
    emoji: '😢',
    bg: '#fcd9a8',
    darkBg: '#4d2e10',
    message: 'Nilly is feeling neglected...',
  },
  sick: {
    emoji: '🤒',
    bg: '#f5b8b8',
    darkBg: '#4d1a1a',
    message: 'Nilly is sick. Please help her!',
  },
} as const;

export default function HomeScreen() {
  const lastCaredAt = usePetStore((s) => s.lastCaredAt);
  const mood = deriveMood(lastCaredAt);
  const availablePoints = usePlayerStore((s) => s.availablePoints());
  const streak = usePlayerStore((s) => s.streak);

  const config = MOOD_CONFIG[mood];

  return (
    <ThemedView
      style={styles.container}
      lightColor={config.bg}
      darkColor={config.darkBg}
    >
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.points}>
          ⭐ {availablePoints} pts
        </ThemedText>
        {streak > 0 && (
          <ThemedText type="defaultSemiBold" style={styles.streak}>
            🔥 {streak}d streak
          </ThemedText>
        )}
      </View>

      <View style={styles.monsterContainer}>
        <View style={styles.monsterBody}>
          <ThemedText style={styles.monsterEmoji}>{config.emoji}</ThemedText>
          <ThemedText style={styles.nilly}>Nilly</ThemedText>
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText type="subtitle" style={styles.moodLabel}>
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </ThemedText>
        <ThemedText style={styles.moodMessage}>{config.message}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  points: {
    fontSize: 18,
  },
  streak: {
    fontSize: 18,
  },
  monsterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monsterBody: {
    alignItems: 'center',
    gap: 12,
  },
  monsterEmoji: {
    fontSize: 140,
    lineHeight: 160,
  },
  nilly: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 48,
    gap: 8,
  },
  moodLabel: {
    fontSize: 22,
  },
  moodMessage: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});
