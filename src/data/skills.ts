import { SkillsProps } from '../components/Skills';

export const skills: SkillsProps[] = [
  {
    area: 'フロントエンド',
    skills: [
      { name: 'HTML', rating: 2 },
      { name: 'JavaScript', rating: 3 },
      { name: 'Vue.js', rating: 2 },
      { name: 'Nuxt.js', rating: 2 },
      { name: 'React.js', rating: 2 },
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
      { name: 'MySQL', rating: 2 },
      { name: 'SQLServer', rating: 2 },
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
