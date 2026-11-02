import React from 'react';

import { Box } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

/** target="_blank" のリンク内に置く、スクリーンリーダー向けの補足。見た目には出さない。 */
export const NewTabNote = () => (
  <Box component="span" sx={visuallyHidden}>
    （新しいタブで開く）
  </Box>
);
