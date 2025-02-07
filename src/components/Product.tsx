import React from 'react';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  useMediaQuery,
} from '@mui/material';

export interface ProductProps {
  title: string;
  description: string;
  url: {
    github: string;
    product: string;
  };
  skills: string[];
}

export const Product: React.FC<ProductProps> = (props) => {
  const isPC = useMediaQuery("(min-width:768px)");
  return (
    <Card sx={{
      width: isPC ? '30%' : '100%', 
      marginTop: 2, 
      padding: 1 
    }}>
      <CardMedia
        component='img'
        height='150px'
        image={require('../images/same.png')}
        alt={ props.title }
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          { props.title }
        </Typography>
        <Typography variant="body2">
          { props.description }
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          {props.skills.map((skill, index) => (
            <Chip label={skill} sx={{ marginRight: 1, marginTop: 1 }} />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ marginBottom: 1, paddingX: 2 }} >
        <Button variant="contained" size="small" href={props.url.github} target='blank'>Github</Button>
        <Button variant="contained" size="small" href={props.url.product} target='blank'>Product</Button>
      </CardActions>
    </Card>
  );
}
