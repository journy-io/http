import { HttpHeaders } from "./HttpHeaders";
import { HttpResponse } from "./HttpResponse";

describe("HttpResponse", () => {
  it("has getters", () => {
    const response = new HttpResponse(
      404,
      new HttpHeaders({ "content-type": "text/html" }),
      "<html>body</html>"
    );

    expect(response.getHeaders().byName("content-type")).toEqual("text/html");
    expect(response.getStatusCode()).toEqual(404);
  });
});
