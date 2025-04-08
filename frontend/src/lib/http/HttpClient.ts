import {API_URL} from "@/environment";
import ResponseError from "@/lib/http/ResponseError";
import HttpClientOptions from "@/lib/http/HttpClientOptions";

class HttpClient {

  private API_URL: string;
  private options: HttpClientOptions;

  constructor(options: HttpClientOptions) {
    this.API_URL = options.apiUrl;
    this.options = options;
  }

  public async get<T>(path: string, body?: Record<string, unknown>, headers?: Record<string, unknown>): Promise<T> {

    const response = await fetch(`${API_URL}${path}`, {
      method: "GET",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      credentials: this.options.credentials
    });

    const jsonData: T = await response.json();

    if (!response.ok) {
      throw new ResponseError(`Response not OK for GET Request: ${API_URL}${path}`, jsonData, response);
    }

    return jsonData;
  }


  public async post<T>(path: string, body?: Record<string, unknown>, headers?: Record<string, unknown>): Promise<T> {

    const response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      credentials: this.options.credentials
    });

    const jsonData: T = await response.json();

    if (!response.ok) {
      throw new ResponseError(`Response not OK for POST Request: ${API_URL}${path}`, jsonData, response);
    }

    return jsonData;
  }

  public async put<T>(path: string, body?: Record<string, unknown>, headers?: Record<string, unknown>): Promise<T> {

    const response = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      credentials: this.options.credentials
    });

    const jsonData: T = await response.json();

    if (!response.ok) {
      throw new ResponseError(`Response not OK for PUT Request: ${API_URL}${path}`, jsonData, response);
    }

    return jsonData;
  }


  public async delete<T>(path: string, body?: Record<string, unknown>, headers?: Record<string, unknown>): Promise<T> {

    const response = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      credentials: this.options.credentials
    });

    const jsonData: T = await response.json();

    if (!response.ok) {
      throw new ResponseError(`Response not OK for DELETE Request: ${API_URL}${path}`, jsonData, response);
    }

    return jsonData;
  }


  public async patch<T>(path: string, body?: Record<string, unknown>, headers?: Record<string, unknown>): Promise<T> {

    const response = await fetch(`${API_URL}${path}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      credentials: this.options.credentials
    });

    const jsonData: T = await response.json();

    if (!response.ok) {
      throw new ResponseError(`Response not OK for PATCH Request: ${API_URL}${path}`, jsonData, response);
    }

    return jsonData;
  }
}

export default HttpClient;