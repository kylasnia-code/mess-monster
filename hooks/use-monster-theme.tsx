import { createContext, useContext } from 'react';

import {
  DEFAULT_PALETTE,
  LUNA_PALETTE,
  MonsterPalette,
  NILLY_PALETTE,
} from '@/constants/monster-theme';
import { usePlayerStore } from '@/store/use-player-store';

// ─── Context ──────────────────────────────────────────────────────────────────

const MonsterThemeContext = createContext<MonsterPalette>(DEFAULT_PALETTE);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function MonsterThemeProvider({ children }: { children: React.ReactNode }) {
  const selectedMonster = usePlayerStore((s) => s.selectedMonster);

  const palette: MonsterPalette =
    selectedMonster === 'luna' ? LUNA_PALETTE : NILLY_PALETTE;

  return (
    <MonsterThemeContext.Provider value={palette}>
      {children}
    </MonsterThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Returns the active monster's color palette.
 * Use this anywhere you need monster-aware accent colors.
 */
export function useMonsterTheme(): MonsterPalette {
  return useContext(MonsterThemeContext);
}
