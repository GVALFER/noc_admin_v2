export type BackendErrorPayload = {
    status?: number;
    error?: string;
    code?: string;
    [k: string]: unknown;
};
