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
      if (!response || !response.result) {
        return;
      }

      return JSON.parse(response.result);
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to get cache - key: ${key}`);
    }
  }

  public async set(key: string, value: any): Promise<'OK' | undefined> {
    try {
      const endpoint = this.buildUrl('set', key, value);
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

  private buildUrl(method: string, key: string, value: any = undefined): string {
    const baseUrl = new URL(process.env.REACT_APP_UPSTASH_REDIS_REST_URL);

    if (value) {
      const valueForCache = JSON.stringify(value);
      baseUrl.pathname = `${method}/${key}/${valueForCache}`; 
    } else {
      baseUrl.pathname = `${method}/${key}`; 
    }

    baseUrl.searchParams.append('_token', process.env.REACT_APP_UPSTASH_REDIS_REST_TOKEN);

    return baseUrl.toString();
  }
}
