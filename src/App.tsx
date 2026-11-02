import { useState, useEffect, useMemo } from 'react';

import { Box, CssBaseline, Stack, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

import {
  About,
  BlogList,
  Experience,
  Footer,
  Hero,
  Product,
  Section,
  SectionNav,
  Skill,
  Skills,
} from './components';
import { experiences, skills, products } from './data';
import { ArticleService } from './service';
import { TaggedArticle } from './types';
import { ThemeToggle, useThemeMode } from './ThemeMode';
import { getTheme, ocean } from './theme';

const SKILL_LEVELS = [
  { rating: 1, description: '具体的なゴールと学習対象、壁打ちが必要' },
  { rating: 2, description: '具体的なゴールと壁打ちが必要' },
  { rating: 3, description: '大まかなゴールと壁打ちが必要' },
  { rating: 4, description: '大まかなゴールが必要' },
  { rating: 5, description: '自走' },
];

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'products', label: 'Products' },
  { id: 'blog', label: 'Blog' },
];

/** カードを並べるレスポンシブグリッド。列数だけを差し替えて使い回す。 */
const cardGrid = (min: number) => ({
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: `repeat(auto-fill, minmax(${min}px, 1fr))` },
  gap: 2.5,
});

function App() {
  const { mode, toggle } = useThemeMode();
  const theme = useMemo(() => getTheme(mode), [mode]);
  const [articles, setArticles] = useState<TaggedArticle[] | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const articleService = new ArticleService();

      const [qiita, zenn, kudoma] = await Promise.all([
        articleService.fetchArticles('qiita'),
        articleService.fetchArticles('zenn'),
        articleService.fetchArticles('kudoma')
      ]);
      const allArticles = [...qiita, ...zenn, ...kudoma];
      const sortedArticles = allArticles.slice().sort((a, b) => {
        const aDate = new Date(a.updatedAt);
        const bDate = new Date(b.updatedAt);
        return bDate.getTime() - aDate.getTime();
      });
      setArticles(sortedArticles);
    };
    fetchArticles();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Hero />
      <SectionNav items={NAV_ITEMS} />

      <Box component="main">
        <Section id="about" title="About">
          <About />
        </Section>

        <Section id="skills" title="Skills">
          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <InfoIcon sx={{ color: ocean.main }} />
                <Typography sx={{ fontWeight: 600 }}>スキルレベルの基準</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              {SKILL_LEVELS.map((level) => (
                <Skill key={level.rating} {...level} />
              ))}
            </AccordionDetails>
          </Accordion>

          {skills.map((skill) => (
            <Skills key={skill.area} {...skill} />
          ))}
        </Section>

        <Section id="experiences" title="Experiences">
          {experiences.map((experience) => (
            <Experience key={experience.title} {...experience} />
          ))}
        </Section>

        <Section id="products" title="Products">
          <Box sx={cardGrid(320)}>
            {products.map((product) => (
              <Product key={product.title} {...product} />
            ))}
          </Box>
        </Section>

        <Section id="blog" title="Blog">
          <BlogList articles={articles} />
        </Section>
      </Box>

      <Footer />
      <ThemeToggle mode={mode} onToggle={toggle} />
    </ThemeProvider>
  );
}

export default App;
