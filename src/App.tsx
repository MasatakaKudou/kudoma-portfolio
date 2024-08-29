import Skill from './Skill'
import AccountLogo from './AccountLogo';
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
  // palette: {
  //   mode: 'dark',
  // }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ marginY: 3 }}>
        <Stack direction='row' alignItems='center'>
          <Typography variant='h2' color={ theme.palette.primary.main } sx={{ marginRight: 1 }}>Kudoma</Typography>
          <Same />
        </Stack>
        <Stack direction='row' alignItems='center'>
          <Same />
          <Typography variant='h2' sx={{ marginLeft: 1 }}>Portfolio</Typography>
        </Stack>
        <Typography variant='h3' color={theme.palette.primary.main} sx={{ marginTop: 5 }}>About</Typography>
        <Container sx={{ marginTop: 2 }}>
          <Image src={meLogo} />
          <Typography variant='h4' sx={{ marginTop: 2 }}>Intro</Typography>
          <Typography>
            青森県出身のエンジニア。<br />
            大学2年時に、ハッカソンに参加し、何もできなかったことが悔しく、プログラミングを自主的に学び始める。<br />
            その後、アルバイトでHPやWebAPの開発を経験し、エンジニアになることを決意。<br />
            大学卒業後、化粧品・美容の総合情報サイトを運営する会社に入社し、エンジニアとして働く。<br />
            趣味は海釣り、アニメ鑑賞。
          </Typography>
          <Typography variant='h4' sx={{ marginTop: 2 }}>Accounts</Typography>
          <Stack direction='row' useFlexGap flexWrap='wrap'>
            <AccountLogo src={zennIcon} url='https://zenn.dev/tuna0210' name='zenn-icon' />
            <AccountLogo src={qiitaIcon} url='https://qiita.com/kudoma' name="qiita-icon" />
            <AccountLogo src={sdIcon} url='https://speakerdeck.com/kudoma' name="speakerdeck-icon" />
            <AccountLogo src={githubIcon} url='https://github.com/MasatakaKudou' name="github-icon" />
          </Stack>
        </Container>
        <Typography variant='h3' color={theme.palette.primary.main} sx={{ marginTop: 5 }}>Skills</Typography>
        <Accordion sx={{ marginY: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Stack direction='row'>
              <InfoIcon sx={{ color: 'primary.main', marginRight: 1 }} />
              <Typography sx={{ color: 'primary.main' }}>スキルレベルの基準</Typography>
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
        <Container>
          <Typography variant='h5' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>フロントエンド</Typography>
          <Stack direction='row' flexWrap='wrap' sx={{ justifyContent: 'space-around' }}>
            <Skill name='HTML' rating={2} />
            <Skill name='JavaScript' rating={2} />
            <Skill name='Vue.js' rating={2} />
            <Skill name='Nuxt.js' rating={2} />
            <Skill name='React.js' rating={1} />
            <Skill name='CSS' rating={1} />
          </Stack>
        </Container>
        <Container>
          <Typography variant='h5' sx={{ borderBottom: 1, borderColor: 'primary.main', marginTop: 2, marginBottom: 1 }}>バックエンド</Typography>
          <Stack direction='row' flexWrap='wrap' sx={{ justifyContent: 'space-around' }}>
            <Skill name='TypeScript' rating={3} />
            <Skill name='Node.js' rating={2} />
            <Skill name='Express.js' rating={2} />
            <Skill name='PHP' rating={3} />
            <Skill name='Laravel' rating={3} />
            <Skill name='MySQL' rating={1} />
            <Skill name='SQLServer' rating={1} />
          </Stack>
        </Container>
        <Container>
          <Typography variant='h5' sx={{ borderBottom: 1, borderColor: 'primary.main', marginTop: 2, marginBottom: 1 }}>インフラ</Typography>
          <Stack direction='row' flexWrap='wrap' sx={{ justifyContent: 'space-around' }}>
            <Skill name='AWS' rating={3} />
            <Skill name='Terraform' rating={2} />
            <Skill name='Ansible' rating={2} />
            <Skill name='Docker' rating={2} />
          </Stack>
        </Container>
        <Typography variant='h3' color={theme.palette.primary.main} sx={{ marginTop: 5 }}>Experiences</Typography>
        <Container sx={{ marginTop: 2 }}>
          <Typography variant='h5' sx={{ marginY: 1, border: 1, borderColor: 'primary.main', borderRadius: '15px' , padding: 1 }}>SSRとパフォーマンス向上によるSEO向上</Typography>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>期間</Typography>
          <Container>
            2021/11 ~ 2022/10（12ヶ月間）
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>担当業務</Typography>
          <Container>
            APIエンドポイント設計<br />
            コードリーディングして仕様書の作成<br />
            言語リプレイス<br />
            API構築<br />
            ユニットテスト実装<br />
            Vuexなどの軽い実装<br />
            パフォーマンステスト<br />
            結合テスト
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>使用技術</Typography>
          <Container>
            PHP<br />
            JavaScript<br />
            TypeScript<br />
            Node.js<br />
            Express.js<br />
            Vue.js<br />
            Nuxt.js<br />
            SQLServer<br />
            k6
          </Container>
        </Container>
        <Container sx={{ marginTop: 2 }}>
          <Typography variant='h5' sx={{ marginY: 1, border: 1, borderColor: 'primary.main', borderRadius: '15px' , padding: 1 }}>システム運用</Typography>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>期間</Typography>
          <Container>
            2022/11 ~ 2023/04（6ヶ月間）
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>担当業務</Typography>
          <Container>
            チケットの認識合わせ<br />
            リファクタリング<br />
            障害の報告/原因追及/復旧<br />
            チケット対応<br />
            └ ライブラリのバージョンアップ<br />
            └ etc...
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>使用技術</Typography>
          <Container>
            PHP<br />
            Laravel<br />
            SQLServer
          </Container>
        </Container>
        <Container sx={{ marginTop: 2 }}>
          <Typography variant='h5' sx={{ marginY: 1, border: 1, borderColor: 'primary.main', borderRadius: '15px' , padding: 1 }}>CMSをAWSへ移行</Typography>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>期間</Typography>
          <Container>
            2023/05 ~ 2024/04（12ヶ月間）
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>担当業務</Typography>
          <Container>
            AWSアーキテクチャ設計<br />
            AWS移行<br />
            └ Webアプリ x2<br />
            └ API x1<br />
            └ バッチ x1<br />
            プロジェクト管理<br />
            仕様書の作成<br />
            AWS上で機能するように実装修正<br />
            AWSリソースの構築を自動化（IaC）<br />
            OS/ミドルウェアの構築を自動化（IaC）<br />
            保守/ノウハウ共有用ドキュメントの作成<br />
            パフォーマンステスト<br />
            オンプレのリソース削除
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>使用技術</Typography>
          <Container>
            PHP<br />
            JavaScript<br />
            Laravel<br />
            SQLServer<br />
            MySQL<br />
            Terraform<br />
            Ansible<br />
            AWS
          </Container>
        </Container>
        <Container sx={{ marginTop: 2 }}>
          <Typography variant='h5' sx={{ marginY: 1, border: 1, borderColor: 'primary.main', borderRadius: '15px' , padding: 1 }}>生成バッチをAWSへ移行</Typography>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>期間</Typography>
          <Container>
            2024/05 ~ 2024/09（5ヶ月間）
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>担当業務</Typography>
          <Container>
            AWSアーキテクチャ設計<br />
            AWS移行<br />
            プロジェクト管理<br />
            ピープルマネジメント<br />
            テスト仕様書の作成<br />
            AWS上で機能するように実装修正<br />
            AWSリソースの構築を自動化（IaC）<br />
            保守/ノウハウ共有用ドキュメントの作成<br />
            オンプレのリソース削除
          </Container>
          <Typography variant='h6' sx={{ borderBottom: 1, borderColor: 'primary.main', marginY: 1 }}>使用技術</Typography>
          <Container>
            PHP<br />
            Laravel<br />
            Terraform<br />
            AWS<br />
            Docker
          </Container>
        </Container>
        <Divider sx={{ marginTop: 5, borderColor: 'primary.main' }} />
        <Typography sx={{ marginTop: 1, textAlign: 'center' }}>Kudoma Portfolio</Typography>
      </Container>
    </ThemeProvider>
  );
}

export default App;
