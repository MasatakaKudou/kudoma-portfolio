import { HttpClient, CacheClient } from '../utils';
import { Article, Site, TaggedArticle } from '../types';

export class ArticleService {
  private httpClient = new HttpClient();
  private cacheClient = new CacheClient();

  public async fetchArticles(siteName: Site): Promise<TaggedArticle[]> {
    const cachedArticles = await this.cacheClient.get<TaggedArticle[]>(`${siteName}-blog`);
    if (cachedArticles) {
      return cachedArticles;
    }
  
    const baseUrl = new URL(process.env.REACT_APP_ARTICLE_BASE_URL);
    baseUrl.pathname = `/articles/${siteName}`;
    const response = await this.httpClient.get<Article[]>(baseUrl.toString());
    if (!response) {
      return [];
    }

    const taggedArticles = response.map((article) => {
      return {
        ...article,
        tag: this.convertTag(siteName),
      };
    });

    // NOTE (negative cache): when the article API fails upstream it still answers 200 with `[]`,
    // and that empty list is cached too (TTL 1 hour, set by the cache Worker). This is intentional,
    // it avoids hammering a failing upstream, but it hides the site's articles until the TTL expires.
    // Possible improvement: do not cache (or use a shorter TTL for) an empty result caused by an upstream failure.
    await this.cacheClient.set(`${siteName}-blog`, taggedArticles);
    return taggedArticles;
  }

  private convertTag(siteName: Site): string {
    return siteName.charAt(0).toUpperCase() + siteName.slice(1);
  }
}
