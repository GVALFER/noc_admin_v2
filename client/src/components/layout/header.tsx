"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { api } from "@/lib/api/fetcher";
import { useState } from "react";

const Header = () => {
    const [enabled, setEnabled] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        api.post("auth/logout")
            .json()
            .then(() => router.refresh().catch(() => null));
    };

    const handleEnableDisable = async () => {
        setEnabled(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setEnabled(false);
        console.log("Clicked");
    };

    return (
        <header className="w-full flex p-10 gap-3">
            <div>
                <ThemeToggle />
            </div>
            <div>
                <Button size="default" variant="destructive" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
            <div>
                <Button variant="shadow" isLoading={enabled} onClick={handleEnableDisable} startContent={<span>🚀</span>}>
                    Com sombra forte
                </Button>
            </div>
        </header>
    );
};
export default Header;
