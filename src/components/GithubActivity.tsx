import React from 'react';

import { Box, Card, CardActionArea, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

import { alpha, elevation, ocean } from '../theme';
import type { GithubActivityData } from '../service';
import { NewTabNote } from './NewTabNote';

interface GithubActivityProps {
  /** null は取得中、undefined は取得失敗。 */
  activity: GithubActivityData | null | undefined;
}

const grid = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(300px, 1fr))' },
  gap: 2.5,
};

/** 件数を 5 段階の濃さに丸める（0 は無色）。 */
const level = (count: number, max: number) => (count === 0 || max === 0 ? 0 : Math.min(4, Math.ceil((count / max) * 4)));

/** ピン留めリポジトリと直近のコントリビューション。 */
export const GithubActivity: React.FC<GithubActivityProps> = ({ activity }) => {
  if (activity === null) {
    return (
      <Box sx={grid} aria-busy>
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i}>
            <CardContent sx={{ p: 2.5 }}>
              <Skeleton width="50%" />
              <Skeleton />
              <Skeleton width="30%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (!activity) {
    return <Typography role="status" sx={{ color: 'text.secondary' }}>GitHub の活動を取得できませんでした。</Typography>;
  }

  const { pinned, contributions } = activity;
  const max = Math.max(0, ...contributions.days.map((d) => d.count));
  // 先頭の日の曜日（日曜 = 0）に合わせて、週ごとの列に揃える。
  const firstWeekday = contributions.days.length > 0 ? new Date(`${contributions.days[0].date}T00:00:00Z`).getUTCDay() : 0;

  return (
    <>
      <Box sx={grid}>
        {pinned.map((repo) => (
          <Card
            key={repo.url}
            sx={{
              height: '100%',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: elevation.lifted, borderColor: alpha(ocean.main, 0.3) },
            }}
          >
            <CardActionArea href={repo.url} target="_blank" rel="noopener noreferrer" sx={{ height: '100%', alignItems: 'flex-start' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 600 }}>{repo.name}<NewTabNote /></Typography>
                {repo.description && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', lineHeight: 1.7 }}>{repo.description}</Typography>
                )}
                <Stack direction="row" useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 1.5, gap: 1 }}>
                  {repo.language && <Chip size="small" label={repo.language} sx={{ bgcolor: ocean.main, color: ocean.onMain }} />}
                  <Chip size="small" variant="outlined" icon={<StarIcon />} label={repo.stars} aria-label={`スター ${repo.stars}`} sx={{ color: 'text.secondary' }} />
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {contributions.days.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
            直近 {contributions.days.length} 日間のコントリビューション（過去 1 年間で {contributions.total.toLocaleString('ja-JP')} 件）
          </Typography>
          <Box
            role="img"
            aria-label={`直近 ${contributions.days.length} 日間のコントリビューション`}
            sx={{
              display: 'grid',
              gridTemplateRows: 'repeat(7, 12px)',
              gridAutoFlow: 'column',
              gridAutoColumns: '12px',
              gap: '3px',
              overflowX: 'auto',
              pb: 1,
            }}
          >
            {contributions.days.map((day, i) => {
              const l = level(day.count, max);
              return (
                <Box
                  key={day.date}
                  title={`${day.date}: ${day.count}`}
                  sx={{
                    borderRadius: '2px',
                    bgcolor: l === 0 ? alpha(ocean.main, 0.08) : alpha(ocean.main, 0.25 + l * 0.18),
                    ...(i === 0 && { gridRowStart: firstWeekday + 1 }),
                  }}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
};
