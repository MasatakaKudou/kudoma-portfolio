import React from 'react';

import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '../theme';

import { elevation, ocean } from '../theme';
import { NewTabNote } from './NewTabNote';

export interface BlogProps {
  updatedAt: string;
  title: string;
  url: string;
  tag: string;
  likes?: number;
  thumbnail?: string;
  excerpt?: string;
}

/** 媒体ごとのブランドカラー。未知のタグはブランドカラーにフォールバックする。 */
export const TAG_COLORS: Record<string, string> = {
  Qiita: '#55C500',
  Zenn: '#3EA8FF',
  Kudoma: '#E53935',
};

export const Blog: React.FC<BlogProps> = ({ updatedAt, title, url, tag, likes, thumbnail, excerpt }) => (
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
      {thumbnail && (
        <CardMedia component="img" image={thumbnail} alt="" loading="lazy" sx={{ height: 140, objectFit: 'cover' }} />
      )}
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: 1 }}>
          <Chip
            size="small"
            label={tag}
            sx={{ bgcolor: TAG_COLORS[tag] ?? ocean.main, color: TAG_COLORS[tag] ? '#fff' : ocean.onMain }}
          />
          <Chip
            size="small"
            variant="outlined"
            label={`${new Date(updatedAt).toLocaleDateString('ja-JP')} 更新`}
            sx={{ color: 'text.secondary' }}
          />
          {likes !== undefined && (
            <Chip
              size="small"
              variant="outlined"
              label={`♥ ${likes}`}
              aria-label={`いいね ${likes} 件`}
              sx={{ color: 'text.secondary' }}
            />
          )}
        </Stack>
        <Typography sx={{ mt: 1.5, fontWeight: 600, lineHeight: 1.7 }}>{title}<NewTabNote /></Typography>
        {excerpt && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {excerpt}
          </Typography>
        )}
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
