"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/fetcher";
import { normalizeParams } from "@/lib/api/buildTableParams";
import { NextTable, PaginationProps } from "@/components/ui/nextTable";
import { ColumnDef } from "@tanstack/react-table";
import { Header } from "@/components/ui/header";

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
        refetchOnMount: false,
    });

    return (
        <>
            <Header title="Users" description="Browse and manage all registered users in the system." />
            <NextTable columns={columns} data={data} />
        </>
    );
}
