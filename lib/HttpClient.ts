import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export interface HttpClient {
  send(request: HttpRequest): Promise<HttpResponse>;
}
