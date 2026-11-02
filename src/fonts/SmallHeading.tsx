import React from 'react';

import { Typography } from '@mui/material';
import { alpha } from '../theme';

import { ocean } from '../theme';

interface SmallHeadingProps {
  title: string;
  /** ブロック先頭に置く場合は上マージンを詰める。 */
  firstElement?: boolean;
}

/** 定義リストのラベル相当。小さめ・字間広めで本文と役割を分ける。 */
export const SmallHeading: React.FC<SmallHeadingProps> = ({ title, firstElement = false }) => (
  <Typography
    variant="h6"
    component="h4"
    sx={{ color: alpha(ocean.main, 0.9), mt: firstElement ? 0 : 3, mb: 1 }}
  >
    {title}
  </Typography>
);
