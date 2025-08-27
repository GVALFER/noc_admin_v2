"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const makeQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: 0,
            },
            mutations: {
                retry: 0,
            },
        },
    });
};

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
    if (isServer) {
        return makeQueryClient();
    }

    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
};

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient();

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryProvider;
