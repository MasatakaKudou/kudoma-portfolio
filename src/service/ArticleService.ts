import { HttpClient } from '../utils';
import { Article, Site, TaggedArticle } from '../types';

export class ArticleService {
  private httpClient = new HttpClient();

  /**
   * キャッシュは article-backend 側（Upstash）が担当する。フロントは `/articles/<site>` を呼ぶだけ。
   * 上流が失敗したときは Worker が `[]` を返す（短い TTL でのみキャッシュ）ので、取得できなければ空配列にする。
   */
  public async fetchArticles(siteName: Site): Promise<TaggedArticle[]> {
    const baseUrl = new URL(process.env.REACT_APP_ARTICLE_BASE_URL);
    baseUrl.pathname = `/articles/${siteName}`;
    const response = await this.httpClient.get<Article[]>(baseUrl.toString());
    if (!response) {
      return [];
    }

    return response.map((article) => ({
      ...article,
      tag: this.convertTag(siteName),
    }));
  }

  private convertTag(siteName: Site): string {
    return siteName.charAt(0).toUpperCase() + siteName.slice(1);
  }
}
