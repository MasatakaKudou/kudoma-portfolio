import HttpClient from '../utils/HttpClient';
import CacheClient from '../utils/CacheClient';

import { Article, QiitaResponse, ZennResponse } from '../types/BlogType';

export default class ArticleService {
  private httpClient = new HttpClient();
  private cacheClient = new CacheClient();

  public async fetchQiitaArticles(): Promise<Article[]> {
    const cachedArticles = await this.cacheClient.get<Article[]>('qiita-blog');
    if (cachedArticles) {
      return cachedArticles;
    }

    const response = await this.httpClient.get<QiitaResponse[]>(process.env.REACT_APP_QIITA_API_ENDPOINT);
    if (!response) {
      return [];
    }
    const articles = response.map(({ title, updated_at, url }) => {
      return {
        title,
        updatedAt: updated_at,
        url,
      }
    });

    await this.cacheClient.set('qiita-blog', articles);

    return articles;
  }

  public async fetchZennArticles() {
    const cachedArticles = await this.cacheClient.get<Article[]>('zenn-blog');
    if (cachedArticles) {
      return cachedArticles;
    }

    const response = await this.httpClient.get<ZennResponse>(process.env.REACT_APP_ZENN_API_ENDPOINT);
    if (!response) {
      return [];
    }
    const articles = response.articles.map(({ title, body_updated_at, path }) => {
      return {
        title,
        updatedAt: body_updated_at,
        url: `https://zenn.dev${path}`,
      }
    });

    await this.cacheClient.set('zenn-blog', articles);

    return articles;
  }
}
