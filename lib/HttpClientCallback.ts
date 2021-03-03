import { HttpClient } from "./HttpClient";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export class HttpClientCallback implements HttpClient {
  constructor(
    private readonly callback: (request: HttpRequest) => HttpResponse
  ) {}

  async send(request: HttpRequest) {
    return this.callback(request);
  }
}
