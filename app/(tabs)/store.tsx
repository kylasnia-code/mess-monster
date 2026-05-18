import { useCallback, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { usePetStore } from '@/store/use-pet-store';
import { usePlayerStore } from '@/store/use-player-store';
import { useStoreStore } from '@/store/use-store-store';
import {
  STORE_CATEGORIES,
  STORE_ITEMS,
  StoreCategory,
  StoreItem,
} from '@/store/store-items';

export default function StoreScreen() {
  const availablePoints = usePlayerStore((s) => s.availablePoints());
  const spendPoints = usePlayerStore((s) => s.spendPoints);
  const care = usePetStore((s) => s.care);
  const buyItem = useStoreStore((s) => s.buyItem);
  const isOwned = useStoreStore((s) => s.isOwned);
  const consumeItem = useStoreStore((s) => s.useItem);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const [activeCategory, setActiveCategory] = useState<StoreCategory>('food');
  const [feedback, setFeedback] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFeedback(message);
    timerRef.current = setTimeout(() => setFeedback(null), 2200);
  }, []);

  const handleBuy = useCallback(
    (item: StoreItem) => {
      // Check if non-repeatable and already owned
      if (!item.repeatable && isOwned(item.id)) {
        showFeedback('✅ Already owned!');
        return;
      }

      // Check if player can afford it
      if (availablePoints < item.price) {
        showFeedback('😅 Not enough points!');
        return;
      }

      // Process purchase
      const spent = spendPoints(item.price);
      if (!spent) {
        showFeedback('😅 Not enough points!');
        return;
      }

      const bought = buyItem(item);
      if (!bought) {
        showFeedback('❌ Something went wrong');
        return;
      }

      // For food and toys, auto-use immediately (they boost mood)
      if (item.repeatable) {
        consumeItem(item.id);
        // Apply mood boost by calling care (resets lastCaredAt)
        care();
        showFeedback(`🎉 ${item.name} used! +${item.moodBoost} mood`);
      } else {
        showFeedback(`🛍️ ${item.name} added to collection!`);
      }
    },
    [availablePoints, spendPoints, buyItem, isOwned, consumeItem, care, showFeedback]
  );

  const filteredItems = STORE_ITEMS.filter((i) => i.category === activeCategory);

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Points Store</ThemedText>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsBadgeText}>⭐ {availablePoints} pts</Text>
        </View>
      </View>

      {/* Feedback pill */}
      {feedback && (
        <View style={[styles.feedbackPill, isDark && styles.feedbackPillDark]}>
          <Text style={[styles.feedbackText, isDark && styles.feedbackTextDark]}>
            {feedback}
          </Text>
        </View>
      )}

      {/* Category tabs */}
      <View style={styles.categoryRow}>
        {STORE_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryTab,
              activeCategory === cat.key && styles.categoryTabActive,
              isDark && styles.categoryTabDark,
              activeCategory === cat.key && isDark && styles.categoryTabActiveDark,
            ]}
            onPress={() => setActiveCategory(cat.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
            <Text
              style={[
                styles.categoryLabel,
                activeCategory === cat.key && styles.categoryLabelActive,
                isDark && styles.categoryLabelDark,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Items grid */}
      <ScrollView
        contentContainerStyle={styles.itemsGrid}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.map((item) => {
          const owned = !item.repeatable && isOwned(item.id);
          const canAfford = availablePoints >= item.price;

          return (
            <View
              key={item.id}
              style={[
                styles.itemCard,
                isDark ? styles.itemCardDark : styles.itemCardLight,
                owned && styles.itemCardOwned,
              ]}
            >
              <Text style={styles.itemEmoji}>{item.emoji}</Text>
              <ThemedText style={styles.itemName}>{item.name}</ThemedText>
              <ThemedText style={styles.itemDesc}>{item.description}</ThemedText>

              <View style={styles.itemFooter}>
                {owned ? (
                  <View style={styles.ownedBadge}>
                    <Text style={styles.ownedText}>✓ Owned</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.buyButton,
                      !canAfford && styles.buyButtonDisabled,
                    ]}
                    onPress={() => handleBuy(item)}
                    activeOpacity={0.7}
                    disabled={!canAfford && !owned}
                  >
                    <Text
                      style={[
                        styles.buyButtonText,
                        !canAfford && styles.buyButtonTextDisabled,
                      ]}
                    >
                      {item.repeatable ? '🍴 Use' : '🛒 Buy'} · {item.price} pts
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pointsBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400e',
  },
  feedbackPill: {
    backgroundColor: '#d4f0b8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  feedbackPillDark: {
    backgroundColor: '#2a4a1a',
  },
  feedbackText: {
    color: '#2a5a1a',
    fontWeight: '600',
    fontSize: 14,
  },
  feedbackTextDark: {
    color: '#b8f5c8',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    gap: 2,
  },
  categoryTabDark: {
    backgroundColor: '#1e2124',
  },
  categoryTabActive: {
    backgroundColor: '#b8f5c8',
  },
  categoryTabActiveDark: {
    backgroundColor: '#1a4d2e',
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  categoryLabelActive: {
    color: '#1a5c3a',
  },
  categoryLabelDark: {
    color: '#aaa',
  },
  itemsGrid: {
    gap: 12,
    paddingBottom: 40,
  },
  itemCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  itemCardLight: {
    backgroundColor: '#fafafa',
    borderColor: '#e8e8e8',
  },
  itemCardDark: {
    backgroundColor: '#1e2124',
    borderColor: '#2e3236',
  },
  itemCardOwned: {
    opacity: 0.7,
  },
  itemEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buyButton: {
    backgroundColor: '#52b788',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  buyButtonTextDisabled: {
    color: '#888',
  },
  ownedBadge: {
    backgroundColor: '#d4f0b8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ownedText: {
    color: '#2a5a1a',
    fontWeight: '700',
    fontSize: 13,
  },
});
