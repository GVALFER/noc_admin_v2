"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api/fetcher";
import { getGravatar } from "@/lib/common/getGravatar";
import { useSession } from "@/providers/sessionProvider";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const Userbar = () => {
    const session = useSession();
    const router = useRouter();
    const avatarUrl = getGravatar({ email: session?.email || "", size: 100 }) || "";

    const handleLogout = () => {
        api.post("auth/logout")
            .json()
            .then(() => router.refresh())
            .catch((err) => toast.error(err.message));
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="">
                        <AvatarImage src={avatarUrl} alt={session?.name || ""} />
                        <AvatarFallback className="text-xs">HR</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <div className="text-sm font-medium leading-none">{session?.name || "Guest User"}</div>
                            <div className="text-xs leading-none text-muted-foreground">{session?.email || ""}</div>
                        </div>
                    </DropdownMenuLabel>
                    <Separator className="my-2" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex items-center gap-2 w-full">
                                <User />
                                <span className="text-popover-foreground">Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                            <LogOut />
                            <span className="text-destructive">Log Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
