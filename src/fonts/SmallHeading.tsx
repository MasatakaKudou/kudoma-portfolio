import React from 'react';
import { Typography } from '@mui/material'

interface SmallHeadingProps {
  title: string;
  firstElement?: boolean;
};

export const SmallHeading: React.FC<SmallHeadingProps> = ({ title, firstElement = false }) => {
  if (firstElement) {
    return (
      <Typography component='h5' variant='h6' sx={{ borderBottom: 1, marginBottom: 1 }}>{ title }</Typography>
    );
  }
  return (
    <Typography component='h5' variant='h6' sx={{ borderBottom: 1, marginTop: 2, marginBottom: 1 }}>
      { title }
    </Typography>
  );
};
