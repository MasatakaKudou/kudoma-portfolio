export interface Article {
  title: string;
  updatedAt: string;
  url: string;
}

export interface QiitaResponse {
  title: string;
  updated_at: string;
  url: string;
}

export interface ZennResponse {
  articles: {
    title: string;
    body_updated_at: string;
    path: string;
  }[];
}
