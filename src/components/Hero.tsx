import React from 'react';

import { Box, Container, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { alpha } from '../theme';

import { SiteLogo, WaveDivider } from '.';
import { skills } from '../data';
import { ocean } from '../theme';

// 水面越しの光がゆらぐような明滅。
const shimmer = keyframes`
  0%, 100% { opacity: .55; transform: translate3d(0, 0, 0) scale(1); }
  50%      { opacity: .85; transform: translate3d(2%, -3%, 0) scale(1.08); }
`;

export const Hero = () => (
  <Box
    component="header"
    sx={{
      position: 'relative',
      overflow: 'hidden',
      pt: { xs: 7, md: 11 },
      pb: 0,
    }}
  >
    {/* 水中の光の柱。装飾なので操作対象にはしない。 */}
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: '-30% -10% auto -10%',
        height: '150%',
        pointerEvents: 'none',
        background: `radial-gradient(60% 50% at 22% 0%, ${alpha(ocean.light, 0.3)} 0%, transparent 70%),
                     radial-gradient(45% 45% at 82% 12%, ${alpha(ocean.shallow, 0.35)} 0%, transparent 72%)`,
        animation: `${shimmer} 14s ease-in-out infinite`,
      }}
    />

    <Container maxWidth="lg" sx={{ position: 'relative' }}>
      <SiteLogo />

      <Stack
        direction="row"
        useFlexGap
        sx={{ alignItems: 'center', flexWrap: 'wrap', mt: { xs: 3, md: 4 }, ml: { xs: 0.5, md: 1 }, columnGap: 1.5, rowGap: 1 }}
      >
        {skills.map(({ area }, index) => (
          <React.Fragment key={area}>
            {index > 0 && (
              <Box aria-hidden sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: alpha(ocean.main, 0.4) }} />
            )}
            <Typography
              component="span"
              sx={{ fontWeight: 700, letterSpacing: '.08em', color: alpha(ocean.deep, 0.78) }}
            >
              {area}
            </Typography>
          </React.Fragment>
        ))}
      </Stack>
    </Container>

    <Box sx={{ mt: { xs: 4, md: 5 } }}>
      <WaveDivider />
    </Box>
  </Box>
);
