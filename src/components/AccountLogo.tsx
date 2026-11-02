import React from 'react';

import { Box, Tooltip } from '@mui/material';
import { alpha } from '../theme';

import { elevation, ocean } from '../theme';

interface AccountLogoProps {
  src: string;
  url: string;
  /** サービス名。ツールチップと代替テキストに使う。 */
  name: string;
}

export const AccountLogo: React.FC<AccountLogoProps> = ({ src, url, name }) => (
  <Tooltip title={name} arrow>
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      sx={{
        display: 'grid',
        placeItems: 'center',
        width: 54,
        height: 54,
        borderRadius: '50%',
        bgcolor: 'background.paper',
        border: `1px solid ${alpha(ocean.main, 0.14)}`,
        boxShadow: elevation.soft,
        transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: elevation.lifted,
          borderColor: alpha(ocean.main, 0.4),
        },
      }}
    >
      <Box component="img" src={src} alt="" aria-hidden sx={{ width: 28, height: 28, objectFit: 'contain' }} />
    </Box>
  </Tooltip>
);
