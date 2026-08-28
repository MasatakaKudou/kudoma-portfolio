import { createTheme, alpha } from '@mui/material/styles';

/**
 * 海をモチーフにしたデザイントークン。
 * 既存のブランドカラー #0074ae を軸に、浅瀬から深海までの階調を持たせている。
 */
export const ocean = {
  abyss: '#02293b',
  deep: '#004d66',
  main: '#0074ae',
  mid: '#0090d4',
  light: '#00aaff',
  shallow: '#7fd4f0',
  foam: '#e0f7fa',
  surface: '#f4fcfe',
} as const;

/** 青みを帯びた影。グレーの影より水中の柔らかさに合う。 */
export const elevation = {
  soft: '0 1px 2px rgba(0, 63, 92, .05), 0 8px 24px rgba(0, 63, 92, .07)',
  lifted: '0 2px 6px rgba(0, 63, 92, .07), 0 18px 40px rgba(0, 63, 92, .14)',
} as const;

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

export const theme = createTheme({
  palette: {
    primary: { main: ocean.main, dark: ocean.deep, light: ocean.mid },
    secondary: { main: ocean.light },
    background: { default: ocean.foam, paper: '#ffffff' },
    text: { primary: ocean.deep, secondary: alpha(ocean.deep, 0.72) },
    divider: alpha(ocean.main, 0.16),
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
        body: {
          background: `linear-gradient(180deg, ${ocean.surface} 0%, ${ocean.foam} 40%, #b9e4f2 100%)`,
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
          background: alpha('#ffffff', 0.72),
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

export default theme;
