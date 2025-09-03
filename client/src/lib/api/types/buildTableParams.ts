export interface SortingColumn {
    id: string;
    desc: boolean;
}

export interface TableState {
    pageIndex: number;
    pageSize: number;
    globalFilter: string;
    sorting: SortingColumn[];
}

export interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

export interface Router {
    push: (url: string) => void;
    replace: (url: string) => void;
}

export interface TablePatchToUrlParams {
    router: Router;
    pathname: string;
    searchParams: URLSearchParams | Record<string, string> | string;
    patch: Record<string, string | number | null | undefined>;
    method?: "push" | "replace";
}

export interface CreateTableUrlSyncParams {
    router: Router;
    pathname: string;
    searchParams: URLSearchParams | Record<string, string> | string;
}

export interface FetchTableResponse {
    data: unknown[];
    pagination: { pageIndex: number; pageSize: number; totalPages: number; totalItems: number };
}

export type SearchParamsType = URLSearchParams | Record<string, string> | string | { [key: string]: string | string[] | undefined };

export type NormalizeParamsInput =
    | { params: Record<string, string | string[]>; defaults?: Partial<TableState> }
    | { searchParams: SearchParamsType; defaults?: Partial<TableState> };
