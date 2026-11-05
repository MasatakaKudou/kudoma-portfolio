import React, { useCallback, useEffect, useState } from 'react';

import { IconButton, Tooltip } from '@mui/material';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { ThemeMode, alpha, elevation, ocean } from './theme';
import { ThemePreference, nextPreference, parsePreference, resolveMode } from './themePreference';

const STORAGE_KEY = 'theme-mode';
const DARK_QUERY = '(prefers-color-scheme: dark)';
/** <meta name="theme-color"> に反映する、各モードの色（モバイルのアドレスバー用）。 */
const THEME_COLORS: Record<ThemeMode, string> = { light: '#0074ae', dark: '#051b27' };

/** localStorage は無効化されていることがあるので、読み書きとも失敗しても壊れないようにする。 */
const readStored = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * `system` は何も保存しない（キーを消す）。index.html のインラインスクリプトは、保存がなければ OS の設定に従うので、
 * 描画前のテーマ決定と、ここでの解釈がそろう。
 */
const writePreference = (preference: ThemePreference) => {
  try {
    if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    /* 保存できなくても、そのセッション内では切り替わる。 */
  }
};

const systemIsDark = (): boolean => typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches;

/**
 * テーマの選択（OS に合わせる / ライト / ダーク）と、実際に使うモード。
 * 初期値は保存された選択（なければ OS に合わせる）で、index.html のインラインスクリプトが先に決めた data-theme と同じ結果になる。
 */
export const useThemeMode = () => {
  const [preference, setPreference] = useState<ThemePreference>(() => parsePreference(readStored()));
  const [osDark, setOsDark] = useState(systemIsDark);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => setOsDark(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const mode = resolveMode(preference, osDark);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[mode]);
  }, [mode]);

  /** OS に合わせる → ライト → ダーク → OS に合わせる、の順に切り替える。 */
  const cycle = useCallback(() => {
    const next = nextPreference(preference);
    writePreference(next);
    setPreference(next);
  }, [preference]);

  return { mode, preference, cycle };
};

const PREFERENCE_LABEL: Record<ThemePreference, string> = {
  system: 'OS の設定に合わせる',
  light: 'ライト',
  dark: 'ダーク',
};

/** アイコンは、今の選択を表す（OS に合わせる / ライト / ダーク）。 */
const PREFERENCE_ICON: Record<ThemePreference, React.ReactElement> = {
  system: <BrightnessAutoIcon />,
  light: <LightModeIcon />,
  dark: <DarkModeIcon />,
};

interface ThemeToggleProps {
  /** 実際に使われているモード。 */
  mode: ThemeMode;
  /** 利用者の選択。 */
  preference: ThemePreference;
  onCycle: () => void;
}

/** 画面右下に固定するテーマ切り替えボタン。押すたびに、OS に合わせる → ライト → ダークの順に変わる。 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ mode, preference, onCycle }) => {
  const current =
    preference === 'system'
      ? `${PREFERENCE_LABEL.system}（今は${mode === 'dark' ? 'ダーク' : 'ライト'}）`
      : PREFERENCE_LABEL[preference];
  const label = `テーマ: ${current}。押すと「${PREFERENCE_LABEL[nextPreference(preference)]}」に切り替える`;
  return (
    <Tooltip title={label} placement="left">
      <IconButton
        aria-label={label}
        onClick={onCycle}
        sx={{
          position: 'fixed',
          right: { xs: 12, md: 24 },
          bottom: { xs: 12, md: 24 },
          zIndex: 20,
          width: 48,
          height: 48,
          color: ocean.main,
          bgcolor: alpha(ocean.paper, 0.85),
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(ocean.main, 0.3)}`,
          boxShadow: elevation.soft,
          '&:hover': { bgcolor: ocean.paper, boxShadow: elevation.lifted },
        }}
      >
        {PREFERENCE_ICON[preference]}
      </IconButton>
    </Tooltip>
  );
};
