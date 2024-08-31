import React from 'react';
import { 
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

export interface ExperienceProps {
  title: string;
  period: string;
  tasks: string[];
  languages: string[];
}

export const Experience: React.FC<ExperienceProps> = (props) => {
  return (
    <Container sx={{ marginTop: 1 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <Typography variant='h5'>{ props.title }</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant='h6' sx={{ borderBottom: 1, marginBottom: 1 }}>期間</Typography>
          <Container>
            { props.period }
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, marginTop: 2, marginBottom: 1 }}>担当業務</Typography>
          <Container>
            { props.tasks.map((task, index) => (
              <div key={index}>{ task }</div>
            ))}
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, marginTop: 2, marginBottom: 1 }}>使用技術</Typography>
          <Container>
            { props.languages.map((language, index) => (
              <div key={index}>{ language }</div>
            ))}
          </Container>
        </AccordionDetails>
      </Accordion>
    </Container>
  );
};
