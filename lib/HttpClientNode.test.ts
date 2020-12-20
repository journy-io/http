import { HttpClientNode } from "./HttpClientNode";
import { HttpHeaders } from "./HttpHeaders";
import { HttpRequest } from "./HttpRequest";
import { URL } from "url";

describe("HttpClientNode", () => {
  test("it does a GET request", async () => {
    const client = new HttpClientNode(10000);
    const url = new URL("https://httpbin.org/get?param=true");
    const response = await client.send(
      new HttpRequest(
        url,
        "GET",
        new HttpHeaders({ "User-Agent": "@journyio/http" })
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
      headers: { "User-Agent": "@journyio/http" },
      url: url.toString(),
    });
  });

  test("it returns the right status code", async () => {
    const client = new HttpClientNode(10000);
    const url = new URL("https://httpbin.org/status/429");
    const response = await client.send(
      new HttpRequest(
        url,
        "GET",
        new HttpHeaders({ "User-Agent": "@journyio/http" })
      )
    );
    expect(response.getStatusCode()).toEqual(429);
  });

  test("it does a POST request", async () => {
    const client = new HttpClientNode(10000);
    const url = new URL("https://httpbin.org/post?param=true");
    const data = JSON.stringify({ body: true });
    const response = await client.send(
      new HttpRequest(
        url,
        "POST",
        new HttpHeaders({ "User-Agent": "@journyio/http" }),
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
      headers: { "User-Agent": "@journyio/http" },
      url: url.toString(),
      data: data,
    });
  });

  test("it throws error if unresolved host", async () => {
    const client = new HttpClientNode(10000);

    try {
      await client.send(new HttpRequest(new URL("https://httpbin.o/delay/1")));
      throw new Error("Should fail!");
    } catch (error) {
      expect(error.message).toEqual("getaddrinfo ENOTFOUND httpbin.o");
    }
  });

  test("it throws error if timed out", async () => {
    const client = new HttpClientNode(500);

    try {
      await client.send(
        new HttpRequest(new URL("https://httpbin.org/delay/1"))
      );
      throw new Error("Should fail!");
    } catch (error) {
      expect(error.message).toEqual(
        "Request to https://httpbin.org/delay/1 timed out"
      );
    }
  });
});
