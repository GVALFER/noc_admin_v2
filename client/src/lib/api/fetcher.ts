import ky, { HTTPError } from "ky";
import { buildForwardHeaders } from "@/lib/api/buildForwardHeaders";
import { unauthorizedRedirection } from "@/lib/api/unauthorizedRedirection";
import { handleKyError } from "@/lib/api/errorHandler";
import type { ApiError, StatusError } from "./types/api";

type KyError = HTTPError & { status?: number; code?: string; error?: string };

const isBrowser = typeof window !== "undefined";
const API_BASE = (isBrowser ? (process.env.NEXT_PUBLIC_API_PROXY_PATH ?? "") : (process.env.API_BASE ?? "")).replace(/\/+$/, "");

export const api = ky.create({
    prefixUrl: API_BASE,
    credentials: isBrowser ? "include" : undefined,
    retry: 0, // no retries
    timeout: 60000, // 60 seconds
    hooks: {
        beforeRequest: [
            async (req) => {
                if (!isBrowser) {
                    const { headers } = await import("next/headers");
                    const h = await headers();
                    const fwd = buildForwardHeaders(h);
                    fwd.forEach((v, k) => req.headers.set(k, v));
                }
            },
        ],
        afterResponse: [
            async (_req, _opts, res) => {
                if (res.status === 403) {
                    return unauthorizedRedirection();
                }
            },
        ],
        beforeError: [handleKyError],
    },
});

export const parseError = (error: unknown): ApiError => {
    if (error instanceof HTTPError) {
        const kyErr = error as KyError;
        return {
            status: kyErr.status ?? error.response?.status ?? 0,
            error: kyErr.error ?? kyErr.message ?? "Unknown error",
            code: kyErr.code,
            message: kyErr.message,
        };
    } else if (error instanceof Error) {
        const status = (error as StatusError).status ?? 0;
        return {
            status,
            error: error.message,
            message: error.message,
        };
    } else {
        return {
            status: 0,
            error: "An unknown error occurred",
            message: "An unknown error occurred",
        };
    }
};
