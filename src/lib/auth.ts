const TOKEN_KEY = "wd_jwt";
const USER_KEY = "wd_user";

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  // Also set a plain cookie so Next.js middleware can read it server-side
  document.cookie = `wd_auth=1; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = "wd_auth=; path=/; max-age=0";
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    // Lightweight expiry check without a library: decode the payload
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return false;
    const pad = (4 - (payloadB64.length % 4)) % 4;
    const padded = payloadB64 + "=".repeat(pad);
    const payload = JSON.parse(atob(padded)) as { exp?: number };
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      removeToken();
      return false;
    }
    return true;
  } catch {
    removeToken();
    return false;
  }
};

export interface AuthUser {
  email: string;
  name: string;
  picture: string;
  role: string;
}

export const setUser = (user: AuthUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};
