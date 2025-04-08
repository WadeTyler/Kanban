interface HttpClientOptions {
  apiUrl: string;
  credentials: 'include' | 'omit' | 'same-origin';
}

export default HttpClientOptions;