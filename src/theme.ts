import { createTheme, alpha as muiAlpha } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

/**
 * 海をモチーフにしたデザイントークン（ライト）。
 * 既存のブランドカラー #0074ae を軸に、浅瀬から深海までの階調を持たせている。
 */
const lightOcean = {
  abyss: '#02293b',
  deep: '#004d66',
  main: '#0074ae',
  mid: '#0090d4',
  light: '#00aaff',
  shallow: '#7fd4f0',
  foam: '#e0f7fa',
  surface: '#f4fcfe',
  /** カードやナビなど「面」の色。 */
  paper: '#ffffff',
  /** ページ最下部（海底側）の色。 */
  floor: '#b9e4f2',
  /** main を背景にした文字色。 */
  onMain: '#ffffff',
};

/**
 * 深海テーマ。トークン名は「用途」を表すので、ダークでは明暗が入れ替わる
 * （deep=本文色は明るく、foam/surface=背景は暗く）。潜るほど暗くなる。
 */
const darkOcean: typeof lightOcean = {
  abyss: '#e6f7fc',
  deep: '#d3eef7',
  main: '#4cc0ee',
  mid: '#3aaee4',
  light: '#2ab4ff',
  shallow: '#1b86b3',
  foam: '#06222f',
  surface: '#051b27',
  paper: '#0b3044',
  floor: '#020d14',
  onMain: '#02202e',
};

const palettes: Record<ThemeMode, typeof lightOcean> = { light: lightOcean, dark: darkOcean };

type OceanKey = keyof typeof lightOcean;

/**
 * コンポーネントが参照するトークン。実体は CSS 変数（--ocean-*）で、
 * テーマ（ライト/ダーク）ごとに CssBaseline が値を差し込む。
 * 変数なので MUI の alpha() は使えない。下の alpha() を使うこと。
 */
export const ocean = Object.fromEntries(
  Object.keys(lightOcean).map((key) => [key, `var(--ocean-${key})`]),
) as Record<OceanKey, string>;

/** 青みを帯びた影。グレーの影より水中の柔らかさに合う。ダークでは黒系にして沈める。 */
export const elevation = {
  soft: 'var(--elevation-soft)',
  lifted: 'var(--elevation-lifted)',
} as const;

const elevations: Record<ThemeMode, { soft: string; lifted: string }> = {
  light: {
    soft: '0 1px 2px rgba(0, 63, 92, .05), 0 8px 24px rgba(0, 63, 92, .07)',
    lifted: '0 2px 6px rgba(0, 63, 92, .07), 0 18px 40px rgba(0, 63, 92, .14)',
  },
  dark: {
    soft: '0 1px 2px rgba(0, 0, 0, .3), 0 8px 24px rgba(0, 0, 0, .28)',
    lifted: '0 2px 6px rgba(0, 0, 0, .35), 0 18px 40px rgba(0, 0, 0, .5)',
  },
};

/**
 * 色に透明度を掛ける。CSS 変数でも動くよう color-mix を使う（MUI の alpha は var() を解釈できない）。
 */
export const alpha = (color: string, opacity: number) =>
  `color-mix(in srgb, ${color} ${Math.round(opacity * 1000) / 10}%, transparent)`;

/** セクション間の垂直リズム（8pxグリッド基準）。 */
export const rhythm = { section: { xs: 6, md: 8 } } as const;

const fontFamily = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Helvetica Neue"',
  '"Hiragino Sans"',
  '"Hiragino Kaku Gothic ProN"',
  '"Noto Sans JP"',
  '"Yu Gothic"',
  'Meiryo',
  'sans-serif',
].join(',');

const toCssVars = (mode: ThemeMode) => ({
  colorScheme: mode,
  ...Object.fromEntries(Object.entries(palettes[mode]).map(([key, value]) => [`--ocean-${key}`, value])),
  '--elevation-soft': elevations[mode].soft,
  '--elevation-lifted': elevations[mode].lifted,
});

export const getTheme = (mode: ThemeMode) => {
  const c = palettes[mode];
  return createTheme({
    palette: {
      mode,
      primary: { main: c.main, dark: c.deep, light: c.mid, contrastText: c.onMain },
      secondary: { main: c.light },
      background: { default: c.foam, paper: c.paper },
      text: { primary: c.deep, secondary: muiAlpha(c.deep, 0.72) },
      divider: muiAlpha(c.main, 0.16),
    },

    shape: { borderRadius: 14 },

    typography: {
      fontFamily,
      // 見出しは clamp でビューポート追従。モバイルでの縮小に別途 media query が要らない。
      h1: { fontSize: 'clamp(2.75rem, 9vw, 5.25rem)', fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.05 },
      h2: { fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.15 },
      h3: { fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.2 },
      h5: { fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', fontWeight: 700, letterSpacing: '-.01em' },
      h6: { fontSize: '.95rem', fontWeight: 700, letterSpacing: '.04em' },
      // 日本語は行間を広めに取らないと詰まって見える。
      body1: { fontSize: '1rem', lineHeight: 1.9, letterSpacing: '.02em' },
      body2: { fontSize: '.9rem', lineHeight: 1.8, letterSpacing: '.02em' },
      button: { textTransform: 'none', fontWeight: 700, letterSpacing: '.02em' },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          // 水面から深みへ。ページ全体に伸ばすことでスクロール＝潜っていく感覚を出す。
          // background-attachment: fixed は iOS で描画が重いため使わない。
          ':root': toCssVars(mode),
          body: {
            background: `linear-gradient(180deg, ${ocean.surface} 0%, ${ocean.foam} 40%, ${ocean.floor} 100%)`,
            minHeight: '100vh',
          },
          html: { scrollBehavior: 'smooth' },
          '::selection': { background: alpha(ocean.light, 0.28) },
          // キーボード操作の可視性。MUI 既定より輪郭をはっきりさせる。
          ':focus-visible': { outline: `2px solid ${ocean.mid}`, outlineOffset: 3, borderRadius: 4 },
          '@media (prefers-reduced-motion: reduce)': {
            'html:focus-within': { scrollBehavior: 'auto' },
            '*, *::before, *::after': {
              animationDuration: '.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '.01ms !important',
            },
          },
        },
      },

      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${alpha(ocean.main, 0.1)}`,
            boxShadow: elevation.soft,
            backgroundImage: 'none',
            transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
          },
        },
      },

      MuiAccordion: {
        defaultProps: { disableGutters: true, elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${alpha(ocean.main, 0.12)}`,
            borderRadius: 14,
            background: alpha(ocean.paper, 0.72),
            backdropFilter: 'blur(6px)',
            overflow: 'hidden',
            transition: 'box-shadow .25s ease, border-color .25s ease',
            // MUI 既定の区切り線を消す（角丸と干渉するため）。
            '&::before': { display: 'none' },
            '&:hover': { borderColor: alpha(ocean.main, 0.3) },
            '&.Mui-expanded': { boxShadow: elevation.soft, borderColor: alpha(ocean.main, 0.28) },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: { padding: '0 20px', minHeight: 64 },
          content: { margin: '14px 0' },
          expandIconWrapper: { color: ocean.main },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: { root: { padding: '0 20px 22px' } },
      },

      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, letterSpacing: '.02em' },
          outlined: { borderColor: alpha(ocean.main, 0.28) },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 999, paddingInline: 18 },
          containedPrimary: { boxShadow: 'none', '&:hover': { boxShadow: elevation.soft } },
        },
      },

      MuiDivider: {
        styleOverrides: { root: { borderColor: alpha(ocean.main, 0.16) } },
      },
    },
  });
};

export const theme = getTheme('light');

export default theme;
