import { useState, useEffect } from 'react';

import { Box, Container, CssBaseline, Stack, Typography } from '@mui/material';
import { ThemeProvider, alpha } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

import {
  About,
  Blog,
  BlogSkeleton,
  Experience,
  Footer,
  Hero,
  Product,
  Section,
  SectionNav,
  SkipLink,
  Skill,
  Skills,
} from './components';
import { experiences, skills, products } from './data';
import { ArticleService } from './service';
import { TaggedArticle } from './types';
import { ocean, theme } from './theme';

const SKILL_LEVELS = [
  { rating: 1, description: '具体的なゴールと学習対象、壁打ちが必要' },
  { rating: 2, description: '具体的なゴールと壁打ちが必要' },
  { rating: 3, description: '大まかなゴールと壁打ちが必要' },
  { rating: 4, description: '大まかなゴールが必要' },
  { rating: 5, description: '自走' },
];

const BLOG_SKELETON_COUNT = 6;

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
      <SkipLink targetId="main" />
      <Hero />
      <SectionNav items={NAV_ITEMS} />

      <Box component="main" id="main" tabIndex={-1} sx={{ outline: 'none' }}>
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
          <Box sx={cardGrid(300)} aria-busy={articles === null}>
            {articles
              ? articles.map((article) => <Blog key={article.url} {...article} />)
              : Array.from({ length: BLOG_SKELETON_COUNT }, (_, i) => <BlogSkeleton key={i} />)}
          </Box>
          {articles?.length === 0 && (
            <Container disableGutters>
              <Typography role="status" sx={{ color: alpha(ocean.deep, 0.7) }}>記事を取得できませんでした。</Typography>
            </Container>
          )}
        </Section>
      </Box>

      <Footer />
    </ThemeProvider>
  );
}

export default App;
