import { Helpers, UserAccountRole, UserRole, UserStatus, UserType } from "./helpers";

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

export type UserData = {
    id: string;
    name: string;
    role: UserRole;
    type: UserType;
    status: UserStatus;
    created_at: string;
    accounts: AccountData[];
    metadata: Record<string, string>;
    updated_at: string;
};

export interface ActionsAdmins {
    data: UserData;
    helpers: Helpers;
}

export interface ActionsAdmin {
    data: AccountData;
    helpers: Helpers;
}
