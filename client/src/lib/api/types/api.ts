export type As = "json" | "text" | "blob" | "response";

export type CreateOptions = { base?: string };

export type RequestOptions = {
    query?: Record<string, unknown> | URLSearchParams;
    headers?: HeadersInit;
    as?: As; // default: json
    cache?: RequestCache; // default: no-store
    signal?: AbortSignal;
    ssr?: boolean; // Default: false
};

export type BodyOptions = { json: unknown } | { form: FormData } | { body: BodyInit } | undefined;

export type SSRContext = {
    headers: Headers;
    origin?: string;
};

export type APIContext = {
    params: Promise<{ path?: string[] }>;
};

export type RequestArgs = {
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    path: string;
    opts?: RequestOptions;
    data?: BodyOptions;
};

export type ApiError = {
    status: number;
    error: string;
    code?: string | undefined;
    message: string;
    [k: string]: unknown;
};

export interface StatusError extends Error {
    status?: number;
}
