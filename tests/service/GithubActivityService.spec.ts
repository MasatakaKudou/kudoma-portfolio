import { GithubActivityService } from '../../src/service/GithubActivityService';

describe('GithubActivityService', () => {
  const ACTIVITY = {
    pinned: [{ name: 'r', description: null, url: 'https://github.com/u/r', stars: 1, language: 'TypeScript' }],
    contributions: { total: 10, days: [{ date: '2026-01-01', count: 2 }] },
  };

  let service: GithubActivityService;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    service = new GithubActivityService();
    fetchSpy = jest.spyOn(global, 'fetch');
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const jsonResponse = (status: number, body: unknown) =>
    ({ status, json: async () => body } as Response);

  test('requests /github-activity on the github-activity backend', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, ACTIVITY));

    const result = await service.fetchActivity();

    const requested = new URL(fetchSpy.mock.calls[0][0]);
    expect(requested.origin).toBe(new URL(process.env.REACT_APP_GITHUB_ACTIVITY_BASE_URL).origin);
    expect(requested.pathname).toBe('/github-activity');
    expect(result).toEqual(ACTIVITY);
  });

  test('returns undefined when the request fails', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(500, null));

    expect(await service.fetchActivity()).toBeUndefined();
  });

  test('returns undefined on a network error', async () => {
    fetchSpy.mockRejectedValue(new Error('network'));

    expect(await service.fetchActivity()).toBeUndefined();
  });

  test('treats the Worker\'s empty (upstream failure) response as not found', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, { pinned: [], contributions: { total: 0, days: [] } }));

    expect(await service.fetchActivity()).toBeUndefined();
  });
});
