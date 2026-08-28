import React from 'react';

import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { ocean } from '../theme';

interface WaveDividerProps {
  /** 波の数。多いほど深さを感じさせる。 */
  lines?: number;
  /** 上下反転させる（フッター側で使う）。 */
  flip?: boolean;
}

/**
 * 水面を表す装飾。背景色に依存しないストロークのみの表現にしているので、
 * グラデーション背景の上にそのまま重ねられる。
 */
export const WaveDivider: React.FC<WaveDividerProps> = ({ lines = 3, flip = false }) => (
  <Box
    aria-hidden
    sx={{
      display: 'block',
      lineHeight: 0,
      transform: flip ? 'scaleY(-1)' : 'none',
      opacity: 0.9,
    }}
  >
    <svg viewBox="0 0 1200 60" preserveAspectRatio="none" width="100%" height="60" focusable="false">
      {Array.from({ length: lines }, (_, i) => (
        <path
          key={i}
          d={`M0 ${22 + i * 11} C 150 ${6 + i * 11}, 300 ${38 + i * 11}, 450 ${22 + i * 11} S 750 ${6 + i * 11}, 900 ${22 + i * 11} S 1150 ${38 + i * 11}, 1200 ${22 + i * 11}`}
          fill="none"
          stroke={alpha(ocean.main, 0.34 - i * 0.09)}
          strokeWidth={2 - i * 0.4}
          strokeLinecap="round"
        />
      ))}
    </svg>
  </Box>
);
