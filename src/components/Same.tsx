import React, { useEffect, useRef, useState } from 'react';

import { Box, keyframes, useMediaQuery } from '@mui/material';

import same from '../images/same.png';

interface SameProps {
  size?: number;
  /** true の場合、スクロールで揺れ、クリックでジャンプする。 */
  interactive?: boolean;
}

const jump = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  40% { transform: translateY(-28px) rotate(-12deg); }
  70% { transform: translateY(0) rotate(8deg); }
  100% { transform: translateY(0) rotate(0deg); }
`;

/** スクロール量に応じた傾き（度）。±MAX_TILT の範囲で往復する。 */
const MAX_TILT = 14;
const tiltFor = (scrollY: number) => Math.sin(scrollY / 80) * MAX_TILT;

/** マスコットのサメ。装飾用途なので代替テキストは持たせない。 */
export const Same: React.FC<SameProps> = ({ size = 60, interactive = false }) => {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const enabled = interactive && !reducedMotion;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [jumping, setJumping] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!enabled || !el) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.transform = `rotate(${tiltFor(window.scrollY)}deg)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // 初回表示では傾けない（scrollY の読み取りが強制レイアウトを起こし、初期描画を重くするため）。
    // スクロール位置の復元はスクロールイベントとして届くので、そこで傾きが反映される。
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = '';
    };
  }, [enabled]);

  const image = (
    <Box
      component="img"
      src={same}
      alt=""
      aria-hidden
      width={360}
      height={360}
      onClick={enabled ? () => setJumping(true) : undefined}
      onAnimationEnd={() => setJumping(false)}
      sx={{
        width: size,
        height: 'auto',
        display: 'block',
        ...(enabled && {
          cursor: 'pointer',
          animation: jumping ? `${jump} 0.6s ease-out` : 'none',
        }),
      }}
    />
  );

  if (!interactive) return image;

  return (
    <Box ref={wrapperRef} sx={{ display: 'inline-block', lineHeight: 0, transition: 'transform 0.15s linear' }}>
      {image}
    </Box>
  );
};
