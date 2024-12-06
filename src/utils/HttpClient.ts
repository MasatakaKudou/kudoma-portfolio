export class HttpClient {
  public async get<T>(url: string): Promise<T | undefined> {
    try {
      const response = await fetch(url);
      if (response.status !== 200) {
        console.error(`Failed to request - url: ${url} because of ${response.status}`);
        return;
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to request - url: ${url} because of ${error}`);
      return;
    }
  }

  public async post(url: string, requestBody: any): Promise<boolean> {
    try {
      const body = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      return true;
    } catch (error) {
      console.error(`Failed to request - url: ${url} because of ${error}`);
      return false;
    }
  }
}
