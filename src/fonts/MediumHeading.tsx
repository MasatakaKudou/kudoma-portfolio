import React from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '../theme';

import { ocean } from '../theme';

interface MediumHeadingProps {
  title: string;
  /** 見出しの右側に罫線を引く。 */
  underline?: boolean;
}

export const MediumHeading: React.FC<MediumHeadingProps> = ({ title, underline = false }) => {
  const heading = (
    <Typography variant="h5" component="h3" sx={{ color: ocean.deep, whiteSpace: 'nowrap' }}>
      {title}
    </Typography>
  );

  if (!underline) return heading;

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
      {heading}
      <Box
        aria-hidden
        sx={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${alpha(ocean.main, 0.3)}, transparent)` }}
      />
    </Stack>
  );
};
