"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createTableUrlSync } from "@/lib/api/buildTableParams";
import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { Pagination } from "./pagination";

export interface PaginationProps {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

interface NextTableProps<TData> {
    columns: ColumnDef<TData, unknown>[];
    data: TData[];
    pagination: PaginationProps;
    pageSizeOptions?: number[];
    searchPlaceholder?: string;
    getRowId?: (row: TData, index: number) => string;
    isLoading?: boolean;
}

export const NextTable = <TData extends object>({
    columns,
    data,
    pagination = { pageIndex: 0, pageSize: 10, totalPages: 0, totalItems: 0 },
    pageSizeOptions = [2, 5, 10, 20, 50, 100],
    searchPlaceholder = "Search…",
    getRowId,
    isLoading,
}: NextTableProps<TData>) => {
    const pathname = usePathname();
    const router = useRouter();
    const sp = useSearchParams();

    const sync = createTableUrlSync({ router, pathname, searchParams: sp });

    const table = useReactTable<TData>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: pagination.totalPages ?? -1,
        state: {
            pagination: { pageIndex: sync.state.pageIndex, pageSize: sync.state.pageSize },
            sorting: sync.state.sorting,
            globalFilter: sync.state.globalFilter,
        },
        onPaginationChange: sync.onPaginationChange,
        onSortingChange: sync.onSortingChange,
        onGlobalFilterChange: sync.onGlobalFilterChange,
        getRowId,
    });

    const showPagination = (pagination.totalPages ?? 0) > 1;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <input
                    className="border px-2 h-9 rounded"
                    placeholder={searchPlaceholder}
                    defaultValue={sync.state.globalFilter}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                />
                <select className="border px-2 h-9 rounded" value={sync.state.pageSize} onChange={(e) => table.setPageSize(Number(e.target.value))}>
                    {pageSizeOptions.map((n) => (
                        <option key={n} value={n}>
                            {n} / pág.
                        </option>
                    ))}
                </select>
                {isLoading && <span>⏳</span>}
            </div>

            <table className="w-full border-collapse">
                <thead>
                    {table.getHeaderGroups().map((hg) => (
                        <tr key={hg.id}>
                            {hg.headers.map((h) => (
                                <th key={h.id} className="text-left border-b py-2 cursor-pointer select-none" onClick={h.column.getToggleSortingHandler()} title="Ordenar">
                                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                    {{
                                        asc: " 🔼",
                                        desc: " 🔽",
                                    }[h.column.getIsSorted() as string] || null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((r) => (
                        <tr key={r.id} className="border-b">
                            {r.getVisibleCells().map((c) => (
                                <td key={c.id} className="py-2">
                                    {flexRender(c.column.columnDef.cell, c.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {showPagination && (
                <div className="flex justify-center w-full mt-10">
                    <Pagination
                        page={sync.state.pageIndex + 1}
                        totalPages={pagination.totalPages}
                        onPageChange={(p) =>
                            sync.onPaginationChange({
                                pageIndex: p - 1,
                                pageSize: sync.state.pageSize,
                            })
                        }
                        className="mt-2"
                        siblingCount={1}
                        boundaryCount={1}
                    />
                </div>
            )}
            {/*<button className="border px-3 h-9 rounded disabled:opacity-50" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        « Anterior
                    </button>
                    <span>
                        Página {sync.state.pageIndex + 1} de {pagination.totalPages}
                    </span>
                    <button className="border px-3 h-9 rounded disabled:opacity-50" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Seguinte »
                    </button>*/}
        </div>
    );
};
