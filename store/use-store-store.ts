import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StoreItem } from './store-items';

export interface PurchaseRecord {
  itemId: string;
  purchasedAt: number; // unix ms
  quantity: number;
}

interface StoreState {
  /** Map of itemId -> PurchaseRecord for owned items */
  purchases: Record<string, PurchaseRecord>;

  /** Buy an item — returns false if already owned (non-repeatable) */
  buyItem: (item: StoreItem) => boolean;

  /** Check if a non-repeatable item is already owned */
  isOwned: (itemId: string) => boolean;

  /** Get total quantity purchased for a repeatable item */
  getQuantity: (itemId: string) => number;

  /** Use a repeatable item (decrements quantity, returns false if none left) */
  useItem: (itemId: string) => boolean;
}

export const useStoreStore = create<StoreState>()(
  persist(
    (set, get) => ({
      purchases: {},

      buyItem: (item: StoreItem) => {
        const existing = get().purchases[item.id];

        // Non-repeatable items can only be bought once
        if (!item.repeatable && existing) return false;

        set((s) => ({
          purchases: {
            ...s.purchases,
            [item.id]: {
              itemId: item.id,
              purchasedAt: Date.now(),
              quantity: (existing?.quantity ?? 0) + 1,
            },
          },
        }));
        return true;
      },

      isOwned: (itemId: string) => {
        const record = get().purchases[itemId];
        return record != null && record.quantity > 0;
      },

      getQuantity: (itemId: string) => {
        return get().purchases[itemId]?.quantity ?? 0;
      },

      useItem: (itemId: string) => {
        const record = get().purchases[itemId];
        if (!record || record.quantity <= 0) return false;
        set((s) => ({
          purchases: {
            ...s.purchases,
            [itemId]: {
              ...s.purchases[itemId],
              quantity: s.purchases[itemId].quantity - 1,
            },
          },
        }));
        return true;
      },
    }),
    {
      name: 'mm-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
