import { ProductProps } from '../components/Product';

export const products: ProductProps[] = [
  {
    title: 'Kudoma Portfolio',
    description: 'このポートフォリオサイトです。',
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
    url: {
      product: 'https://techblog.kudoma.net/'
    },
    skills: [
      'WordPress'
    ],
  },
];
