import {
  assert,
  assertExists,
  assertThrows,
  describe,
  equalsResponse,
  it,
} from "./_dev_deps.ts";
import cacheControl from "./mod.ts";

describe("default export", () => {
  it("should exists", () => {
    assertExists(cacheControl);
  });

  it("should throw error", () => {
    assertThrows(() => cacheControl({ "max-age": -1, "s-maxage": -1.1 }));
  });

  it("should not throw error", () => {
    assert(cacheControl({ "max-age": 0, "s-maxage": 1 }));
  });

  it("should contain cache-control header", async () => {
    const middleware = cacheControl({
      "max-age": 604800,
      immutable: true,
      public: true,
    });
    const handler = () => new Response("hello");

    const response = await middleware(new Request("test:"), handler);

    assert(
      equalsResponse(
        response,
        new Response("hello", {
          headers: {
            "cache-control": "max-age=604800, immutable, public",
          },
        }),
      ),
    );
  });
});
