import { AxiosInstance } from "axios";
import { HttpClient } from "./HttpClient";
import { HttpHeaders } from "./HttpHeaders";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export class HttpClientAxios implements HttpClient {
  constructor(private readonly axios: AxiosInstance) {}

  async send(request: HttpRequest) {
    const body = request.getBody();
    const response = await this.axios({
      url: request.getURL().toString(),
      method: request.getMethod(),
      headers: request.getHeaders().toObject(),
      data: body ? body : undefined,
      transformResponse: (data) => data,
      validateStatus: () => true,
    });

    return new HttpResponse(
      response.status,
      new HttpHeaders(response.headers),
      response.data || ""
    );
  }
}
