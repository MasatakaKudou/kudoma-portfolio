import React from 'react';
import { Typography, Rating } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhishingIcon from '@mui/icons-material/Phishing';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

interface SkillProps {
  name?: string;
  description?: string;
  rating: number;
}

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const Skill: React.FC<SkillProps> = ({ name, description, rating }) => {
  return (
    <Box>
      { name && (<Typography>{name}</Typography>) }
      <Stack direction='row' sx={{ marginTop: 0.5 }}>
        <StyledRating
          name="customized-color"
          value={rating}
          icon={<PhishingIcon fontSize="inherit" />}
          emptyIcon={<PhishingIcon fontSize="inherit" />}
          sx={{ color: 'primary.main' }}
          readOnly
        />
        { description && (<Typography>{description}</Typography>) }
      </Stack>
    </Box>
  );
};
  
  export default Skill;
