import React from 'react';

import {
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from '@mui/material';

export interface ProductProps {
  title: string;
}

export const Product: React.FC<ProductProps> = (props) => {
  return (
    <Card sx={{ maxWidth: 345, marginTop: 2 }}>
      <CardActionArea>
        <CardMedia
          component='img'
          height='150px'
          image={require('../../src/images/same2.png')}
          alt={ props.title }
          // sx={{ padding: 2 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { props.title }
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
