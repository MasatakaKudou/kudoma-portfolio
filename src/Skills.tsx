import React from 'react';

import Skill from './Skill';

import { 
  Typography,
  Container,
  Stack,
} from '@mui/material';

export interface SkillsProps {
  area: string;
  skills: {
    name: string;
    rating: number;
  }[];
}

export const Skills: React.FC<SkillsProps> = (props) => {
  return (
    <Container>
    <Typography variant='h6' sx={{ borderBottom: 1, marginTop: 2, marginBottom: 1 }}>{ props.area }</Typography>
    <Stack direction='row' flexWrap='wrap' sx={{ justifyContent: 'space-around' }}>
      { props.skills.map((skill, index) => (
        <Skill key={index} {...skill} />
      ))}
    </Stack>
  </Container>
  );
};
