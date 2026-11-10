import { describe, expect, it, vi } from "vitest";
import { request, setUnauthorizedHandler } from "@/api/http";
import { ApiError } from "@/api/api-error";

function respond(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("http client", () => {
  it("sends credentials, builds the query and skips empty values", async () => {
    const fetchMock = vi.fn().mockResolvedValue(respond(200, { ok: true }));
    vi.stubGlobal("fetch", fetchMock);
    await request("/public/products", { query: { page: 2, search: "", category: "camisetas", featured: undefined } });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/public\/products\?page=2&category=camisetas$/);
    expect(init.credentials).toBe("include");
  });

  it("returns undefined for 204", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    await expect(request("/auth/logout", { method: "POST" })).resolves.toBeUndefined();
  });

  it("maps error payloads to ApiError with code", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respond(400, { statusCode: 400, code: "wrong_password", message: "bad" })));
    await expect(request("/auth/password", { method: "PUT", body: {} })).rejects.toMatchObject({ status: 400, code: "wrong_password", message: "bad" });
  });

  it("maps network failures to status 0", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fail")));
    const error = (await request("/x").catch((caught: unknown) => caught)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(0);
    expect(error.code).toBe("network_error");
  });

  it("calls the unauthorized handler on 401", async () => {
    const handler = vi.fn();
    setUnauthorizedHandler(handler);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respond(401, { statusCode: 401, message: "no" })));
    await expect(request("/admin/products")).rejects.toMatchObject({ status: 401 });
    expect(handler).toHaveBeenCalledOnce();
    setUnauthorizedHandler(null);
  });

  it("sends json bodies with a content type and form data without one", async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(respond(200, {})));
    vi.stubGlobal("fetch", fetchMock);
    await request("/a", { method: "POST", body: { a: 1 } });
    expect(fetchMock.mock.calls[0][1].headers["Content-Type"]).toBe("application/json");
    const form = new FormData();
    await request("/b", { method: "POST", form });
    expect(fetchMock.mock.calls[1][1].headers["Content-Type"]).toBeUndefined();
    expect(fetchMock.mock.calls[1][1].body).toBe(form);
  });
});
