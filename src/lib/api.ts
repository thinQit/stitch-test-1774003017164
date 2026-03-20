export const api = {
  async get<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        return null;
      }
      return (await response.json()) as T;
    } catch (_error: unknown) {
      return null;
    }
  },
  async post<T>(url: string, body: unknown): Promise<T | null> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        return null;
      }
      return (await response.json()) as T;
    } catch (_error: unknown) {
      return null;
    }
  }
};
