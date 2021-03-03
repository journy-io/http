import { HttpClientFixed } from "./HttpClientFixed";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
import { URL } from "url";
import { HttpClientCallback } from "./HttpClientCallback";

describe("HttpClientFixedPaths", () => {
  it("works", async () => {
    const requests: HttpRequest[] = [];
    const response1 = new HttpResponse(
      200,
      undefined,
      JSON.stringify({ message: "success" })
    );
    const response2 = new HttpResponse(
      404,
      undefined,
      JSON.stringify({ message: "not found" })
    );

    const callback = (request: HttpRequest) => {
      requests.push(request);
      if (request.getURL().pathname === "/") {
        return response1;
      }
      return response2;
    };

    const client = new HttpClientCallback(callback);
    const request1 = new HttpRequest(new URL("https://journy.io/"));
    const request2 = new HttpRequest(new URL("https://journy.io/invalid"));

    expect(await client.send(request1)).toEqual(response1);
    expect(await client.send(request2)).toEqual(response2);
    expect(requests.length).toEqual(2);
    expect(requests).toEqual([request1, request2]);
  });
});
