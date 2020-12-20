import { HttpHeaders } from "./HttpHeaders";

describe("HttpHeaders", () => {
  it("returns a header by name", () => {
    const headers = new HttpHeaders({
      "Content-Type": "text/HTML",
      "x-real-ip": "127.0.0.1",
      "set-Cookie": ["cookie1", "cookie2"],
    });

    expect(headers.byName("Content-Type")).toEqual("text/HTML");
    expect(headers.byName("content-type")).toEqual("text/HTML");
    expect(headers.byName("X-real-ip")).toEqual("127.0.0.1");
    expect(headers.byName("x-real-ip")).toEqual("127.0.0.1");
    expect(headers.byName("unknown")).toEqual(undefined);
    expect(headers.byName("set-cookie")).toEqual(["cookie1", "cookie2"]);
    expect(headers.byName("Set-COOKIE")).toEqual(["cookie1", "cookie2"]);
  });

  it("converts to a plain JavaScript obect", () => {
    const headers = new HttpHeaders({
      "Content-Type": "text/HTML",
      "x-real-ip": "127.0.0.1",
      "set-Cookie": "cookie",
    });

    expect(headers.toObject()).toEqual({
      "content-type": "text/HTML",
      "x-real-ip": "127.0.0.1",
      "set-cookie": "cookie",
    });
  });
});
