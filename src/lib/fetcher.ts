import { getClientType } from "@/lib/utils"
// import { getToken } from '@/lib/cookie';
// import { env } from '@/lib/env';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

const GITHUB_API_BASE = "https://api.github.com"
// const GITHUB_API_BASE = process.env.NEXT_PUBLIC_GITHUB_API_BASE;

const fetchAPI = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
    // 'Cache-Control': 'no-cache, no-store, must-revalidate'
  }

  // checking session / token and add bearer token
  //   const token = getToken();

  //   if (token) {
  //     headers['Authorization'] = `Bearer ${token}`;
  //   }

  headers["X-Client"] = getClientType()
  headers["X-Timestamp"] = Date.now().toString()

  const response = await fetch(`${GITHUB_API_BASE}${url}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get("content-type")
  const responseData =
    contentType === ".csv" ? await response.text() : await response.json()

  if (!response.ok) {
    throw {
      status: response?.status,
      message: responseData?.message || response?.statusText,
      errors: responseData?.errors || null,
    }
    // throw new Error(response.statusText || responseData.message);
  }

  return responseData
}

const fetcher = {
  get: <T>(url: string, opts?: FetchOptions) =>
    fetchAPI<T>(url, { ...opts, method: "GET" }),
  post: <T>(url: string, body: object, opts?: FetchOptions) =>
    fetchAPI<T>(url, { ...opts, method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: object, opts?: FetchOptions) =>
    fetchAPI<T>(url, { ...opts, method: "PUT", body: JSON.stringify(body) }),
  del: <T>(url: string, opts?: FetchOptions) =>
    fetchAPI<T>(url, { ...opts, method: "DELETE" }),
}

export default fetcher
