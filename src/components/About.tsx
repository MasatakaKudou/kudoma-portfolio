import React from 'react';
import { Helmet } from 'react-helmet';

import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { AccountLogo } from '.';
import { MediumHeading } from '../fonts';
import { githubIcon, meImage, qiitaIcon, sdIcon, zennIcon } from '../images';
import { elevation, ocean } from '../theme';

const accounts = [
  { name: 'Zenn', src: zennIcon, url: 'https://zenn.dev/tuna0210' },
  { name: 'Qiita', src: qiitaIcon, url: 'https://qiita.com/kudoma' },
  { name: 'Speaker Deck', src: sdIcon, url: 'https://speakerdeck.com/kudoma' },
  { name: 'GitHub', src: githubIcon, url: 'https://github.com/MasatakaKudou' },
];

const profile = [
  '青森県出身のエンジニア。',
  '大学2年時に、ハッカソンに参加し、何もできなかったことが悔しく、プログラミングを自主的に学び始める。',
  'その後、アルバイトでHPやWebAPの開発を経験し、エンジニアになることを決意。',
  '大学卒業後、化粧品・美容の総合情報サイトを運営する会社に入社し、エンジニアとして働く。',
  '趣味は海釣り、アニメ鑑賞。',
];

export const About = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 5fr) minmax(0, 7fr)' },
      gap: { xs: 4, md: 6 },
      alignItems: 'start',
    }}
  >
    <Helmet>
      <link rel="preload" as="image" href={meImage} />
    </Helmet>

    {/* 写真は角丸フレーム＋背面のアクセント面で「置いただけ」に見えないようにする。 */}
    <Box sx={{ position: 'relative', maxWidth: 420, width: '100%', mx: { xs: 'auto', md: 0 } }}>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          transform: 'translate(14px, 14px)',
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(ocean.mid, 0.35)}, ${alpha(ocean.shallow, 0.2)})`,
        }}
      />
      <Box
        component="img"
        src={meImage}
        alt="堤防で釣りの仕掛けを準備している様子"
        width={900}
        height={900}
        sx={{
          position: 'relative',
          display: 'block',
          width: '100%',
          aspectRatio: '1 / 1',
          objectFit: 'cover',
          borderRadius: 4,
          boxShadow: elevation.lifted,
          border: `1px solid ${alpha('#ffffff', 0.9)}`,
        }}
      />
    </Box>

    <Box>
      <MediumHeading title="自己紹介" underline />
      <Box component="p" sx={{ m: 0 }}>
        {profile.map((line) => (
          <Typography key={line} component="span" sx={{ display: 'block' }}>
            {line}
          </Typography>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <MediumHeading title="アカウント" underline />
        <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: 1.5 }}>
          {accounts.map((account) => (
            <AccountLogo key={account.name} {...account} />
          ))}
        </Stack>
      </Box>
    </Box>
  </Box>
);
