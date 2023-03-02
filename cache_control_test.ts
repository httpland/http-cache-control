import {
  assert,
  assertEquals,
  describe,
  equalsResponse,
  it,
} from "./_dev_deps.ts";
import {
  CacheDirectives,
  ExtensionDirectives,
  stringifyCacheDirectives,
  stringifyDirective,
  withCacheControl,
} from "./cache_control.ts";

describe("stringifyDirective", () => {
  type Case = [string, number | true, string];

  it("should return empty if the key is empty", () => {
    const table: Case[] = [
      ["", 0, ""],
      ["", true, ""],
      ["", -1, ""],
    ];

    table.forEach(([key, value, expected]) => {
      assertEquals(stringifyDirective(key, value), expected);
    });
  });

  it("should return key-value format if the value is number", () => {
    const table: Case[] = [
      ["key", 0, "key=0"],
      ["key", -0, "key=0"],
      ["key", -1, "key=-1"],
    ];

    table.forEach(([key, value, expected]) => {
      assertEquals(stringifyDirective(key, value), expected);
    });
  });

  it("should return value only format if the value is true", () => {
    const table: Case[] = [
      ["key", true, "key"],
    ];

    table.forEach(([key, value, expected]) => {
      assertEquals(stringifyDirective(key, value), expected);
    });
  });
});

describe("stringifyCacheDirectives", () => {
  it("should return empty if the key is empty", () => {
    const table: [Record<string, number | true>, string][] = [
      [{}, ""],
      [{ key: true, key2: true }, "key, key2"],
      [{ key: 100, "key-2": true }, "key=100, key-2"],
    ];

    table.forEach(([record, expected]) => {
      assertEquals(stringifyCacheDirectives(record), expected);
    });
  });
});

describe("withCacheControl", () => {
  it("should return same response if the response has cache-control header yet", async () => {
    const table: [Request, Response, Response][] = [
      [
        new Request("test:"),
        new Response(null, { headers: { "cache-control": "" } }),
        new Response(null, { headers: { "cache-control": "" } }),
      ],
      [
        new Request("test:"),
        new Response(null, { headers: { "cache-control": "max-age=100" } }),
        new Response(null, { headers: { "cache-control": "max-age=100" } }),
      ],
    ];

    await Promise.all(table.map(async ([request, response, expected]) => {
      const result = await withCacheControl(
        request,
        response,
        { "max-age": 10000, immutable: true },
      );

      assert(equalsResponse(result, expected));
    }));
  });

  it("should add cache-control field", async () => {
    const table: [
      Request,
      Response,
      CacheDirectives & ExtensionDirectives,
      Response,
    ][] = [
      [
        new Request("test:"),
        new Response(null),
        {
          immutable: true,
          "max-age": 100,
          "must-revalidate": true,
          "must-understand": true,
          "no-cache": true,
          "no-store": true,
          "no-transform": true,
          private: true,
          "proxy-revalidate": true,
          public: true,
          "s-maxage": 1000,
          "stale-if-error": 1,
          "stale-while-revalidate": 10,
        },
        new Response(null, {
          headers: {
            "cache-control":
              "immutable, max-age=100, must-revalidate, must-understand, no-cache, no-store, no-transform, private, proxy-revalidate, public, s-maxage=1000, stale-if-error=1, stale-while-revalidate=10",
          },
        }),
      ],
    ];

    await Promise.all(
      table.map(async ([request, response, directives, expected]) => {
        const result = await withCacheControl(
          request,
          response,
          directives,
        );

        assert(await equalsResponse(result, expected, true));
      }),
    );
  });
});
