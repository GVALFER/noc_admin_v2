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

type Pagination = {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
};

export type ResponseData = {
    data: UserData[];
    pagination: Pagination;
    helpers: Helpers;
};

export interface MetadataFormProps {
    initialMetadata?: Record<string, string>;
    onChange?: (metadata: Record<string, string>) => void;
}

export type DeleteUserProps = {
    data: { id: string; name: string };
    open: boolean;
    setOpen: (open: boolean) => void;
};

export type UpdateUserProps = {
    data: UserData | null;
    helpers: Helpers;
    setOpenModal?: (open: boolean) => void;
};
