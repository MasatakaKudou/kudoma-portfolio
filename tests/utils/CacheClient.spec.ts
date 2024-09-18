import CacheClient from '../../src/utils/CacheClient';

describe('CacheClient', () => {

  const client = new CacheClient();
  
  const KEY = 'unit-test-key';
  const VALUE = [
    { "hoge": '1' },
    { "fuga": '2' },
  ];
  const DELETE_IDENTIFIER = 1;

  test('set', async () => {
    const result = await client.set(KEY, VALUE);
    expect(result).toEqual('OK');
  })

  test('get', async () => {
    const result = await client.get(KEY);
    expect(result).toEqual(VALUE);
  })

  test('delete', async () => {
    const result = await client.delete(KEY);
    expect(result).toEqual(DELETE_IDENTIFIER);
  })
})
