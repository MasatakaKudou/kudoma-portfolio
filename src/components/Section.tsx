import React from 'react';

import { Box, Container } from '@mui/material';

import { MainHeading } from '../fonts';
import { rhythm } from '../theme';
import { NAV_HEIGHT } from './SectionNav';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

/** 全セクション共通の外枠。見出しと余白のリズムをここに集約する。 */
export const Section: React.FC<SectionProps> = ({ id, title, children }) => (
  <Box component="section" id={id} sx={{ mt: rhythm.section, scrollMarginTop: NAV_HEIGHT + 16 }}>
    <Container maxWidth="lg">
      <MainHeading title={title} />
      {children}
    </Container>
  </Box>
);
