import React from 'react';

import Skill from './Skill';
import MediumHeading from './MediumHeading';

import { 
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
      <MediumHeading title={props.area} underline />
      <Stack direction='row' flexWrap='wrap' sx={{ justifyContent: 'space-around' }}>
        { props.skills.map((skill, index) => (
          <Skill key={index} {...skill} />
        ))}
      </Stack>
    </Container>
  );
};
