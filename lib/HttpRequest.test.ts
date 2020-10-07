import { HttpHeaders } from "./HttpHeaders";
import { HttpRequest } from "./HttpRequest";

describe("HttpRequest", () => {
  it("has getters", () => {
    const request = new HttpRequest(
      new URL("https://journy.io"),
      "GET",
      new HttpHeaders({ accept: "text/html" }),
      "body"
    );

    expect(request.getHeaders()).toEqual(
      new HttpHeaders({ accept: "text/html" })
    );
    expect(request.getMethod()).toEqual("GET");
    expect(request.getBody()).toEqual("body");
  });
});
