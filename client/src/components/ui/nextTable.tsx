"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createTableUrlSync } from "@/lib/api/buildTableParams";
import { ColumnDef, getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table";
import { Pagination } from "./pagination";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export interface PaginationProps {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
}

interface TableData<TData> {
    data: TData[];
    pagination: PaginationProps;
}

interface NextTableProps<TData> {
    columns: ColumnDef<TData, unknown>[];
    data: TableData<TData>;
    pageSizeOptions?: number[];
    searchPlaceholder?: string;
    getRowId?: (row: TData, index: number) => string;
    isLoading?: boolean;
}

export const NextTable = <TData extends object>({
    columns,
    data: tableData,
    pageSizeOptions = [2, 5, 10, 20, 50, 100],
    searchPlaceholder = "Search…",
    getRowId,
    isLoading,
}: NextTableProps<TData>) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const sync = createTableUrlSync({ router, pathname, searchParams });

    const pagination = tableData?.pagination || { pageIndex: 0, pageSize: 10, totalPages: 0, totalItems: 0 };
    const data = tableData?.data || [];

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
    const pageIndex = sync.state.pageIndex ?? 0;
    const pageSize = sync.state.pageSize ?? pagination.pageSize;
    const totalItems = pagination.totalItems ?? 0;
    const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1;
    const endItem = totalItems === 0 ? 0 : Math.min(totalItems, pageIndex * pageSize + data.length);

    const syncPageIndex = typeof window !== "undefined" ? (sync.state.pageIndex ?? pagination.pageIndex) : pagination.pageIndex;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <Input className="w-full max-w-sm" placeholder={searchPlaceholder} defaultValue={sync.state.globalFilter} onChange={(e) => table.setGlobalFilter(e.target.value)} />
                {isLoading && <Spinner className="ml-1" />}
            </div>

            <div className="rounded border border-border bg-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-secondary/40">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id} className="border-b border-border/70">
                                {hg.headers.map((h) => (
                                    <th
                                        key={h.id}
                                        className="h-12 px-4 first:pl-5 last:pr-5 text-left text-foreground/80 font-bold select-none cursor-pointer"
                                        onClick={h.column.getToggleSortingHandler()}
                                        title="Ordenar"
                                    >
                                        <div className="flex items-center gap-3">
                                            {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                                            <span className="transition-all duration-200 ease-in-out text-foreground/60">
                                                {{
                                                    asc: <ChevronDown size={18} />,
                                                    desc: <ChevronUp size={18} />,
                                                }[h.column.getIsSorted() as string] || ""}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((r) => (
                                <tr key={r.id} className="border-t border-border/60 hover:bg-secondary/30">
                                    {r.getVisibleCells().map((c) => (
                                        <td key={c.id} className="py-4 px-4 first:pl-5 last:pr-5">
                                            {flexRender(c.column.columnDef.cell, c.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={table.getAllColumns().length} className="py-16 text-center text-muted-foreground">
                                    No results.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="text-sm text-muted-foreground">
                    {totalItems > 0 ? (
                        <>
                            Showing <span className="font-medium text-foreground">{startItem}</span>–<span className="font-medium text-foreground">{endItem}</span> of{" "}
                            <span className="font-medium text-foreground">{totalItems}</span>
                        </>
                    ) : (
                        <>Showing 0–0 of 0</>
                    )}
                </div>

                <div className="justify-self-center">
                    {showPagination && (
                        <Pagination
                            page={syncPageIndex + 1}
                            totalPages={pagination.totalPages}
                            onPageChange={(p) =>
                                sync.onPaginationChange({
                                    pageIndex: p - 1,
                                    pageSize,
                                })
                            }
                            className="mt-0"
                            siblingCount={1}
                            boundaryCount={1}
                        />
                    )}
                </div>

                <div className="justify-self-end flex items-center gap-2">
                    <label htmlFor="rows-per-page" className="text-sm text-muted-foreground">
                        Rows:
                    </label>
                    <select
                        id="rows-per-page"
                        className="h-9 rounded-lg bg-background border border-border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                        value={pageSize}
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                    >
                        {pageSizeOptions.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};
