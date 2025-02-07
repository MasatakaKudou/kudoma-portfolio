import React from 'react';

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Typography,
} from '@mui/material';

export interface ProductProps {
  title: string;
  description: string;
  skills: string[];
}

export const Product: React.FC<ProductProps> = (props) => {
  return (
    <Card sx={{ maxWidth: 300, marginTop: 2 }}>
      <CardActionArea>
        <CardMedia
          component='img'
          height='150px'
          image={require('../images/same.png')}
          alt={ props.title }
          sx={{ padding: 2 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { props.title }
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            { props.description }
          </Typography>
          <Box marginTop={1}>
            {props.skills.map((skill, index) => (
              <Chip label={skill} sx={{ marginRight: 1, marginBottom: 1 }} />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
