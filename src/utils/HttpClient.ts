export default class HttpClient {
  public async request<T>(url: string): Promise<T | undefined> {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      console.error(`Failed to request - url: ${url} because of ${error}`);
      return;
    }
  }
}
