import { HttpClient } from "./HttpClient";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export class HttpClientFixed implements HttpClient {
  private lastRequest: HttpRequest | undefined;

  constructor(private readonly response: HttpResponse) {}

  async send(request: HttpRequest) {
    this.lastRequest = request;

    return this.response;
  }

  getLastRequest() {
    return this.lastRequest;
  }
}
