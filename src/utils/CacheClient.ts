import { HttpClient } from "./HttpClient";

interface CacheGetResponse {
  key: string;
  value: string;
}

export class CacheClient {
  private client: HttpClient;

  constructor() {
    this.client = new HttpClient();
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const endpoint = new URL(process.env.REACT_APP_CACHE_BASE_URL);
    endpoint.pathname = 'get';
    endpoint.searchParams.append('key', key);

    const response = await this.client.get<CacheGetResponse>(endpoint.toString());
    if (!response) {
      console.error(`Not found cache - url: ${endpoint}`);
      return;
    }

    return JSON.parse(response.value);
  }

  public async set(key: string, value: Object[] | Object): Promise<boolean> {
    const endpoint = new URL(process.env.REACT_APP_CACHE_BASE_URL);
    endpoint.pathname = 'set';

    const valueForRequestBody = JSON.stringify(value);
    try {
      await this.client.post(endpoint.toString(), { key, value: valueForRequestBody });
      return true;
    } catch (error) {
      console.error(`Failed to set cache - key: ${key}, value: ${value}, error: ${error}`);
      return false;
    }
  }

  // for testing purposes
  // public async delete(key: string): Promise<number | undefined> {
  //   try {
  //     const endpoint = this.buildUrl('del', key);
  //     const response = await this.client.request<CacheDeleteResponse>(endpoint);
  //     if (!response || response.result === 0) {
  //       return;
  //     }
  //     return response.result;
  //   } catch (error) {
  //     console.error(error);
  //     throw new Error(`Failed to delete cache - key: ${key}`);
  //   }
  // }
}
