"use client";

const BACKEND_URL = "/api";

export async function serverFetch(path: string, options: RequestInit) {
  try {
    // Ensure path starts with a slash for consistency
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    // Create full URL to backend service
    const url = `${BACKEND_URL}${normalizedPath}`;

    console.log(`[Server] Fetching from: ${url}`);

    const response = await fetch(url, {
      ...options,
      cache: "no-store", // Prevent caching issues
    });

    console.log(`[Server] Response status: ${response.status}`);

    return response;
  } catch (error) {
    console.error("Server Action fetch error:", error);
    throw error;
  }
}
