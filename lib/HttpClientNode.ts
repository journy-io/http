import { HttpClient } from "./HttpClient";
import { HttpHeaders } from "./HttpHeaders";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
import {
  request as httpRequest,
  RequestOptions,
  IncomingMessage,
  ClientRequest,
} from "http";
import { request as httpsRequest } from "https";

export class HttpClientNode implements HttpClient {
  constructor(private readonly timeoutInMillis: number | undefined) {
    if (typeof this.timeoutInMillis === "number" && this.timeoutInMillis < 0) {
      throw new Error(`Timeout cannot be negative: ${this.timeoutInMillis}`);
    }
  }

  async send(request: HttpRequest): Promise<HttpResponse> {
    const protocol = request.getURL().protocol;

    if (["http:", "https:"].includes(protocol) === false) {
      throw new Error(
        `Only http or https is supported as protocol: ${protocol}`
      );
    }

    return new Promise((resolve, reject) => {
      const headers = {
        ...request.getHeaders().toObject(),
      };

      if (request.getBody()) {
        headers["Content-Length"] = String(
          Buffer.byteLength(request.getBody())
        );
      }

      const options: RequestOptions = {
        method: request.getMethod(),
        headers: headers,
        timeout: this.timeoutInMillis,
      };

      let req: ClientRequest;
      if (protocol === "http:") {
        req = httpRequest(request.getURL(), options);
      } else {
        req = httpsRequest(request.getURL(), options);
      }

      req.on("error", reject);

      req.on("timeout", () => {
        req.abort();
        reject(
          new Error(`Request to ${request.getURL().toString()} timed out`)
        );
      });

      req.on("response", (message: IncomingMessage) => {
        message.setEncoding("utf8");

        let body = "";
        message.on("data", (data) => {
          body += data;
        });

        message.on("end", () => {
          resolve(
            new HttpResponse(
              message.statusCode,
              new HttpHeaders(
                message.headers as { [key: string]: string | string[] }
              ),
              body
            )
          );
        });
      });

      if (request.getBody()) {
        req.write(request.getBody());
      }

      req.end();
    });
  }
}
