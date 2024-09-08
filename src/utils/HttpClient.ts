export default class HttpClient {
  public async request<T>(url: string): Promise<T | undefined> {
    try {
      const response = await fetch(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
      return response.json();
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
