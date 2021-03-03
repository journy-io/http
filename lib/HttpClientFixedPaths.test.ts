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
    const client = new HttpClientFixedPaths({
      "/": response1,
      "/not-found": response2,
    });
    const request1 = new HttpRequest(new URL("https://journy.io/"));
    const request2 = new HttpRequest(new URL("https://journy.io/not-found"));
    const request3 = new HttpRequest(new URL("https://journy.io/invalid"));

    expect(await client.send(request1)).toEqual(response1);
    expect(await client.send(request2)).toEqual(response2);
    expect(client.getReceivedRequests().length).toEqual(2);
    expect(client.getReceivedRequests()).toEqual([request1, request2]);

    await expect(client.send(request3)).rejects.toThrowError(
      `No response was given for the path: /invalid`
    );
  });
});
