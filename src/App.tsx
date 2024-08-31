import Skill from './Skill';
import {
  Skills,
  SkillsProps,
} from './Skills';
import AccountLogo from './AccountLogo';
import {
  Experience,
  ExperienceProps,
 } from './Experience';

import { Container, Typography, Stack, Divider } from '@mui/material';
import Image from 'mui-image';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import meLogo from './images/me.jpg';
import zennIcon from './images/zenn-icon.svg';
import qiitaIcon from './images/qiita-icon.png';
import sdIcon from './images/sd-icon.png';
import githubIcon from './images/github-icon.png';

import Same from './Same';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0077be', // 海の青をイメージ
    },
    secondary: {
      main: '#00aaff', // 水色
    },
    background: {
      default: '#e0f7fa', // 水面の明るさをイメージ
      paper: '#ffffff', // 波打ち際の泡のような色
    },
    text: {
      primary: '#004d66', // 濃い青
      secondary: '#0077be', // 海の青に合わせた色
    },
  },
});

const experiences: ExperienceProps[] = [
  {
    title: 'SSRとパフォーマンス向上によるSEO向上',
    period: '2021/11 ~ 2022/10（12ヶ月間）',
    tasks: [
      'APIエンドポイント設計',
      'コードリーディングして仕様書の作成',
      '言語リプレイス',
      'API構築',
      'ユニットテスト実装',
      'Vuexなどの軽い実装',
      'パフォーマンステスト',
      '結合テスト',
    ],
    languages: [
      'PHP',
      'JavaScript',
      'TypeScript',
      'Node.js',
      'Express.js',
      'Vue.js',
      'Nuxt.js',
      'SQLServer',
      'k6',
    ],
  },
  {
    title: 'システム運用',
    period: '2022/11 ~ 2023/04（6ヶ月間）',
    tasks: [
      'チケットの認識合わせ',
      'リファクタリング',
      '障害の報告/原因追及/復旧',
      'チケット対応',
      '└ ライブラリのバージョンアップ',
      '└ etc...',
    ],
    languages: [
      'PHP',
      'Laravel',
      'SQLServer',
    ],
  },
  {
    title: 'CMSをAWSへ移行',
    period: '2023/05 ~ 2024/04（12ヶ月間）',
    tasks: [
      'AWSアーキテクチャ設計',
      'AWS移行',
      '└ Webアプリ x2',
      '└ API x1',
      '└ バッチ x1',
      'プロジェクト管理',
      '仕様書の作成',
      'AWS上で機能するように実装修正',
      'AWSリソースの構築を自動化（IaC）',
      'OS/ミドルウェアの構築を自動化（IaC）',
      '保守/ノウハウ共有用ドキュメントの作成',
      'パフォーマンステスト',
      'オンプレのリソース削除',
    ],
    languages: [
      'PHP',
      'JavaScript',
      'Laravel',
      'SQLServer',
      'MySQL',
      'Terraform',
      'Ansible',
      'AWS',
    ],
  },
  {
    title: '生成バッチをAWSへ移行',
    period: '2024/05 ~ 2024/09（5ヶ月間）',
    tasks: [
      'AWSアーキテクチャ設計',
      'AWS移行',
      'プロジェクト管理',
      'ピープルマネジメント',
      'テスト仕様書の作成',
      'AWS上で機能するように実装修正',
      'AWSリソースの構築を自動化（IaC）',
      '保守/ノウハウ共有用ドキュメントの作成',
      'オンプレのリソース削除',
    ],
    languages: [
      'PHP',
      'Laravel',
      'Terraform',
      'AWS',
      'Docker',
    ],
  },
];

const skills: SkillsProps[] = [
  {
    area: 'フロントエンド',
    skills: [
      { name: 'HTML', rating: 2 },
      { name: 'JavaScript', rating: 3 },
      { name: 'Vue.js', rating: 2 },
      { name: 'Nuxt.js', rating: 2 },
      { name: 'React.js', rating: 1 },
      { name: 'CSS', rating: 1 },
    ]
  },
  {
    area: 'バックエンド',
    skills: [
      { name: 'TypeScript', rating: 3 },
      { name: 'Node.js', rating: 2 },
      { name: 'Express.js', rating: 2 },
      { name: 'PHP', rating: 3 },
      { name: 'Laravel', rating: 3 },
      { name: 'MySQL', rating: 1 },
      { name: 'SQLServer', rating: 1 },
    ]
  },
  {
    area: 'インフラ',
    skills: [
      { name: 'AWS', rating: 3 },
      { name: 'Terraform', rating: 3 },
      { name: 'Ansible', rating: 2 },
      { name: 'Docker', rating: 2 },
    ]
  },
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ marginY: 3 }}>
        <Stack direction='row' alignItems='center'>
          <Typography variant='h2' color={ theme.palette.text.secondary } sx={{ marginRight: 1 }}>Kudoma</Typography>
          <Same />
        </Stack>
        <Stack direction='row' alignItems='center'>
          <Same />
          <Typography variant='h2' color={ theme.palette.text.secondary } sx={{ marginLeft: 1 }}>Portfolio</Typography>
        </Stack>
        <Typography variant='h3' sx={{ marginTop: 5 }}>About</Typography>
        <Container sx={{ marginTop: 2 }}>
          <Image src={meLogo} />
          <Typography variant='h5' sx={{ borderBottom: 1, marginTop: 2, marginBottom: 1 }} >自己紹介</Typography>
          <Typography>
            青森県出身のエンジニア。<br />
            大学2年時に、ハッカソンに参加し、何もできなかったことが悔しく、プログラミングを自主的に学び始める。<br />
            その後、アルバイトでHPやWebAPの開発を経験し、エンジニアになることを決意。<br />
            大学卒業後、化粧品・美容の総合情報サイトを運営する会社に入社し、エンジニアとして働く。<br />
            趣味は海釣り、アニメ鑑賞。
          </Typography>
          <Typography variant='h5' sx={{ borderBottom: 1, marginTop: 2, marginBottom: 1 }}>アカウント</Typography>
          <Stack direction='row' useFlexGap flexWrap='wrap'>
            <AccountLogo src={zennIcon} url='https://zenn.dev/tuna0210' name='zenn-icon' />
            <AccountLogo src={qiitaIcon} url='https://qiita.com/kudoma' name="qiita-icon" />
            <AccountLogo src={sdIcon} url='https://speakerdeck.com/kudoma' name="speakerdeck-icon" />
            <AccountLogo src={githubIcon} url='https://github.com/MasatakaKudou' name="github-icon" />
          </Stack>
        </Container>
        <Typography variant='h3' sx={{ marginTop: 5 }}>Skills</Typography>
        <Container sx={{ marginY: 2 }}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Stack direction='row'>
                <InfoIcon sx={{ marginRight: 1 }} />
                <Typography>スキルレベルの基準</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Skill rating={1} description='具体的なゴールと学習対象、壁打ちが必要' />
              <Skill rating={2} description='具体的なゴールと壁打ちが必要' />
              <Skill rating={3} description='大まかなゴールと壁打ちが必要' />
              <Skill rating={4} description='大まかなゴールが必要' />
              <Skill rating={5} description='自走' />
            </AccordionDetails>
          </Accordion>
        </Container>
        {skills.map((skill, index) => (
          <Skills key={index} {...skill} />
        ))}
        <Typography variant='h3' sx={{ marginTop: 5 }}>Experiences</Typography>
        {experiences.map((experience, index) => (
          <Experience key={index} {...experience} />
        ))}
        <Divider sx={{ marginTop: 5, borderColor: 'primary.main' }} />
        <Typography color={ theme.palette.text.secondary } sx={{ marginTop: 1, textAlign: 'center' }}>Kudoma Portfolio</Typography>
      </Container>
    </ThemeProvider>
  );
}

export default App;
