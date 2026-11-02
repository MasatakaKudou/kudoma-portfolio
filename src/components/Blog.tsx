import React from 'react';

import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import { elevation, ocean } from '../theme';
import { NewTabNote } from './NewTabNote';

export interface BlogProps {
  updatedAt: string;
  title: string;
  url: string;
  tag: string;
}

/** 媒体ごとのブランドカラー。未知のタグはブランドカラーにフォールバックする。 */
export const TAG_COLORS: Record<string, string> = {
  Qiita: '#55C500',
  Zenn: '#3EA8FF',
  Kudoma: '#E53935',
};

export const Blog: React.FC<BlogProps> = ({ updatedAt, title, url, tag }) => (
  <Card
    sx={{
      height: '100%',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: elevation.lifted, borderColor: alpha(ocean.main, 0.3) },
    }}
  >
    <CardActionArea
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ height: '100%', alignItems: 'flex-start' }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: 1 }}>
          <Chip
            size="small"
            label={tag}
            sx={{ bgcolor: TAG_COLORS[tag] ?? ocean.main, color: '#fff' }}
          />
          <Chip
            size="small"
            variant="outlined"
            label={`${new Date(updatedAt).toLocaleDateString('ja-JP')} 更新`}
            sx={{ color: 'text.secondary' }}
          />
        </Stack>
        <Typography sx={{ mt: 1.5, fontWeight: 600, lineHeight: 1.7 }}>{title}<NewTabNote /></Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

/** 取得待ちのプレースホルダ。カード高さを保ってレイアウトの飛びを防ぐ。 */
export const BlogSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Skeleton variant="rounded" width={64} height={24} />
        <Skeleton variant="rounded" width={104} height={24} />
      </Stack>
      <Skeleton sx={{ mt: 1.5 }} />
      <Skeleton width="70%" />
    </CardContent>
  </Card>
);
