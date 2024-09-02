import { ExperienceProps } from '../components/Experience';

export const experiences: ExperienceProps[] = [
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