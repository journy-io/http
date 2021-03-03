import { HttpClientFixed } from "./HttpClientFixed";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
import { URL } from "url";
import { HttpClientFixedPaths } from "./HttpClientFixedPaths";

describe("HttpClientFixedPaths", () => {
  it("works", async () => {
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
      if (request.getURL().pathname === "/") {
        return response1;
      }
      return response2;
    };

    const client = new HttpClientFixedPaths(callback);
    const request1 = new HttpRequest(new URL("https://journy.io/"));
    const request2 = new HttpRequest(new URL("https://journy.io/invalid"));

    expect(await client.send(request1)).toEqual(response1);
    expect(await client.send(request2)).toEqual(response2);
    expect(client.getReceivedRequests().length).toEqual(2);
    expect(client.getReceivedRequests()).toEqual([request1, request2]);
  });
});
