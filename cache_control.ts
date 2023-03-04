// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { CachingHeader } from "./deps.ts";

export interface CacheDirectives {
  /**
   * @see [RFC 9111, 5.2.2.1. max-age](https://www.rfc-editor.org/rfc/rfc9111.html#name-max-age-2)
   */
  readonly "max-age"?: number;

  /**
   * @see [RFC 9111, 5.2.2.2. must-revalidate](https://www.rfc-editor.org/rfc/rfc9111.html#name-must-revalidate)
   */
  readonly "must-revalidate"?: true;

  /**
   * @see [RFC 9111, 5.2.2.3. must-understand](https://www.rfc-editor.org/rfc/rfc9111.html#name-must-understand)
   */
  readonly "must-understand"?: true;

  /**
   * @see [RFC 9111, 5.2.2.4. no-cache](https://www.rfc-editor.org/rfc/rfc9111.html#name-no-cache-2)
   */
  readonly "no-cache"?: true;

  /**
   * @see [5.2.2.5. no-store](https://www.rfc-editor.org/rfc/rfc9111.html#name-no-store-2)
   */
  readonly "no-store"?: true;

  /**
   * @see [RFC 9111, 5.2.2.6. no-transform](https://www.rfc-editor.org/rfc/rfc9111.html#name-no-transform-2)
   */
  readonly "no-transform"?: true;

  /**
   * @see [RFC 9111, 5.2.2.7. private](https://www.rfc-editor.org/rfc/rfc9111.html#name-private)
   */
  readonly private?: true;

  /**
   * @see [RFC 9111, 5.2.2.8. proxy-revalidate](https://www.rfc-editor.org/rfc/rfc9111.html#name-proxy-revalidate)
   */
  readonly "proxy-revalidate"?: true;

  /**
   * @see [RFC 9111, 5.2.2.9. public](https://www.rfc-editor.org/rfc/rfc9111.html#section-5.2.2.9)
   */
  readonly public?: true;

  /**
   * @see [RFC 9111, 5.2.2.10. s-maxage](https://www.rfc-editor.org/rfc/rfc9111.html#name-s-maxage)
   */
  readonly "s-maxage"?: number;
}

export interface ExtensionDirectives {
  /**
   * @see [RFC 8246, HTTP Immutable Responses](https://www.rfc-editor.org/rfc/rfc8246.html)
   */
  readonly immutable?: true;

  /** The `stale-while-revalidate` Cache-Control extension indicates that caches MAY serve the response in which it appears after it becomes stale,
   * up to the indicated number of seconds.
   * @see [RFC 5861, 3.The stale-while-revalidate Cache-Control Extension](https://www.rfc-editor.org/rfc/rfc5861#section-3)
   */
  readonly "stale-while-revalidate"?: number;

  /** The `stale-if-error` Cache-Control extension indicates that when an error is encountered,
   * a cached stale response MAY be used to satisfy the request,
   * regardless of other freshness information.
   * @see [RFC 5861, 4.The stale-if-error Cache-Control Extension](https://www.rfc-editor.org/rfc/rfc5861#section-4)
   */
  readonly "stale-if-error"?: number;
}

export function withCacheControl(
  _: Request,
  response: Response,
  directives: CacheDirectives & ExtensionDirectives,
): Response | Promise<Response> {
  const hasCacheControl = response.headers.has(CachingHeader.CacheControl);

  if (hasCacheControl) return response;

  const cacheControl = stringifyCacheDirectives({ ...directives });

  if (!cacheControl) return response;

  response.headers.set(CachingHeader.CacheControl, cacheControl);

  return response;
}

export function stringifyCacheDirectives(
  record: Record<string, number | true>,
): string {
  const fieldValues = Object.entries(record).map(([key, value]) =>
    stringifyDirective(key, value)
  );

  return fieldValues
    .filter(Boolean)
    .join(", ");
}

export function stringifyDirective(
  key: string,
  value: number | true,
): string {
  if (!key) return "";

  if (value === true) return key;

  return `${key}=${value}`;
}
