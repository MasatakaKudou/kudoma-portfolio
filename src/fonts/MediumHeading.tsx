import React from 'react';
import { Typography } from '@mui/material'

interface MediumHeadingProps {
  title: string;
  underline?: boolean;
};

export const MediumHeading: React.FC<MediumHeadingProps> = ({ title, underline = false }) => {
  if (underline) {
    return (
      <Typography component='h4' variant='h5' sx={{ borderBottom: 1, marginTop: 2, marginBottom: 1 }}>
        {title}
      </Typography>
    );
  }
  return (
    <Typography component='h4' variant='h5'>{ title }</Typography>
  );
};
