import { ArticleService } from '../../src/service/ArticleService';

describe('ArticleService', () => {
  const ARTICLES = [{ title: 't', updatedAt: '2026-01-01', url: 'https://example.com/a' }];

  let service: ArticleService;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new ArticleService();
    fetchSpy = jest.spyOn(global, 'fetch');
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const jsonResponse = (status: number, body: unknown) =>
    ({ status, json: async () => body } as Response);

  test('requests /articles/<site> on the article backend and tags each article', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, ARTICLES));

    const result = await service.fetchArticles('zenn');

    const requested = new URL(fetchSpy.mock.calls[0][0]);
    expect(requested.origin).toBe(new URL(process.env.REACT_APP_ARTICLE_BASE_URL).origin);
    expect(requested.pathname).toBe('/articles/zenn');
    expect(result).toEqual([{ ...ARTICLES[0], tag: 'Zenn' }]);
  });

  test('does not touch any cache endpoint (caching is server-side)', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, ARTICLES));

    await service.fetchArticles('qiita');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  test('returns an empty list when the request fails', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(500, null));

    expect(await service.fetchArticles('kudoma')).toEqual([]);
  });

  test('returns an empty list on a network error', async () => {
    fetchSpy.mockRejectedValue(new Error('network'));

    expect(await service.fetchArticles('qiita')).toEqual([]);
  });
});
