"use server";

const BACKEND_URL = "http://backend-dev:3456";

export async function fetchFromBackend(path: string, options: RequestInit) {
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

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// const INTERNAL_API_URL =
//   process.env.NEXT_INTERNAL_API_URL || "http://backend-dev:3456";

// export async function serverFetch(path: string, options: RequestInit = {}) {
//   try {
//     // For server components, use the internal Docker network URL
//     const res = await fetch(`${INTERNAL_API_URL}${path}`, {
//       ...options,
//     });

//     return res;
//   } catch (error) {
//     console.error("Server fetch error:", error);
//     throw error;
//   }
// }

// export async function clientFetch(path: string, options: RequestInit = {}) {
//   // For client components, use the public URL through Nginx
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     ...options,
//   });

//   return res;
// }
