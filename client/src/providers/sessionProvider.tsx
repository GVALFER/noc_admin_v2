"use client";

import { createContext, useContext } from "react";
import { SessionResponse } from "@/types/session";

const SessionContext = createContext<SessionResponse | null>(null);
export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children, value }: { children: React.ReactNode; value: SessionResponse | null }) => {
    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};
