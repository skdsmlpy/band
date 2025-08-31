import { API_URL } from "@/lib/api";

let inMemoryToken: string | null = null;
let refreshing = false;

export function setToken(token: string | null) {
  inMemoryToken = token;
  if (token) document.cookie = `token=${token}; path=/`;
  else document.cookie = "token=; Max-Age=0; path=/";
}

export function getToken() {
  return inMemoryToken;
}

export async function refreshToken(): Promise<string | null> {
  if (refreshing) return inMemoryToken;
  refreshing = true;
  try {
    // Stub: call backend refresh when implemented
    return inMemoryToken;
  } finally {
    refreshing = false;
  }
}

export async function createFetchClient() {
  return async function fetchWithAuth(input: string, init: RequestInit = {}) {
    const token = getToken();
    const headers = new Headers(init.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    const res = await fetch(`${API_URL}${input}`, { ...init, headers });
    if (res.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        headers.set("Authorization", `Bearer ${newToken}`);
        return fetch(`${API_URL}${input}`, { ...init, headers });
      }
    }
    return res;
  };
}
