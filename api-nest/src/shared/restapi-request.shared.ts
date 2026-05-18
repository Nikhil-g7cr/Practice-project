export interface IRestApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
}

export interface IRestApiResponse<T = any> {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
  duration: number;
}

export class RestApiRequest implements IRestApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  headers: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout: number;

  constructor(data: IRestApiRequest) {
    this.method = data.method;
    this.url = data.url;
    this.headers = data.headers || {};
    this.body = data.body;
    this.params = data.params;
    this.timeout = data.timeout || 30000;
  }
}
