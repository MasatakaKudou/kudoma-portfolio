import { ProductProps } from '../components/Product';
import { productPortfolioImage, productTechBlogImage } from '../images';

export const products: ProductProps[] = [
  {
    title: 'Kudoma Portfolio',
    description: 'このポートフォリオサイトです。',
    solves: '経歴・制作物・記事・GitHub の活動を 1 ページにまとめ、見た人が短時間で全体像をつかめるようにする。',
    image: { src: productPortfolioImage, alt: 'Kudoma Portfolio のトップ画面。サメのロゴと、ナビゲーション' },
    url: {
      github: 'https://github.com/MasatakaKudou/kudoma-portfolio'
      ,product: 'https://www.kudoma.net/'
    },
    skills: [
      'React'
      ,'TypeScript'
      ,'Github Pages'
      ,'Github Actions'
      ,'Cloudflare'
      ,'Redis'
    ],
  },
  {
    title: 'Kudoma Tech Blog',
    description: 'テックブログです。',
    solves: '学んだことを自分の言葉で書き残して、あとから見返せる知識として蓄積し、発信する。',
    image: { src: productTechBlogImage, alt: 'Kudoma Tech Blog のトップ画面。最新の記事の一覧' },
    url: {
      product: 'https://techblog.kudoma.net/'
    },
    skills: [
      'WordPress'
    ],
  },
];
