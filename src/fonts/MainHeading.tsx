import React from 'react';
import { Typography } from '@mui/material'

interface MainHeadingProps {
  title: string;
};

export const MainHeading: React.FC<MainHeadingProps> = (props) => {
  return (
    <Typography variant='h3' sx={{ marginTop: 5 }}>{props.title}</Typography>
  );
};
