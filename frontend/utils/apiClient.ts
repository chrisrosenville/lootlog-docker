"use client";

import { IResponseFormat } from "@/types/fetchResponse.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const apiClient = {
  fetch: async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: "include",
    });

    if (response.status === 413) {
      return {
        OK: false,
        message: "Image is too large",
      };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json() as Promise<IResponseFormat>;
  },
};
