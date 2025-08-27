import { BeforeErrorHook, HTTPError } from "ky";

type KyError = HTTPError & { status?: number; code?: string };

export const errorHandler: BeforeErrorHook = async (error) => {
    const body = await error.response
        ?.clone()
        .json()
        .catch(() => null);
    error.message = body?.error ?? body?.message ?? error.message;
    (error as KyError).status = error.response?.status ?? 0;
    (error as KyError).code = body?.code;
    return error;
};
