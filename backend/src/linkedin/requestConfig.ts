export type RequestConfig = {
  fetch: typeof fetch;
  getHeaders: () => Record<string, string>;
};
