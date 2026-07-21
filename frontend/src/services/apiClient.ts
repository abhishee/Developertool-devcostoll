/**
 * Central API client for DevCostoll frontend.
 *
 * Always uses a relative /api path — Vite proxies it to
 * http://localhost:4000 in dev, and your reverse proxy handles
 * it in production. Never hardcode http://localhost:4000 anywhere.
 */

export const API_BASE = "/api";

export type ApiResponse<T> = {
  ok:      boolean;
  status:  number;
  data?:   T;
  error?:  string;
};

export async function getJson<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`);
    const data     = await response.json();
    return {
      ok:    response.ok,
      status: response.status,
      data:  data as T,
      error: response.ok ? undefined : (data?.error || response.statusText),
    };
  } catch (error) {
    return { ok: false, status: 0, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await response.json();
    return {
      ok:    response.ok,
      status: response.status,
      data:  data as T,
      error: response.ok ? undefined : (data?.error || response.statusText),
    };
  } catch (error) {
    return { ok: false, status: 0, error: error instanceof Error ? error.message : String(error) };
  }
}

/** Quick health check — resolves true if the backend is reachable. */
export async function checkBackend(): Promise<boolean> {
  try {
    const r = await fetch(`${API_BASE}/health`);
    return r.ok;
  } catch {
    return false;
  }
}
