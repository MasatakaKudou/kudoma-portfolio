import React, { useState } from 'react';

import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { ocean } from '../theme';
import { TaggedArticle } from '../types';
import { Blog, BlogSkeleton, TAG_COLORS } from './Blog';

const INITIAL_COUNT = 6;
const STEP = 6;
const SKELETON_COUNT = 6;
const ALL = 'すべて';

const grid = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(300px, 1fr))' },
  gap: 2.5,
};

interface BlogListProps {
  /** null は取得中。 */
  articles: TaggedArticle[] | null;
}

/** 媒体フィルタ・「もっと見る」付きの記事一覧。 */
export const BlogList: React.FC<BlogListProps> = ({ articles }) => {
  const [filter, setFilter] = useState<string>(ALL);
  const [visible, setVisible] = useState(INITIAL_COUNT);

  if (!articles) {
    return (
      <Box sx={grid} aria-busy>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <BlogSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (articles.length === 0) {
    return (
      <Container disableGutters>
        <Typography role="status" sx={{ color: alpha(ocean.deep, 0.7) }}>記事を取得できませんでした。</Typography>
      </Container>
    );
  }

  const tags = Object.keys(TAG_COLORS);
  const counts: Record<string, number> = { [ALL]: articles.length };
  tags.forEach((tag) => {
    counts[tag] = articles.filter((a) => a.tag === tag).length;
  });
  const filtered = filter === ALL ? articles : articles.filter((a) => a.tag === filter);
  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  const select = (next: string) => {
    setFilter(next);
    setVisible(INITIAL_COUNT);
  };

  return (
    <>
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        role="group"
        aria-label="媒体で絞り込む"
        sx={{ gap: 1, mb: 3 }}
      >
        {[ALL, ...tags].map((tag) => {
          const selected = filter === tag;
          const color = TAG_COLORS[tag] ?? ocean.main;
          return (
            <Chip
              key={tag}
              label={`${tag} (${counts[tag]})`}
              clickable
              disabled={counts[tag] === 0}
              aria-pressed={selected}
              onClick={() => select(tag)}
              variant={selected ? 'filled' : 'outlined'}
              sx={
                selected
                  ? { bgcolor: color, color: '#fff', '&:hover, &.Mui-focusVisible': { bgcolor: color } }
                  : { borderColor: color, color: 'text.primary' }
              }
            />
          );
        })}
      </Stack>
      <Box sx={grid}>
        {shown.map((article) => (
          <Blog key={article.url} {...article} />
        ))}
      </Box>
      {remaining > 0 && (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="outlined" onClick={() => setVisible((v) => v + STEP)}>
            もっと見る（残り {remaining} 件）
          </Button>
        </Box>
      )}
    </>
  );
};
