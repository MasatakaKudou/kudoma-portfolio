import { CacheClient } from '../../src/utils/CacheClient';

describe('CacheClient', () => {
  const KEY = 'unit-test-key';
  const VALUE = [{ hoge: '1' }, { fuga: '2' }];

  let client: CacheClient;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    client = new CacheClient();
    fetchSpy = jest.spyOn(global, 'fetch');
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const jsonResponse = (status: number, body: unknown) =>
    ({ status, json: async () => body } as Response);

  describe('get', () => {
    test('returns the parsed value on a cache hit', async () => {
      fetchSpy.mockResolvedValue(
        jsonResponse(200, { key: KEY, value: JSON.stringify(VALUE) })
      );

      const result = await client.get(KEY);

      expect(result).toEqual(VALUE);
      const requestedUrl = new URL(fetchSpy.mock.calls[0][0]);
      expect(requestedUrl.pathname).toBe('/get');
      expect(requestedUrl.searchParams.get('key')).toBe(KEY);
    });

    test('returns undefined on a cache miss (non-200)', async () => {
      fetchSpy.mockResolvedValue(jsonResponse(404, {}));

      const result = await client.get(KEY);

      expect(result).toBeUndefined();
    });
  });

  describe('set', () => {
    test('returns true and posts the serialized value on success', async () => {
      fetchSpy.mockResolvedValue(jsonResponse(200, {}));

      const result = await client.set(KEY, VALUE);

      expect(result).toBe(true);
      const [url, init] = fetchSpy.mock.calls[0];
      expect(new URL(url).pathname).toBe('/set');
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body)).toEqual({ key: KEY, value: JSON.stringify(VALUE) });
    });

    test('returns false when the request fails', async () => {
      fetchSpy.mockRejectedValue(new Error('network down'));

      const result = await client.set(KEY, VALUE);

      expect(result).toBe(false);
    });
  });
});
