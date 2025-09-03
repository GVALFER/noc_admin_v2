import { CreateTableUrlSyncParams, NormalizeParamsInput, PaginationState, SearchParamsType, SortingColumn, TablePatchToUrlParams, TableState } from "./types/buildTableParams";

const convertToURLSearchParams = (searchParams: SearchParamsType): URLSearchParams => {
    if (searchParams instanceof URLSearchParams) {
        return searchParams;
    }
    if (typeof searchParams === "string") {
        return new URLSearchParams(searchParams);
    }

    const sp = new URLSearchParams();
    Object.entries(searchParams || {}).forEach(([key, value]) => {
        if (value !== undefined) {
            const stringValue = Array.isArray(value) ? value[value.length - 1] : String(value);
            if (stringValue) sp.set(key, stringValue);
        }
    });
    return sp;
};

export const encodeSorting = (sorting: SortingColumn[] = []): string => sorting.map((s) => `${s.id}.${s.desc ? "desc" : "asc"}`).join(",");

export const decodeSorting = (str: string = ""): SortingColumn[] =>
    str
        .split(",")
        .filter(Boolean)
        .map((p) => {
            const [id, dir] = p.split(".");
            return { id, desc: (dir || "asc").toLowerCase() === "desc" };
        });

export const getTableStateFromUrl = (searchParams: SearchParamsType): TableState => {
    const sp = convertToURLSearchParams(searchParams);

    return {
        pageIndex: Math.max(0, Number(sp.get("pageIndex") ?? 0)),
        pageSize: Math.max(1, Number(sp.get("pageSize") ?? 10)),
        globalFilter: sp.get("globalFilter") ?? "",
        sorting: decodeSorting(sp.get("sorting") || ""),
    };
};

export const applyTablePatchToUrl = ({ router, pathname, searchParams, patch, method = "replace" }: TablePatchToUrlParams): void => {
    const currentParams = searchParams instanceof URLSearchParams ? searchParams.toString() : new URLSearchParams(searchParams || {}).toString();
    const sp = new URLSearchParams(currentParams);

    Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === "") {
            sp.delete(k);
        } else {
            sp.set(k, String(v));
        }
    });

    const url = `${pathname}?${sp.toString()}`;
    router[method](url);
};

const buildUrlQuery = (state: TableState): string => {
    const sp = new URLSearchParams();
    sp.set("pageIndex", String(state.pageIndex));
    sp.set("pageSize", String(state.pageSize));
    if (state.globalFilter) sp.set("globalFilter", state.globalFilter);
    const sortingStr = encodeSorting(state.sorting);
    if (sortingStr) sp.set("sorting", sortingStr);
    return sp.toString();
};

export const createTableUrlSync = ({ router, pathname, searchParams }: CreateTableUrlSyncParams) => {
    const state = getTableStateFromUrl(searchParams);

    return {
        state,
        onPaginationChange: (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => {
            const currentPagination = { pageIndex: state.pageIndex, pageSize: state.pageSize };
            const next = typeof updater === "function" ? updater(currentPagination) : updater;
            applyTablePatchToUrl({
                router,
                pathname,
                searchParams,
                patch: {
                    pageIndex: next.pageIndex ?? state.pageIndex,
                    pageSize: next.pageSize ?? state.pageSize,
                },
            });
        },
        onSortingChange: (updater: SortingColumn[] | ((prev: SortingColumn[]) => SortingColumn[])) => {
            const next = typeof updater === "function" ? updater(state.sorting) : updater;
            applyTablePatchToUrl({
                router,
                pathname,
                searchParams,
                patch: { sorting: encodeSorting(next) },
            });
        },
        onGlobalFilterChange: (value: string) => {
            applyTablePatchToUrl({
                router,
                pathname,
                searchParams,
                patch: { globalFilter: value || null },
            });
        },
        urlQuery: buildUrlQuery(state),
    };
};

export const normalizeParams = (input: NormalizeParamsInput) => {
    const extractPlainParams = (): Record<string, string> => {
        if ("searchParams" in input) {
            const sp = convertToURLSearchParams(input.searchParams);
            return Object.fromEntries(sp.entries());
        }

        const p = input.params || {};
        const getLastValue = (v: string | string[]) => (Array.isArray(v) ? String(v[v.length - 1]) : String(v ?? ""));

        return {
            pageIndex: p.pageIndex !== undefined ? getLastValue(p.pageIndex) : "",
            pageSize: p.pageSize !== undefined ? getLastValue(p.pageSize) : "",
            globalFilter: p.globalFilter !== undefined ? getLastValue(p.globalFilter) : "",
            sorting: p.sorting !== undefined ? getLastValue(p.sorting) : "",
        };
    };

    const plain = extractPlainParams();
    const defaults = input.defaults || {};

    const pageIndex = Math.max(0, Number(plain.pageIndex || defaults.pageIndex || 0));
    const pageSize = Math.max(1, Number(plain.pageSize || defaults.pageSize || 10));
    const globalFilter = (plain.globalFilter ?? defaults.globalFilter ?? "").trim();
    const sorting = plain.sorting ? decodeSorting(plain.sorting) : Array.isArray(defaults.sorting) ? defaults.sorting! : [];

    const tableState: TableState = { pageIndex, pageSize, globalFilter, sorting };
    const errorProps = {
        data: [],
        pagination: { pageIndex: 0, pageSize: 10, totalPages: 0, totalItems: 0 },
    };

    return {
        pageIndex,
        pageSize,
        globalFilter,
        sorting,
        urlQuery: buildUrlQuery(tableState),
        errorProps,
    };
};
