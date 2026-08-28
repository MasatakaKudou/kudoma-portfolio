import React from 'react';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { GitHub as GitHubIcon, Launch as LaunchIcon } from '@mui/icons-material';

import { Same } from '.';
import { elevation, ocean } from '../theme';

export interface ProductProps {
  title: string;
  description: string;
  url: {
    github?: string;
    product: string;
  };
  skills: string[];
}

export const Product: React.FC<ProductProps> = ({ title, description, url, skills }) => (
  <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      '&:hover': { transform: 'translateY(-6px)', boxShadow: elevation.lifted, borderColor: alpha(ocean.main, 0.3) },
    }}
  >
    {/* サメを引き伸ばさず、海のグラデーション面に泳がせて見出し代わりにする。 */}
    <Box
      aria-hidden
      sx={{
        display: 'grid',
        placeItems: 'center',
        height: 132,
        background: `linear-gradient(135deg, ${alpha(ocean.shallow, 0.45)}, ${alpha(ocean.light, 0.22)})`,
        borderBottom: `1px solid ${alpha(ocean.main, 0.1)}`,
      }}
    >
      <Same size={92} />
    </Box>

    <CardContent sx={{ flex: 1, p: 3 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
      <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: 1, mt: 2.5 }}>
        {skills.map((skill) => (
          <Chip
            key={skill}
            size="small"
            variant="outlined"
            label={skill}
            sx={{ color: ocean.main, bgcolor: alpha(ocean.foam, 0.55) }}
          />
        ))}
      </Stack>
    </CardContent>

    <CardActions sx={{ px: 3, pb: 3, pt: 0, gap: 1 }}>
      {url.github && (
        <Button
          variant="outlined"
          size="small"
          startIcon={<GitHubIcon />}
          href={url.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Button>
      )}
      <Button
        variant="contained"
        size="small"
        endIcon={<LaunchIcon />}
        href={url.product}
        target="_blank"
        rel="noopener noreferrer"
      >
        Product
      </Button>
    </CardActions>
  </Card>
);
