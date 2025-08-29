import { api } from "@/lib/api/fetcher";
import { normalizeParams } from "@/lib/api/buildTableParams";
import UsersTable from "./users";

interface ApiData {
    data: {
        id: string;
        name: string;
        email: string;
        created_at: string;
    }[];
    pagination: { pageIndex: number; pageSize: number; totalPages: number; totalItems: number };
}

export default async function Page({ searchParams }: { searchParams: Promise<URLSearchParams> }) {
    const { urlQuery, errorProps } = normalizeParams({ searchParams: await searchParams });

    const data = await api
        .get(`users?${urlQuery}`)
        .json<ApiData>()
        .catch(() => errorProps);

    return (
        <div className="p-28">
            <UsersTable initialData={data} />
        </div>
    );
}
