import React from 'react';

import { Box, Container, Stack, Typography } from '@mui/material';

import { Same, WaveDivider } from '.';
import { rhythm } from '../theme';

export const Footer = () => (
  <Box component="footer" sx={{ mt: rhythm.section }}>
    <WaveDivider flip />
    <Container maxWidth="lg">
      <Stack spacing={1.5} sx={{ alignItems: 'center', pb: 6, pt: 1 }}>
        <Same size={44} interactive />
        <Typography sx={{ fontWeight: 700, letterSpacing: '.14em', color: 'text.secondary' }}>
          Kudoma Portfolio
        </Typography>
      </Stack>
    </Container>
  </Box>
);
