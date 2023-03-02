import { assertFalse, assertThrows, describe, it } from "./_dev_deps.ts";
import { assertValidDirectives } from "./util.ts";

describe("assertValidDirectives", () => {
  it("should throw error", () => {
    assertThrows(() =>
      assertValidDirectives({ "max-age": -1, "s-maxage": -1.1 })
    );
    assertThrows(() =>
      assertValidDirectives({ "max-age": 1.1, "s-maxage": 100 })
    );
  });

  it("should not throw error", () => {
    assertFalse(assertValidDirectives({ "max-age": 0, "s-maxage": 1 }));
    assertFalse(
      assertValidDirectives({
        "max-age": 60,
        immutable: true,
        public: true,
      }),
    );
  });
});
