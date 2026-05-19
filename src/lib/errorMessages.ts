export const AUTH_REQUIRED_MESSAGE = "請先登入後再查看此資料。";

const AUTH_ERROR_MARKERS = [
  "Failed to read authenticated user",
  "Failed to read auth session",
  "Auth session missing",
  "User is not authenticated"
] as const;

export function getUserFacingErrorMessage(
  error: unknown,
  fallbackMessage: string
) {
  if (!(error instanceof Error)) {
    return fallbackMessage;
  }

  if (AUTH_ERROR_MARKERS.some((marker) => error.message.includes(marker))) {
    return AUTH_REQUIRED_MESSAGE;
  }

  return error.message || fallbackMessage;
}
