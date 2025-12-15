import type { ErrorResponse } from "../types";

export async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  return data as T;
}

export async function handleApiCall<T>(
  apiCall: () => Promise<Response>
): Promise<T> {
  try {
    const response = await apiCall();
    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Response) {
      const errorData = await parseResponse<ErrorResponse>(error);
      throw errorData;
    }
    throw error;
  }
}

export function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    (error as ErrorResponse).error === true
  );
}

export function isTooEarlyError(error: unknown): boolean {
  return isErrorResponse(error) && error.code === 425;
}
