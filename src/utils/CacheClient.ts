import HttpClient from "./HttpClient";

interface CacheGetResponse {
  result: string | null;
}

interface CacheSetResponse {
  result: 'OK' | null;
}

interface CacheDeleteResponse {
  result: number;
}

export default class CacheClient {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient();
  }

  public async get<T>(key: string): Promise<T | undefined> {
    try {
      const endpoint = this.buildUrl('get', key);
      const response = await this.client.request<CacheGetResponse>(endpoint);
      console.log({response});
      if (!response || !response.result) {
        return;
      }

      return JSON.parse(response.result);
    } catch (error) {
      console.error(`Failed to get cache - key: ${key} because of ${error}`);
    }
  }

  public async set(key: string, value: Object[] | Object): Promise<'OK' | undefined> {
    try {
      if (Array.isArray(value)) {
        const valueForCache = JSON.stringify(value);
        const endpoint = this.buildUrl('set', key, valueForCache);
        const response = await this.client.request<CacheSetResponse>(endpoint);
        if (!response || response.result !== 'OK') {
          return;
        }
        return response.result;
      }
      
      const valueForCache = JSON.stringify(value);
      const endpoint = this.buildUrl('set', key, valueForCache);
      const response = await this.client.request<CacheSetResponse>(endpoint);
      if (!response || response.result !== 'OK') {
        return;
      }
      return response.result;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to set cache - key: ${key}, value: ${value}`);
    }
  }

  // for testing purposes
  public async delete(key: string): Promise<number | undefined> {
    try {
      const endpoint = this.buildUrl('del', key);
      const response = await this.client.request<CacheDeleteResponse>(endpoint);
      if (!response || response.result === 0) {
        return;
      }
      return response.result;
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to delete cache - key: ${key}`);
    }
  }

  private buildUrl(method: string, key: string, value: string | undefined = undefined): string {
    const baseUrl = new URL(process.env.REACT_APP_UPSTASH_REDIS_REST_URL);

    if (value) {
      baseUrl.pathname = `${method}/${key}/${value}`; 
    } else {
      baseUrl.pathname = `${method}/${key}`; 
    }

    baseUrl.searchParams.append('_token', process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN);

    return baseUrl.toString();
  }
}
