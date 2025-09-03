"use client";

import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/ui/header";
import { NextTable } from "@/components/ui/nextTable";
import { OnError } from "@/components/ui/onError";
import { useTimezone } from "@/hooks/useTimezone";
import { normalizeParams } from "@/lib/api/buildTableParams";
import { api } from "@/lib/api/fetcher";
import { getColor } from "@/lib/common/getColor";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Actions from "../actions/admins";
import { ResponseData, UserData } from "../types/admins";

const Admins = ({ initialData }: { initialData: ResponseData }) => {
    const { dt } = useTimezone();
    const { urlQuery } = normalizeParams({ searchParams: useSearchParams() });

    const { data, error } = useQuery<ResponseData>({
        queryKey: ["users", urlQuery],
        queryFn: async () => api.get(`users/admins?${urlQuery}`).json<ResponseData>(),
        initialData,
        refetchOnMount: false,
    });

    const columns = useMemo(
        () =>
            [
                { accessorKey: "name", header: "Name" },
                {
                    accessorKey: "type",
                    header: "Type",
                    cell: (r) => <Badge variant={getColor(r.row.original.type, "outline").variant}>{r.row.original.type}</Badge>,
                },
                {
                    accessorKey: "status",
                    header: "Status",
                    cell: (r) => <Badge variant={getColor(r.row.original.status, "outline").variant}>{r.row.original.status}</Badge>,
                },
                {
                    id: "accounts",
                    header: "Accounts",
                    enableSorting: false,
                    cell: (r) => <Badge variant="outline">{r.row.original.accounts.length}</Badge>,
                },
                {
                    accessorKey: "created_at",
                    header: "Created at",
                    cell: (r) => <div className="text-muted-foreground">{dt(r.row.original.created_at)}</div>,
                },
                {
                    id: "actions",
                    cell: (r) => (
                        <div className="flex justify-end">
                            <Actions data={r.row.original} helpers={data.helpers} />
                        </div>
                    ),
                },
            ] satisfies ColumnDef<UserData, unknown>[],
        [data, dt],
    );

    if (error) {
        return <OnError error={error} />;
    }

    return (
        <>
            <Header title="Admins" description="List of system administrators" />
            <NextTable columns={columns} data={data} />
        </>
    );
};

export default Admins;
