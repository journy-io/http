import { HttpClientFixed } from "./HttpClientFixed";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

describe("HttpClientFixed", () => {
  it("works", async () => {
    const response = new HttpResponse();
    const client = new HttpClientFixed(response);
    const request = new HttpRequest(new URL("https://journy.io"));

    expect(await client.send(request)).toEqual(response);
    expect(client.getLastRequest()).toEqual(request);
  });
});
