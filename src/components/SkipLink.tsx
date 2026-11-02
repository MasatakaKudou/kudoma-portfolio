import React from 'react';

import { Box } from '@mui/material';

import { ocean } from '../theme';

/** キーボード利用者がナビを飛ばして本文へ移るためのリンク。フォーカスされるまで画面外に置く。 */
export const SkipLink: React.FC<{ targetId: string }> = ({ targetId }) => (
  <Box
    component="a"
    href={`#${targetId}`}
    sx={{
      position: 'absolute',
      left: 16,
      top: -64,
      zIndex: 20,
      px: 2,
      py: 1,
      borderRadius: 999,
      bgcolor: ocean.deep,
      color: '#ffffff',
      fontWeight: 700,
      textDecoration: 'none',
      '&:focus': { top: 12 },
    }}
  >
    本文へスキップ
  </Box>
);
