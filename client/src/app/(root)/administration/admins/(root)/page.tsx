import { OnError } from "@/components/ui/onError";
import Admins from "./admins";
import { normalizeParams } from "@/lib/api/buildTableParams";
import { api } from "@/lib/api/fetcher";
import { ResponseData } from "../types/admins";

const Page = async ({ searchParams }: { searchParams: Promise<URLSearchParams> }) => {
    const { urlQuery } = normalizeParams({ searchParams: await searchParams });

    try {
        const res = await api.get(`users/admins?${urlQuery}`).json<ResponseData>();
        return <Admins initialData={res} />;
    } catch (err) {
        return <OnError error={err} />;
    }
};

export default Page;
