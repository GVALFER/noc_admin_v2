import "@/styles/globals.css";
import { Inter } from "next/font/google";
import QueryProvider from "@/providers/useQuery";
import { SessionProvider } from "@/providers/sessionProvider";
import { Session } from "@/types/session";
import { api } from "@/lib/api/fetcher";
import { unauthorizedRedirection } from "@/lib/api/unauthorizedRedirection";
import { ThemeProvider } from "@/providers/themeProvider";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "sonner";
import { Header } from "@/components/ui/header";

const RootLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
    let session = null;
    try {
        session = await api.get("auth/get-session").json<Session>();
    } catch {
        await unauthorizedRedirection();
    }

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <SessionProvider value={session}>
                    <QueryProvider>
                        <ThemeProvider>
                            <Header />
                            {children}
                            <Toaster position="top-right" closeButton={true} />
                        </ThemeProvider>
                    </QueryProvider>
                </SessionProvider>
            </body>
        </html>
    );
};

export default RootLayout;
