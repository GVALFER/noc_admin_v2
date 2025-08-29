"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/fetcher";
import { normalizeParams } from "@/lib/api/buildTableParams";
import { NextTable, PaginationProps } from "@/components/ui/nextTable";
import { ColumnDef } from "@tanstack/react-table";

type ApiData<T> = { data: T[]; pagination: PaginationProps };

interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

export const columns = [
    { accessorKey: "name", header: "Nome" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "created_at", header: "Criado em" },
    {
        id: "actions",
        header: "Ações",
        enableSorting: false,
        enableHiding: false,
        cell: () => {},
    },
] satisfies ColumnDef<User, unknown>[];

export default function Page({ initialData }: { initialData: ApiData<User> }) {
    const { urlQuery } = normalizeParams({ searchParams: useSearchParams() });

    const { data } = useQuery<ApiData<User>>({
        queryKey: ["users", urlQuery],
        queryFn: async () => api.get(`users?${urlQuery}`).json<ApiData<User>>(),
        initialData,
    });

    const rows = data?.data ?? [];
    const pagination = data?.pagination || null;

    return <NextTable columns={columns} data={rows} pagination={pagination} />;
}
