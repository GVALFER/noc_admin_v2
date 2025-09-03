"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import { OnError } from "@/components/ui/onError";
import { Stats } from "@/components/ui/stats";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { useTimezone } from "@/hooks/useTimezone";
import { api } from "@/lib/api/fetcher";
import { getColor } from "@/lib/common/getColor";
import { getGravatar } from "@/lib/common/getGravatar";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Actions from "../actions/admin";
import { ResponseData } from "../types/admin";
import CreateAccount from "../actions/adminCreate";

const getImage = (metadata: Record<string, string>) => {
    if (metadata.image) {
        return metadata.image || "";
    }
    if (metadata.email) {
        return getGravatar({ email: metadata.email, size: 200 }) || "";
    }
    return "";
};

const Profile = ({ initialData, userId }: { initialData: ResponseData; userId: string }) => {
    const { dt } = useTimezone();
    const router = useRouter();

    const { data, error } = useQuery<ResponseData>({
        queryKey: ["users", userId],
        queryFn: async () => api.get(`users/admins/${userId}`).json<ResponseData>(),
        initialData,
        refetchOnMount: false,
    });

    if (error) {
        return <OnError error={error} />;
    }

    const { user, helpers } = data;

    const userImage = getImage(user.metadata || {}) || "";

    const lastLogs: TimelineItem[] = [
        {
            date: "01/10/2025 20:40",
            title: "Admin account created",
            description: "Account created via signup",
            current: true,
        },
        {
            date: "15/11/2025 14:20",
            title: "Password changed",
            description: "Password changed via profile settings",
        },
        {
            date: "20/12/2025 09:15",
            title: "Two-factor authentication enabled",
            description: "Enabled 2FA using Authenticator app",
        },
        {
            date: "05/01/2026 11:30",
            title: "Logged in from new device",
            description: "Login from IP",
        },
        { date: "12/02/2026 16:45", title: "Role updated", description: "Promoted to Admin by OWNER" },
        {
            date: "22/03/2026 10:05",
            title: "Account suspended",
            description: "Suspended due to suspicious activity",
        },
    ]; //TO-DO

    const dataStats = [
        { label: "Tickets", value: user.stats?.tickets ?? 0 },
        { label: "Messages", value: user.stats?.messages ?? 0 },
        { label: "Accounts", value: user.accounts.length ?? 0 },
    ]; //TO-DO

    return (
        <div>
            <Header title="Profile" description="Admin profile details and settings" />
            <div className="flex gap-4 mt-6">
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="p-4 border rounded">
                        <div className="flex flex-col items-center gap-4">
                            <div>
                                {userImage ? (
                                    <Avatar className="size-18">
                                        <AvatarImage src={userImage} alt={user.name || ""} />
                                        <AvatarFallback>{(user.name || "").slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div>No Image</div>
                                )}
                            </div>
                            <div className="font-bold text-lg">{user.name}</div>
                            <div className="text-xs -mt-4 text-muted-foreground">{dt(user.created_at)}</div>
                            <div className="top-2 left-2 z-10 flex justify-center gap-2">
                                <Badge variant={getColor(user.type, "outline").variant}>{user.type}</Badge>
                                <Badge variant={getColor(user.status, "outline").variant}>{user.status}</Badge>
                            </div>
                        </div>
                        <div>
                            <Stats items={dataStats} />
                        </div>
                        <div>
                            <div className="mt-4 text-sm">
                                <ul>
                                    {Object.entries(user.metadata || {}).length > 0 ? (
                                        Object.entries(user.metadata).map(([key, value]) => (
                                            <li key={key} className="flex justify-between py-1 ">
                                                <span className="text-muted-foreground">{key}</span>
                                                <span>{value}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-muted-foreground">No metadata...</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded">
                        <div className="font-bold mb-4 flex justify-between gap-4 items-center">
                            <div className="font-bold">Linked Accounts</div>
                            <div>
                                <CreateAccount helpers={helpers} userId={userId} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            {user.accounts.length > 0 ? (
                                user.accounts.map((acc) => (
                                    <div key={acc.id} className="flex justify-between py-1 text-sm">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <Avatar className="size-8">
                                                    <AvatarImage src={getGravatar({ email: acc.email, size: 50 })} alt={acc.name || ""} />
                                                    <AvatarFallback>{(user.name || "").slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                <div>
                                                    {acc.name}{" "}
                                                    <Badge className="ml-2" variant={getColor(acc.role, "outline").variant}>
                                                        {acc.role}
                                                    </Badge>
                                                </div>
                                                <div className="text-muted-foreground text-xs">{acc.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Actions data={acc} helpers={helpers} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted-foreground">No linked accounts...</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-2/3 flex flex-col gap-4">
                    <div className="p-4 border rounded">
                        <Timeline
                            items={lastLogs}
                            heading={{
                                title: "Last logs",
                                button: (
                                    <Button variant="outline" onClick={() => router.push(`/logs/users/${userId}`)}>
                                        See all
                                    </Button>
                                ),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
