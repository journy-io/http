import { HttpClient } from "./HttpClient";
import { HttpRequest } from "./HttpRequest";

export class HttpClientConsoleLogging implements HttpClient {
  constructor(private readonly client: HttpClient) {}

  async send(request: HttpRequest) {
    console.log("Request...", request.getMethod(), request.getURL().toString());
    const response = await this.client.send(request);
    console.log("Response...", response.getStatusCode(), response.getBody());

    return response;
  }
}
