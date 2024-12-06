import { HttpClient, CacheClient } from '../utils';
import { Article, TaggedArticle } from '../types';

export class ArticleService {
  private httpClient = new HttpClient();
  private cacheClient = new CacheClient();

  public async fetchQiitaArticles(): Promise<TaggedArticle[]> {
    const cachedArticles = await this.cacheClient.get<TaggedArticle[]>('qiita-blog');
    if (cachedArticles) {
      return cachedArticles;
    }

    const baseUrl = new URL(process.env.REACT_APP_ARTICLE_BASE_URL);
    baseUrl.pathname = '/articles/qiita';
    const response = await this.httpClient.get<Article[]>(baseUrl.toString());
    if (!response) {
      return [];
    }

    const taggedArticles = response.map((article) => {
      return {
        ...article,
        tag: 'Qiita',
      };
    });

    await this.cacheClient.set('qiita-blog', taggedArticles);
    return taggedArticles;
  }

  public async fetchZennArticles(): Promise<TaggedArticle[]> {
    const cachedArticles = await this.cacheClient.get<TaggedArticle[]>('zenn-blog');
    if (cachedArticles) {
      return cachedArticles;
    }

    const baseUrl = new URL(process.env.REACT_APP_ARTICLE_BASE_URL);
    baseUrl.pathname = '/articles/zenn';
    const response = await this.httpClient.get<Article[]>(baseUrl.toString());
    if (!response) {
      return [];
    }

    const taggedArticles = response.map((article) => {
      return {
        ...article,
        tag: 'Zenn',
      };
    });

    await this.cacheClient.set('zenn-blog', taggedArticles);
    return taggedArticles;
  }
}
