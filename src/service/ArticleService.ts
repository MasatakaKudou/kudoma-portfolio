import HttpClient from '../utils/HttpClient';
import CacheClient from '../utils/CacheClient';

import { Article } from '../types/BlogType';

export default class ArticleService {
  private httpClient = new HttpClient();
  private cacheClient = new CacheClient();

  public async fetchQiitaArticles(): Promise<Article[]> {
    const cachedArticles = await this.cacheClient.get<Article[]>('qiita-blog');
    if (cachedArticles) {
      return cachedArticles;
    }

    const baseUrl = new URL(process.env.REACT_APP_ARTICLE_BASE_URL);
    baseUrl.pathname = '/articles/qiita';
    const response = await this.httpClient.get<Article[]>(baseUrl.toString());
    if (!response) {
      return [];
    }

    await this.cacheClient.set('qiita-blog', response);
    return response;
  }

  public async fetchZennArticles(): Promise<Article[]> {
    const cachedArticles = await this.cacheClient.get<Article[]>('zenn-blog');
    if (cachedArticles) {
      return cachedArticles;
    }

    const baseUrl = new URL(process.env.REACT_APP_ARTICLE_BASE_URL);
    baseUrl.pathname = '/articles/zenn';
    const response = await this.httpClient.get<Article[]>(baseUrl.toString());
    if (!response) {
      return [];
    }
    await this.cacheClient.set('zenn-blog', response);
    return response;
  }
}
