export const unauthorizedRedirection = async (nextHint?: string): Promise<never> => {
    const loginPath = process.env.NEXT_PUBLIC_LOGIN_PATH || "/auth";
    const isServer = typeof window === "undefined";

    if (!isServer) {
        const next = nextHint ?? location.pathname + location.search + location.hash;
        location.assign(`${loginPath}?next=${encodeURIComponent(next)}`);
        return new Promise<never>(() => {});
    } else {
        const { headers } = await import("next/headers");
        const { redirect } = await import("next/navigation");

        const h = await headers();
        const ref = nextHint ?? h.get("referer") ?? "/";
        redirect(`${loginPath}?next=${encodeURIComponent(ref)}`);

        throw new Error("Redirect failed");
    }
};
