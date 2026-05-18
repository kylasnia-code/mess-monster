import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { usePlayerStore } from '@/store/use-player-store';
import { generateNameOptions } from '@/store/name-randomizer';

export default function NamingScreen() {
  const router = useRouter();
  const selectedMonster = usePlayerStore((s) => s.selectedMonster);
  const setMonsterName = usePlayerStore((s) => s.setMonsterName);

  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>(generateNameOptions(5));

  const isNilly = selectedMonster === 'nilly';
  const accentColor = isNilly ? '#52b788' : '#cc2222';
  const bgColor = isNilly ? '#e8faf0' : '#1a0a1a';
  const textColor = isNilly ? '#1a5c3a' : '#f0e0e0';
  const inputBg = isNilly ? '#fff' : '#2a1a2a';
  const placeholderColor = isNilly ? '#aaa' : '#666';

  const handleRandomize = () => {
    setSuggestions(generateNameOptions(5));
  };

  const handlePickSuggestion = (suggestion: string) => {
    setName(suggestion);
  };

  const handleConfirm = () => {
    const finalName = name.trim() || 'Monster';
    setMonsterName(finalName);
    router.replace('/(tabs)');
  };

  const canConfirm = name.trim().length > 0;

  return (
    <View style={[styles.root, { backgroundColor: bgColor }]}>
      <StatusBar style={isNilly ? 'dark' : 'light'} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>
            Name your Monster!
          </Text>
          <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
            Give your {isNilly ? 'Nilly' : 'Luna'} a unique name
          </Text>
        </View>

        {/* Monster preview */}
        <View style={[styles.monsterPreview, { borderColor: accentColor }]}>
          <Text style={styles.monsterEmoji}>{isNilly ? '🌿' : '🦇'}</Text>
          <Text style={[styles.previewName, { color: accentColor }]}>
            {name.trim() || '???'}
          </Text>
        </View>

        {/* Name input */}
        <View style={styles.inputSection}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBg,
                color: textColor,
                borderColor: accentColor,
              },
            ]}
            value={name}
            onChangeText={setName}
            placeholder="Type a name..."
            placeholderTextColor={placeholderColor}
            maxLength={20}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <Text style={[styles.charCount, { color: textColor, opacity: 0.5 }]}>
            {name.length}/20
          </Text>
        </View>

        {/* Randomizer section */}
        <View style={styles.randomizerSection}>
          <TouchableOpacity
            style={[styles.randomizeButton, { backgroundColor: accentColor }]}
            onPress={handleRandomize}
            activeOpacity={0.7}
          >
            <Text style={styles.randomizeButtonText}>🎲 Randomize</Text>
          </TouchableOpacity>

          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={`${suggestion}-${index}`}
                style={[
                  styles.suggestionChip,
                  {
                    borderColor: accentColor,
                    backgroundColor: name === suggestion
                      ? accentColor
                      : 'transparent',
                  },
                ]}
                onPress={() => handlePickSuggestion(suggestion)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.suggestionText,
                    {
                      color: name === suggestion ? '#fff' : textColor,
                    },
                  ]}
                >
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Confirm button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            { backgroundColor: accentColor },
            !canConfirm && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          activeOpacity={0.7}
          disabled={!canConfirm}
        >
          <Text style={styles.confirmButtonText}>
            {canConfirm ? `Let's go, ${name.trim()}! 🎉` : 'Pick a name first'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
  },
  monsterPreview: {
    alignSelf: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    justifyContent: 'center',
    marginBottom: 28,
    gap: 4,
  },
  monsterEmoji: {
    fontSize: 56,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
  },
  inputSection: {
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    textAlign: 'center',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
  },
  randomizerSection: {
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  randomizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  randomizeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
});
