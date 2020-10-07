import { HttpHeaders } from "./HttpHeaders";
import { HttpMethod } from "./HttpMethod";

export class HttpRequest {
  constructor(
    private readonly url: URL,
    private readonly method: HttpMethod = "GET",
    private readonly headers: HttpHeaders = new HttpHeaders(),
    private readonly body: string = ""
  ) {}

  getHeaders() {
    return this.headers;
  }

  getBody() {
    return this.body;
  }

  getMethod() {
    return this.method;
  }

  getURL() {
    return this.url;
  }
}
