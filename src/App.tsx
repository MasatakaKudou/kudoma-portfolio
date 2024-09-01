import Skill from './components/Skill';
import AccountLogo from './components/AccountLogo';
import SiteLogo from './components/SiteLogo';
import MainHeading from './components/fonts/MainHeading';
import MediumHeading from './components/fonts/MediumHeading';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';

import { experiences } from './data/experiences';
import { skills } from './data/skills';
import { products } from './data/products';

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
  components: {
    MuiTypography: {
      styleOverrides: {
        h2: {
          color: '#00aaff',
        }
      }
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ marginY: 3 }}>
        <SiteLogo />
        <MainHeading title='About' />
        <Container sx={{ marginTop: 2 }}>
          <Image src={meLogo} />
          <MediumHeading title='自己紹介' underline />
          <Typography>
            青森県出身のエンジニア。<br />
            大学2年時に、ハッカソンに参加し、何もできなかったことが悔しく、プログラミングを自主的に学び始める。<br />
            その後、アルバイトでHPやWebAPの開発を経験し、エンジニアになることを決意。<br />
            大学卒業後、化粧品・美容の総合情報サイトを運営する会社に入社し、エンジニアとして働く。<br />
            趣味は海釣り、アニメ鑑賞。
          </Typography>
          <MediumHeading title='アカウント' underline />
          <Stack direction='row' useFlexGap flexWrap='wrap'>
            <AccountLogo src={zennIcon} url='https://zenn.dev/tuna0210' name='zenn-icon' />
            <AccountLogo src={qiitaIcon} url='https://qiita.com/kudoma' name="qiita-icon" />
            <AccountLogo src={sdIcon} url='https://speakerdeck.com/kudoma' name="speakerdeck-icon" />
            <AccountLogo src={githubIcon} url='https://github.com/MasatakaKudou' name="github-icon" />
          </Stack>
        </Container>
        <MainHeading title='Skills' />
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
        <MainHeading title='Experiences' />
        {experiences.map((experience, index) => (
          <Experience key={index} {...experience} />
        ))}
        {/* <MainHeading title='Products' />
        <Container>
          {products.map((product, index) => (
            <Product key={index} {...product} />
          ))}
        </Container> */}
        <Divider sx={{ marginTop: 5, borderColor: 'primary.main' }} />
        <Typography color={ theme.palette.text.secondary } sx={{ marginTop: 1, textAlign: 'center' }}>Kudoma Portfolio</Typography>
      </Container>
    </ThemeProvider>
  );
}

export default App;
