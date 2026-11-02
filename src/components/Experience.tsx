import React from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '../theme';
import { CalendarMonth as CalendarIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import { SmallHeading } from '../fonts';
import { ocean } from '../theme';

export interface ExperienceProps {
  title: string;
  period: string;
  tasks: string[];
  languages: string[];
}

/** 「└ 」始まりのタスクは前項目のぶら下がりとして一段下げる。 */
const SUB_TASK_PREFIX = '└ ';

export const Experience: React.FC<ExperienceProps> = ({ title, period, tasks, languages }) => (
  <Accordion sx={{ mb: 1.5 }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{ width: '100%', pr: 2 }}
      >
        <Typography variant="h5" component="h3" sx={{ color: ocean.deep, flex: 1 }}>
          {title}
        </Typography>
        <Chip
          size="small"
          variant="outlined"
          icon={<CalendarIcon />}
          label={period}
          sx={{ color: ocean.main, bgcolor: alpha(ocean.foam, 0.7), flexShrink: 0 }}
        />
      </Stack>
    </AccordionSummary>

    <AccordionDetails>
      <SmallHeading title="担当業務" firstElement />
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
        {tasks.map((task, index) => {
          const isSubTask = task.startsWith(SUB_TASK_PREFIX);
          const dot = isSubTask ? 4 : 6;
          return (
            <Typography
              key={`${index}-${task}`}
              component="li"
              variant="body2"
              sx={{
                position: 'relative',
                pl: 2.25,
                ml: isSubTask ? 3 : 0,
                py: 0.4,
                // 点は擬似要素にして、行送りに追従させる（.9em = body2 の1行目中央）。
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: `calc(.9em - ${dot / 2}px)`,
                  width: dot,
                  height: dot,
                  borderRadius: '50%',
                  backgroundColor: alpha(ocean.main, isSubTask ? 0.35 : 0.65),
                },
              }}
            >
              {isSubTask ? task.slice(SUB_TASK_PREFIX.length) : task}
            </Typography>
          );
        })}
      </Box>

      <SmallHeading title="使用技術" />
      <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: 1 }}>
        {languages.map((language) => (
          <Chip
            key={language}
            size="small"
            label={language}
            sx={{ bgcolor: alpha(ocean.main, 0.09), color: ocean.deep }}
          />
        ))}
      </Stack>
    </AccordionDetails>
  </Accordion>
);
