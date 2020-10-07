import { HttpClientConsoleLogging } from "./HttpClientConsoleLogging";
import { HttpClientFixed } from "./HttpClientFixed";
import { HttpHeaders } from "./HttpHeaders";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

describe("HttpClientLogging", () => {
  it("works", async () => {
    console.log = jest.fn();
    const fixedResponse = new HttpResponse(200, new HttpHeaders(), "success");
    const fixedClient = new HttpClientFixed(fixedResponse);

    const client = new HttpClientConsoleLogging(fixedClient);
    const response = await client.send(
      new HttpRequest(new URL("https://journy.io/"))
    );

    expect(response.getBody()).toEqual("success");
    // @ts-expect-error mocked
    expect(console.log.mock.calls).toEqual([
      ["Request...", "GET", "https://journy.io/"],
      ["Response...", 200, "success"],
    ]);
  });
});
