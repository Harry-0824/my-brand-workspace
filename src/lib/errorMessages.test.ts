import { describe, expect, it } from "vitest";
import {
  AUTH_REQUIRED_MESSAGE,
  getUserFacingErrorMessage
} from "./errorMessages";

describe("getUserFacingErrorMessage", () => {
  it("hides raw auth session errors from user-facing UI", () => {
    expect(
      getUserFacingErrorMessage(
        new Error("Failed to read authenticated user: Auth session missing!"),
        "目前無法讀取資料，請稍後再試。"
      )
    ).toBe(AUTH_REQUIRED_MESSAGE);
  });

  it("keeps scoped non-auth errors visible", () => {
    expect(
      getUserFacingErrorMessage(
        new Error("Failed to load reports task overview: permission denied"),
        "目前無法讀取資料，請稍後再試。"
      )
    ).toBe("Failed to load reports task overview: permission denied");
  });

  it("uses fallback copy for unknown thrown values", () => {
    expect(
      getUserFacingErrorMessage("unknown", "目前無法讀取資料，請稍後再試。")
    ).toBe("目前無法讀取資料，請稍後再試。");
  });
});
