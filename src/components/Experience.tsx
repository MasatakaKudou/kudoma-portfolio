import React from 'react';

import MediumHeading from './fonts/MediumHeading';
import SmallHeading from './fonts/SmallHeading';

import { 
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
    <Container sx={{ marginTop: 2 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <MediumHeading title={props.title} />
        </AccordionSummary>
        <AccordionDetails>
          <SmallHeading title='期間' firstElement />
          <Container>
            { props.period }
          </Container>
          <SmallHeading title='担当業務' />
          <Container>
            { props.tasks.map((task, index) => (
              <div key={index}>{ task }</div>
            ))}
          </Container>
          <SmallHeading title='使用技術' />
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
