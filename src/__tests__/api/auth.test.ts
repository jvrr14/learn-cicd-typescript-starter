import { describe, expect, it } from "vitest";
import { getAPIKey } from "../../api/auth.js";

describe("getAPIKey", () => {
  it("returns null when authorization header is missing", () => {
    expect(getAPIKey({})).toBeNull();
  });

  it("returns null when authorization scheme is not ApiKey", () => {
    expect(getAPIKey({ authorization: "Bearer token123" })).toBeNull();
  });

  it("returns null when authorization header has no key", () => {
    expect(getAPIKey({ authorization: "ApiKey" })).not.toBeNull();
  });

  it("returns the api key when authorization header is valid", () => {
    expect(getAPIKey({ authorization: "ApiKey my-secret-key" })).toBe(
      "my-secret-key",
    );
  });
});
