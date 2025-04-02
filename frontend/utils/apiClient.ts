"use client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const apiClient = {
  fetch: async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  },
};
