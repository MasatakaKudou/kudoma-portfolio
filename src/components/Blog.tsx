import React from 'react';

import {
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
  Typography,
} from '@mui/material';

export interface BlogProps {
  updatedAt: string;
  title: string;
  url: string;
  tag: string;
}

export const Blog: React.FC<BlogProps> = ({ updatedAt, title, url, tag }) => {
  const updatedDate = new Date(updatedAt);
  return (
    <Card sx={{ maxWidth: 345, marginTop: 2 }}>
      <CardActionArea href={ url }>
        <CardContent>
          <Stack direction='row' flexWrap='wrap'>
            <Chip label={ tag } sx={{ marginRight: 1 }} />
            <Chip label={ updatedDate.toLocaleDateString() + ' 更新' } />
          </Stack>
          <Typography sx={{ marginTop: 1 }}>
            { title }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
