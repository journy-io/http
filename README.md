[![journy.io](banner.png)](https://journy.io/?utm_source=github&utm_content=readme-http)

# HTTP

[![npm](https://img.shields.io/npm/v/@journyio/http?color=%234d84f5&style=flat-square)](https://www.npmjs.com/package/@journyio/http)
[![npm downloads](https://img.shields.io/npm/dm/@journyio/http?style=flat-square)](https://www.npmjs.com/package/@journyio/http)

HTTP library that powers our [Node.js SDK](https://github.com/journy-io/js-sdk).

## 💾 Installation

You can use your package manager (`npm` or `yarn`) to install the HTTP utilities:

```bash
npm install --save @journyio/http
```
or
```bash
yarn add @journyio/http
```

## 🔌 Getting started

### HttpClientNode

Example of GET request:

```ts
import { HttpClientNode, HttpRequest, HttpHeaders } from "@journyio/http";
import { URL } from "url";

const client = new HttpClientNode(/* timeoutInMillis = */ 5000);

const response = await client.send(
  new HttpRequest(
    new URL(`https://api.domain/users?email=${encodeURIComponent(email)}`),
    "GET",
    new HttpHeaders({ "x-api-key": "my-api-key" })
  )
);

console.log(response.getStatusCode());
console.log(response.getBody());
console.log(response.getHeaders());
console.log(response.getHeaders().byName("x-ratelimit-remaining"));
console.log(response.getHeaders().byName("X-RateLimit-Remaining"));
```

Example of POST request:

```ts
const response = await client.send(
  new HttpRequest(
    new URL("https://api.domain/users"),
    "POST",
    new HttpHeaders({
      "x-api-key": "my-api-key",
      "content-type": "application/json",
    }),
    JSON.stringify({ email: "user@acme.com" })
  )
);
```

`HttpClientNode` doesn't support redirects yet.

## 🤔️ Why another HTTP client?

While [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) is great... It's not yet natively available in [Node.js](https://github.com/nodejs/node/issues/19393). It's also missing an important feature: an interface.

```ts
interface HttpClient {
  send(request: HttpRequest): Promise<HttpResponse>;
}
```

Let's say you have an API client:

```ts
class API {
  async getUser(id: string): Promise<User> {
    const response = await fetch(/* ... */);

    return await response.json();
  }
}
```

If we want to test this API client, we need to mock HTTP requests. It's really hard to do and often requires [magic](https://github.com/nock/nock).

By depending on an interface for an HTTP client we can make this a lot easier:

```ts
class API {
  constructor(private readonly httpClient: HttpClient) {}

  async getUser(id: string): Promise<User> {
    const response = await this.httpClient.send(
      new HttpRequest(/* ... */)
    );

    return JSON.parse(response.getBody());
  }
}
```

In our test we can use `HttpClientFixed`:

```ts
class HttpClientFixed implements HttpClient {
  private lastRequest: HttpRequest | undefined;

  constructor(private readonly response: HttpResponse) {}

  async send(request: HttpRequest): Promise<HttpResponse> {
    this.lastRequest = request;

    return this.response;
  }

  getLastRequest() {
    return this.lastRequest;
  }
}
```

Our test will look something like this:

```ts
test("our API client works", async () => {
  const http = new HttpClientFixed(
    new HttpResponse(
      200,
      new HttpHeaders({ "x-ratelimit-remaining": "200" }),
      '{"id":"id","name":"Hans"}'
    )
  );

  const api = new API(http);

  expect(await api.getUser("id")).toEqual({ id: "id", name: "Hans" });
  expect(http.getLastRequest()).toEqual(new HttpRequest(/* ... */));
})
```

In PHP world this concept is known as [PSR-18: HTTP Client](https://www.php-fig.org/psr/psr-18/).

Of course, this makes only sense in TypeScript world. Interfaces are not available in JavaScript.

Apart from testing, there are more benefits...

We can log requests for debugging purposes:

```ts
class HttpClientConsoleLogging implements HttpClient {
  constructor(private readonly client: HttpClient) {}

  async send(request: HttpRequest) {
    console.log("Request...", request.getMethod(), request.getURL().toString());
    const response = await this.client.send(request);
    console.log("Response...", response.getStatusCode(), response.getBody());

    return response;
  }
}
```

```ts
const http = new HttpClientConsoleLogging(
  new HttpClientNode()
);

const api = new API(http);

// Request and response will be logged to the console...
await api.getUser("id");
```

More ideas (not included in this package):
- Store requests (and responses) of calls that failed
- Keep track of rate limits
- Add credentials to requests
- ...

## 💯 Tests

To run the tests:

```bash
npm run test
```

## ❓ Help

We welcome your feedback, ideas and suggestions. We really want to make your life easier, so if we’re falling short or should be doing something different, we want to hear about it.

Please create an issue or contact us via the chat on our website.

## 🔒 Security

If you discover any security related issues, please email hans at journy io instead of using the issue tracker.
