import { HttpClient } from "./HttpClient";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export class HttpClientFixedPaths implements HttpClient {
  private readonly receivedRequests: HttpRequest[] = [];

  constructor(private readonly responses: { [key: string]: HttpResponse }) {}

  async send(request: HttpRequest) {
    this.receivedRequests.push(request);
    const response = this.responses[request.getURL().pathname];
    if (!response) {
      throw new Error(
        `No response was given for the path: ${request.getURL().pathname}`
      );
    }
    return response;
  }

  getReceivedRequests() {
    return this.receivedRequests;
  }
}
