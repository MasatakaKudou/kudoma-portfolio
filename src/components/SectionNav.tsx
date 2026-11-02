import React, { useEffect, useState } from 'react';

import { Box, Container } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { ocean } from '../theme';

export interface SectionNavItem {
  /** 対応する Section の id。 */
  id: string;
  label: string;
}

interface SectionNavProps {
  items: SectionNavItem[];
}

/** ナビの高さ。Section の scrollMarginTop が参照し、ジャンプ先が隠れないようにする。 */
export const NAV_HEIGHT = 56;

/** 現在表示中のセクションを返す。画面の中央付近を横切っているものを「現在地」とみなす。 */
const useActiveSection = (ids: string[]) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
};

/** スクロールに追従するセクションナビ。モバイルでは横スクロールで収める。 */
export const SectionNav: React.FC<SectionNavProps> = ({ items }) => {
  const active = useActiveSection(items.map((item) => item.id));

  return (
    <Box
      component="nav"
      aria-label="セクション"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        height: NAV_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        bgcolor: alpha('#ffffff', 0.78),
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(ocean.main, 0.14)}`,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          gap: 0.5,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <Box
              key={id}
              component="a"
              href={`#${id}`}
              aria-current={isActive ? 'location' : undefined}
              sx={{
                flexShrink: 0,
                px: 1.75,
                py: 0.75,
                borderRadius: 999,
                fontWeight: 700,
                fontSize: '.9rem',
                letterSpacing: '.04em',
                color: isActive ? '#ffffff' : alpha(ocean.deep, 0.78),
                bgcolor: isActive ? ocean.main : 'transparent',
                textDecoration: 'none',
                transition: 'background-color .2s ease, color .2s ease',
                '&:hover': { bgcolor: isActive ? ocean.main : alpha(ocean.main, 0.1) },
              }}
            >
              {label}
            </Box>
          );
        })}
      </Container>
    </Box>
  );
};
