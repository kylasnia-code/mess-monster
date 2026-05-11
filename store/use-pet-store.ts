import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PetState } from './types';

export type PetMood = 'thriving' | 'happy' | 'neutral' | 'sad' | 'sick';

/** Derived from hours since last care — not stored so it can never go out of sync. */
export function deriveMood(lastCaredAt: number): PetMood {
  const hours = (Date.now() - lastCaredAt) / 3_600_000;
  if (hours < 6) return 'thriving';
  if (hours < 12) return 'happy';
  if (hours < 24) return 'neutral';
  if (hours < 48) return 'sad';
  return 'sick';
}

interface PetStore extends PetState {
  care: () => void;
}

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      lastCaredAt: Date.now(),
      care: () => set({ lastCaredAt: Date.now() }),
    }),
    {
      name: 'mm-pet',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
