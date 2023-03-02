// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { type Middleware } from "./deps.ts";
import {
  type CacheDirectives,
  type ExtensionDirectives,
  withCacheControl,
} from "./cache_control.ts";
import { assertValidDirectives } from "./util.ts";
export {
  type CacheDirectives,
  type ExtensionDirectives,
} from "./cache_control.ts";
export { type Middleware } from "./deps.ts";

/** HTTP `cache-control` header middleware factory.
 *
 * @example
 * ```ts
 * import cacheControl from "https://deno.land/x/http_cache_control@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const middleware = cacheControl({
 *   "max-age": 604800,
 *   immutable: true,
 *   public: true,
 * });
 * declare const request: Request;
 * const handler = () => new Response("hello");
 *
 * const response = await middleware(request, handler);
 *
 * assertEquals(
 *   response.headers.get("cache-control"),
 *   "max-age=604800, immutable, public",
 * );
 * ```
 *
 * @throws {AggregateError} If directives include invalid value.
 */
export default function cacheControl(
  directives: CacheDirectives & ExtensionDirectives,
): Middleware {
  assertValidDirectives(directives);

  return async (request, next) => {
    const response = await next(request);

    return withCacheControl(request, response, directives);
  };
}
