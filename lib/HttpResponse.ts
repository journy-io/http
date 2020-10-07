import { HttpHeaders } from "./HttpHeaders";

export class HttpResponse {
  constructor(
    private readonly statusCode: number = 200,
    private readonly headers: HttpHeaders = new HttpHeaders(),
    private readonly body: string = ""
  ) {}

  getHeaders() {
    return this.headers;
  }

  getBody() {
    return this.body;
  }

  getStatusCode() {
    return this.statusCode;
  }
}
