import supabase from "@/services/supabase/supabase";

/**
 * Enum representing different types of API responses
 */
export enum ApiResponseType {
  /** Standard JSON response */
  Json = "JSON",
  /** Streaming response for real-time data */
  Stream = "STREAM",
  /** Raw response object */
  Raw = "RAW",
}

/** Base URL for API endpoints */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "https://your_api_production_url.com";

/**
 * Retrieves authentication tokens from the current Supabase session
 * @throws {Error} If no active session is found
 * @returns {Promise<{refreshToken: string, accessToken: string}>} Object containing refresh and access tokens
 */
export async function getAuthTokens() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    throw new Error("No session available");
  }

  return {
    refreshToken: data.session.refresh_token,
    accessToken: data.session.access_token,
  };
}

/**
 * Handles API response based on the specified response type
 * @param response - Fetch Response object
 * @param wantedResponseType - Desired type of response processing
 * @throws {Error} If response status is not 200
 * @returns {Promise<any>} Processed response data
 */
async function handleResponse(response: Response, wantedResponseType: ApiResponseType) {
  if (response.status !== 200) {
    throw new Error("");
  }

  switch (wantedResponseType) {
    case ApiResponseType.Json: {
      const jsonResponse = await response.json();
      return jsonResponse;
    }

    case ApiResponseType.Stream: {
      return response.body?.getReader();
    }

    case ApiResponseType.Raw:
      return response;

    default:
      return await response.json();
  }
}

/**
 * Performs a GET request to the API
 * @param path - API endpoint path
 * @param responseType - Type of response processing desired
 * @returns {Promise<T>} Processed response data
 * @template T - Expected response data type
 */
export async function getApi<T>(path: string, responseType = ApiResponseType.Json) {
  const authTokens = await getAuthTokens();

  const response = await fetch(API_BASE_URL + path, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-refreshToken": authTokens.refreshToken,
      "x-accessToken": authTokens.accessToken,
    },
  });

  return handleResponse(response, responseType) as T;
}

/**
 * Performs a POST request to the API
 * @param path - API endpoint path
 * @param body - Request body object
 * @param responseType - Type of response processing desired
 * @returns {Promise<T>} Processed response data
 * @template T - Expected response data type
 */
export async function postApi<T>(path: string, body: object, responseType = ApiResponseType.Json) {
  const authTokens = await getAuthTokens();

  const response = await fetch(API_BASE_URL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-refreshToken": authTokens.refreshToken,
      "x-accessToken": authTokens.accessToken,
    },
    body: JSON.stringify({
      ...body,
    }),
  });

  return handleResponse(response, responseType) as T;
}

/**
 * Performs a PUT request to the API
 * @param path - API endpoint path
 * @param body - Request body object
 * @param responseType - Type of response processing desired
 * @returns {Promise<T>} Processed response data
 * @template T - Expected response data type
 */
export async function updateApi<T>(
  path: string,
  body: object,
  responseType = ApiResponseType.Json
) {
  const authTokens = await getAuthTokens();

  const response = await fetch(API_BASE_URL + path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-refreshToken": authTokens.refreshToken,
      "x-accessToken": authTokens.accessToken,
    },
    body: JSON.stringify({
      ...body,
    }),
  });

  return handleResponse(response, responseType) as T;
}

/**
 * Performs a DELETE request to the API
 * @param path - API endpoint path
 * @param body - Request body object
 * @param responseType - Type of response processing desired
 * @returns {Promise<T>} Processed response data
 * @template T - Expected response data type
 */
export async function deleteApi<T>(
  path: string,
  body: object,
  responseType = ApiResponseType.Json
) {
  const authTokens = await getAuthTokens();

  const response = await fetch(API_BASE_URL + path, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-refreshToken": authTokens.refreshToken,
      "x-accessToken": authTokens.accessToken,
    },
    body: JSON.stringify({
      ...body,
    }),
  });

  return handleResponse(response, responseType) as T;
}

/**
 * Example usage:
 * ```typescript
 * // GET request
 * const data = await getApi<UserData>('/users/1');
 *
 * // POST request with JSON response
 * const response = await postApi<ApiResponse>('/users', { name: 'John' });
 *
 * // GET request with streaming response
 * const stream = await getApi<ReadableStreamDefaultReader>('/events', ApiResponseType.Stream);
 * ```
 */

// export async function streamApi(path: string, body: object) {
//   const authTokens = await getAuthTokens();

//   const response = await fetch(API_BASE_URL + path, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-refreshToken": authTokens.refreshToken,
//       "x-accessToken": authTokens.accessToken,
//     },
//     body: JSON.stringify({
//       ...body,
//     }),
//   });
// }
