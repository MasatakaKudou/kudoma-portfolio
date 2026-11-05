import type { ThemeMode } from './theme';

/** 利用者の選択。`system` は OS の設定（prefers-color-scheme）に合わせる。 */
export type ThemePreference = 'system' | ThemeMode;

const ORDER: ThemePreference[] = ['system', 'light', 'dark'];

export const isThemeMode = (value: unknown): value is ThemeMode => value === 'light' || value === 'dark';

/** 保存された値から選択を決める。light / dark 以外（未保存・壊れた値）は `system`。 */
export const parsePreference = (stored: string | null): ThemePreference => (isThemeMode(stored) ? stored : 'system');

/** 次の選択。system → light → dark → system の順に巡る。 */
export const nextPreference = (current: ThemePreference): ThemePreference =>
  ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

/** 実際に使うモード。`system` のときは OS の設定に従う。 */
export const resolveMode = (preference: ThemePreference, systemIsDark: boolean): ThemeMode =>
  preference === 'system' ? (systemIsDark ? 'dark' : 'light') : preference;
