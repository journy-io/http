import { HttpClient } from "./HttpClient";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export class HttpClientFixedPaths implements HttpClient {
  private readonly receivedRequests: HttpRequest[] = [];

  constructor(
    private readonly callback: (request: HttpRequest) => HttpResponse
  ) {}

  async send(request: HttpRequest) {
    this.receivedRequests.push(request);
    return this.callback(request);
  }

  getReceivedRequests() {
    return this.receivedRequests;
  }
}
