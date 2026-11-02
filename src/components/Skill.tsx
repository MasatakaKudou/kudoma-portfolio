import React from 'react';

import { Box, Rating, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '../theme';
import PhishingIcon from '@mui/icons-material/Phishing';

import { ocean } from '../theme';

interface SkillProps {
  name?: string;
  description?: string;
  rating: number;
}

const HookRating = styled(Rating)({
  color: ocean.main,
  fontSize: '1.35rem',
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': { color: alpha(ocean.main, 0.2) },
});

const hooks = (rating: number) => (
  <HookRating
    value={rating}
    icon={<PhishingIcon fontSize="inherit" />}
    emptyIcon={<PhishingIcon fontSize="inherit" />}
    readOnly
  />
);

/**
 * スキル1件。`name` 指定時はスキル行（名前 → 釣り針）、
 * `description` 指定時は凡例行（釣り針 → 説明）としてレイアウトする。
 */
export const Skill: React.FC<SkillProps> = ({ name, description, rating }) => {
  if (description) {
    return (
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.75 }}>
        <Box sx={{ minWidth: 132 }}>{hooks(rating)}</Box>
        <Typography variant="body2">{description}</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        py: 1.25,
        borderBottom: `1px solid ${alpha(ocean.main, 0.08)}`,
      }}
    >
      <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
      {hooks(rating)}
    </Stack>
  );
};
