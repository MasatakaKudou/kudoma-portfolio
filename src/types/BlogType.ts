export interface Article {
  title: string;
  updatedAt: string;
  url: string;
}

export interface TaggedArticle {
  title: string;
  updatedAt: string;
  url: string;
  tag: string;
}
