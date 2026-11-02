import React from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '../theme';

import { ocean } from '../theme';

interface MainHeadingProps {
  title: string;
}

/** セクション見出し。左のアクセントバーと右へ抜ける罫線で階層を明示する。 */
export const MainHeading: React.FC<MainHeadingProps> = ({ title }) => (
  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: { xs: 3, md: 4 } }}>
    <Box
      aria-hidden
      sx={{
        width: 6,
        alignSelf: 'stretch',
        minHeight: 34,
        borderRadius: 999,
        background: `linear-gradient(180deg, ${ocean.mid}, ${ocean.main})`,
      }}
    />
    <Typography variant="h3" component="h2" sx={{ color: ocean.deep }}>
      {title}
    </Typography>
    <Box
      aria-hidden
      sx={{
        flex: 1,
        height: '1px',
        background: `linear-gradient(90deg, ${alpha(ocean.main, 0.35)}, transparent)`,
      }}
    />
  </Stack>
);
