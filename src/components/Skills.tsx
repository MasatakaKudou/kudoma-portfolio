import React from 'react';

import { Box, Card, CardContent } from '@mui/material';

import { Skill } from '.';
import { MediumHeading } from '../fonts';

export interface SkillsProps {
  area: string;
  skills: {
    name: string;
    rating: number;
  }[];
}

/** 領域ごとのスキル一覧。カード内2カラムで名前と評価を揃える。 */
export const Skills: React.FC<SkillsProps> = ({ area, skills }) => (
  <Card sx={{ mb: 2.5 }}>
    <CardContent sx={{ p: { xs: 2.5, md: 3 }, '&:last-child': { pb: { xs: 2.5, md: 3 } } }}>
      <MediumHeading title={area} underline />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          columnGap: 5,
        }}
      >
        {skills.map((skill) => (
          <Skill key={skill.name} {...skill} />
        ))}
      </Box>
    </CardContent>
  </Card>
);
