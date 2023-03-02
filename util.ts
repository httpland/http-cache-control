// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { filterValues, isNonNegativeInteger, isNumber } from "./deps.ts";
import {
  type CacheDirectives,
  type ExtensionDirectives,
} from "./cache_control.ts";
export {
  type CacheDirectives,
  type ExtensionDirectives,
} from "./cache_control.ts";
export { type Middleware } from "./deps.ts";

/** Assert the directives is valid.
 * @throws {AggregateError}
 */
export function assertValidDirectives(
  directives: CacheDirectives & ExtensionDirectives,
): asserts directives {
  const errorRecord = filterValues(
    { ...directives },
    (value) => isNumber(value) && !isNonNegativeInteger(value),
  );
  const keys = Object.keys(errorRecord);

  if (keys.length) {
    const errors = keys.map((key) =>
      RangeError(`directive must be non-negative integer. ${key}`)
    );
    throw AggregateError(errors, "directives include invalid value");
  }
}
