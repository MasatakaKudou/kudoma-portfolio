import React from 'react';

import { Box, Tooltip } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { alpha } from '../theme';

import { elevation, ocean } from '../theme';
import { NewTabNote } from './NewTabNote';

interface AccountLogoProps {
  /** 画像のアイコン。`icon` を渡すときは不要。 */
  src?: string;
  /** 画像の代わりに表示する MUI のアイコン（文字色に追従するので、ダークでも見える）。 */
  icon?: React.ReactNode;
  url: string;
  /** サービス名。ツールチップと代替テキストに使う。 */
  name: string;
}

export const AccountLogo: React.FC<AccountLogoProps> = ({ src, icon, url, name }) => (
  <Tooltip title={name} arrow>
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
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
      {icon ? (
        <Box aria-hidden sx={{ display: 'grid', placeItems: 'center', width: 28, height: 28, color: 'text.primary', '& svg': { width: 24, height: 24 } }}>
          {icon}
        </Box>
      ) : (
        <Box component="img" src={src} alt="" aria-hidden sx={{ width: 28, height: 28, objectFit: 'contain' }} />
      )}
      <Box component="span" sx={visuallyHidden}>
        {name}
      </Box>
      <NewTabNote />
    </Box>
  </Tooltip>
);
