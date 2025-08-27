import "@/styles/globals.css";
import { SessionResponse } from "@/types/session";
import { api } from "@/lib/api/fetcher";
import { redirect } from "next/navigation";
import { ThemeProvider } from "@/providers/themeProvider";

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const session = await api
        .get("auth/get-session")
        .json<SessionResponse>()
        .catch(() => null);

    if (session) {
        redirect("/");
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;
