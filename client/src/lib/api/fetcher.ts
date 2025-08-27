import ky from "ky";
import { buildForwardHeaders } from "@/lib/api/buildForwardHeaders";
import { unauthorizedRedirection } from "@/lib/api//unauthorizedRedirection";
import { errorHandler } from "@/lib/api/errorHandler";

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
        beforeError: [errorHandler],
    },
});
