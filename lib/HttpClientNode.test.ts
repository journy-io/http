import { HttpClientNode } from "./HttpClientNode";
import { HttpHeaders } from "./HttpHeaders";
import { HttpRequest } from "./HttpRequest";
import { URL } from "url";

const httpbin = `http://localhost:9877`;

describe("HttpClientNode", () => {
  test("it does a GET request", async () => {
    const client = new HttpClientNode(10000);
    const url = new URL(`${httpbin}/get?param=true`);
    const response = await client.send(
      new HttpRequest(
        url,
        "GET",
        new HttpHeaders({ "User-Agent": "https://github.com/journy-io/http" })
      )
    );
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toBeInstanceOf(HttpHeaders);
    expect(response.getHeaders().toObject()).toMatchObject({
      "content-type": "application/json",
    });
    const body = JSON.parse(response.getBody());
    expect(body).toMatchObject({
      args: { param: "true" },
      headers: { "User-Agent": "https://github.com/journy-io/http" },
      url: url.toString(),
    });
  });

  test("it returns the right status code", async () => {
    const client = new HttpClientNode(10000);
    const url = new URL(`${httpbin}/status/429`);
    const response = await client.send(
      new HttpRequest(
        url,
        "GET",
        new HttpHeaders({ "User-Agent": "https://github.com/journy-io/http" })
      )
    );
    expect(response.getStatusCode()).toEqual(429);
  });

  test("it does a POST request", async () => {
    const client = new HttpClientNode(10000);
    const url = new URL(`${httpbin}/post?param=true`);
    const data = JSON.stringify({ body: true });
    const response = await client.send(
      new HttpRequest(
        url,
        "POST",
        new HttpHeaders({ "User-Agent": "https://github.com/journy-io/http" }),
        data
      )
    );
    expect(response.getStatusCode()).toEqual(200);
    expect(response.getHeaders()).toBeInstanceOf(HttpHeaders);
    expect(response.getHeaders().toObject()).toMatchObject({
      "content-type": "application/json",
    });
    const body = JSON.parse(response.getBody());
    expect(body).toMatchObject({
      args: { param: "true" },
      headers: { "User-Agent": "https://github.com/journy-io/http" },
      url: url.toString(),
      data: data,
    });
  });

  test("it throws error if unresolved host", async () => {
    const client = new HttpClientNode(10000);

    try {
      await client.send(new HttpRequest(new URL("https://httpbin.o/delay/1")));
      throw new Error("Should fail!");
    } catch (error: any) {
      expect(error.message).toEqual("getaddrinfo ENOTFOUND httpbin.o");
    }
  });

  test("it throws error if timed out", async () => {
    const client = new HttpClientNode(500);

    try {
      await client.send(new HttpRequest(new URL(`${httpbin}/delay/1`)));
      throw new Error("Should fail!");
    } catch (error: any) {
      expect(error.message).toEqual(`Request to ${httpbin}/delay/1 timed out`);
    }
  });
});
