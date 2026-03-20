type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const parseResponse = async <T,>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  return (await response.text()) as T;
};

const request = async <T,>(url: string, options?: RequestOptions): Promise<T> => {
  const { body, headers, ...rest } = options || {};
  const response = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return await parseResponse<T>(response);
};

export const api = {
  get: async <T,>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'GET' }),
  post: async <T,>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'POST', body }),
  put: async <T,>(url: string, body?: unknown, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'PUT', body }),
  delete: async <T,>(url: string, options?: RequestOptions) =>
    request<T>(url, { ...options, method: 'DELETE' })
};
