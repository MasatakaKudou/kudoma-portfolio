import React from 'react';
import { Typography } from '@mui/material'

interface MediumHeadingProps {
  title: string;
  underline?: boolean;
};

const MediumHeading: React.FC<MediumHeadingProps> = ({ title, underline = false }) => {
  if (underline) {
    return (
      <Typography variant='h5' sx={{ borderBottom: 1, marginTop: 2, marginBottom: 1 }}>
        {title}
      </Typography>
    );
  }
  return (
    <Typography variant='h5'>{ title }</Typography>
  );
};
  
export default MediumHeading;
