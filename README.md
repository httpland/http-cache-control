# http-cache-control

HTTP `Cache-Control` header middleware for standard `Request` and `Response`.

## What

Middleware for HTTP `Content-Control` headers.

Compliant:

- [RFC 9111, 5.2. Cache-Control](https://www.rfc-editor.org/rfc/rfc9111.html#name-cache-control)
- [RFC 8246, HTTP Immutable Responses](https://www.rfc-editor.org/rfc/rfc8246.html)
- [RFC 5861, HTTP Cache-Control Extensions for Stale Content](https://www.rfc-editor.org/rfc/rfc5861)

## Middleware

For a definition of Universal HTTP middleware, see the
[http-middleware](https://github.com/httpland/http-middleware) project.

## Usage

Middleware factory is exported by default.

```ts
import cacheControl from "https://deno.land/x/http_cache_control@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = cacheControl({
  "max-age": 604800,
  immutable: true,
  public: true,
});
declare const request: Request;
const handler = () => new Response("hello");

const response = await middleware(request, handler);

assertEquals(
  response.headers.get("cache-control"),
  "max-age=604800, immutable, public",
);
```

## Deep dive

If the `Response` already has a `Cache-Control` header, do nothing.

```ts
import cacheControl from "https://deno.land/x/http_cache_control@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const middleware = cacheControl({
  "max-age": 604800,
  immutable: true,
  public: true,
});
declare const request: Request;
const handler = () =>
  new Response("hello", { headers: { "cache-control": "no-cache" } });

const response = await middleware(request, handler);

assertEquals(response.headers.get("cache-control"), "no-cache");
```

### Throwing error

If a number other than non-negative integer is specified, `AggregateError` will
be thrown.

```ts
import cacheControl from "https://deno.land/x/http_cache_control@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => cacheControl({ "max-age": -100, "s-maxage": 1.1 }));
```

## License

Copyright © 2023-present [httpland](https://github.com/httpland).

Released under the [MIT](./LICENSE) license
