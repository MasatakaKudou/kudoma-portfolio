import React, { useCallback, useEffect, useState } from 'react';

import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { ThemeMode, alpha, elevation, ocean } from './theme';

const STORAGE_KEY = 'theme-mode';
const DARK_QUERY = '(prefers-color-scheme: dark)';
/** <meta name="theme-color"> に反映する、各モードの色（モバイルのアドレスバー用）。 */
const THEME_COLORS: Record<ThemeMode, string> = { light: '#0074ae', dark: '#051b27' };

const isMode = (value: unknown): value is ThemeMode => value === 'light' || value === 'dark';

/** localStorage は無効化されていることがあるので、読み書きとも失敗しても壊れないようにする。 */
const readStored = (): ThemeMode | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isMode(value) ? value : null;
  } catch {
    return null;
  }
};

const writeStored = (mode: ThemeMode) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* 保存できなくても、そのセッション内では切り替わる。 */
  }
};

const systemMode = (): ThemeMode =>
  typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';

/** 初期値。public/index.html のインラインスクリプトが先に data-theme を決めているので、それに揃えてちらつきを防ぐ。 */
const initialMode = (): ThemeMode => {
  const applied = document.documentElement.dataset.theme;
  return isMode(applied) ? applied : readStored() ?? systemMode();
};

/**
 * ライト/ダークの状態。保存された選択があればそれを使い、なければ OS 設定（prefers-color-scheme）に追従する。
 */
export const useThemeMode = () => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [followsSystem, setFollowsSystem] = useState(() => readStored() === null);

  useEffect(() => {
    if (!followsSystem || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => setMode(query.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [followsSystem]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[mode]);
  }, [mode]);

  const toggle = useCallback(() => {
    const next: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    writeStored(next);
    setFollowsSystem(false);
    setMode(next);
  }, [mode]);

  return { mode, toggle };
};

interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

/** 画面右下に固定するライト/ダーク切り替えボタン。 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ mode, onToggle }) => {
  const label = mode === 'dark' ? 'ライトモードに切り替える' : 'ダークモードに切り替える';
  return (
    <Tooltip title={label} placement="left">
      <IconButton
        aria-label={label}
        onClick={onToggle}
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
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};
