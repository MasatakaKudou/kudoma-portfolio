import React from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';

import same from '../images/same.png';
import { ocean } from '../theme';

// ゆっくり泳ぐような上下動。2匹で位相をずらして群れ感を出す。
const swim = keyframes`
  0%, 100% { transform: translateY(0) rotate(-1.5deg); }
  50%      { transform: translateY(-9px) rotate(1.5deg); }
`;

const Shark: React.FC<{ delay?: number; flip?: boolean; size?: number }> = ({
  delay = 0,
  flip = false,
  size = 64,
}) => (
  <Box
    component="img"
    src={same}
    alt=""
    aria-hidden
    width={360}
    height={360}
    sx={{
      width: { xs: size * 0.62, sm: size * 0.82, md: size },
      height: 'auto',
      flexShrink: 0,
      transform: flip ? 'scaleX(-1)' : 'none',
      animation: `${swim} 6s ease-in-out ${delay}s infinite`,
      filter: 'drop-shadow(0 6px 12px rgba(0, 116, 174, .22))',
    }}
  />
);

const Word: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography
    variant="h1"
    component="span"
    sx={{
      color: ocean.deep, // グラデーション非対応時のフォールバック
      backgroundImage: `linear-gradient(135deg, ${ocean.deep} 0%, ${ocean.main} 45%, ${ocean.mid} 100%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}
  >
    {children}
  </Typography>
);

/** サイトのワードマーク。2行に割ってサメを泳がせるロックアップ。 */
export const SiteLogo = () => (
  <Box component="h1" sx={{ m: 0 }}>
    <Stack direction="row" alignItems="center" spacing={{ xs: 1, md: 2 }}>
      <Word>Kudoma</Word>
      <Shark />
    </Stack>
    <Stack
      direction="row"
      alignItems="center"
      spacing={{ xs: 1, md: 2 }}
      sx={{ ml: { xs: 2, md: 5 }, mt: { xs: -0.5, md: -1 } }}
    >
      <Shark delay={1.4} />
      <Word>Portfolio</Word>
    </Stack>
  </Box>
);
