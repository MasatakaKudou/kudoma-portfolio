import React from 'react';

import { Box } from '@mui/material';

import same from '../images/same.png';

interface SameProps {
  size?: number;
}

/** マスコットのサメ。装飾用途なので代替テキストは持たせない。 */
export const Same: React.FC<SameProps> = ({ size = 60 }) => (
  <Box component="img" src={same} alt="" aria-hidden width={360} height={360} sx={{ width: size, height: 'auto' }} />
);
