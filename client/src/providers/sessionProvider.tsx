"use client";

import { createContext, useContext } from "react";
import { Session } from "@/types/session";

const SessionContext = createContext<Session | null>(null);
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children, value }: { children: React.ReactNode; value: Session | null }) => {
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
