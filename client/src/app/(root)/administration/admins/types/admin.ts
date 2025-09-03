import { UserAccountRole, UserRole, UserStatus, UserType, Helpers } from "./helpers";

export interface AccountData {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: UserAccountRole;
    status: UserStatus;
    notifications: boolean;
    created_at: string;
    updated_at: string | null;
}

export interface ResponseData {
    user: {
        id: string;
        name: string;
        role: UserRole;
        type: UserType;
        status: UserStatus;
        metadata: Record<string, string>;
        created_at: string;
        updated_at: string | null;
        accounts: AccountData[];
        stats?: {
            tickets: number;
            messages: number;
        };
    };
    helpers: Helpers;
}

export type DeleteAccountProps = {
    data: { id: string; name: string };
    open: boolean;
    setOpen: (open: boolean) => void;
};
