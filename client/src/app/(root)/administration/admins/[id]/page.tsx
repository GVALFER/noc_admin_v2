import { OnError } from "@/components/ui/onError";
import Profile from "./profile";
import { api } from "@/lib/api/fetcher";
import { ResponseData } from "../types/admin";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    try {
        const data = await api.get(`users/admins/${id}`).json<ResponseData>();
        return <Profile initialData={data} userId={id} />;
    } catch (err) {
        return <OnError error={err} />;
    }
};

export default Page;
