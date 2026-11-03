export type Site = "qiita" | "zenn" | "kudoma";

export interface Article {
  title: string;
  updatedAt: string;
  url: string;
  /** 以下は媒体によって取れない／古いキャッシュには無いので optional。 */
  likes?: number;
  thumbnail?: string;
  excerpt?: string;
}

export interface TaggedArticle {
  title: string;
  updatedAt: string;
  url: string;
  likes?: number;
  thumbnail?: string;
  excerpt?: string;
  tag: string;
}
