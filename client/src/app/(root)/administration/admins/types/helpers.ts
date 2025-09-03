export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING" | "DELETED";
export type UserRole = "USER" | "ADMIN";
export type UserType = "COMPANY" | "INDIVIDUAL";
export type UserAccountRole = "OWNER" | "ADMIN" | "MEMBER";
export interface Helpers {
    userTypes: string[];
    userStatuses: string[];
    userRoles: string[];
    userAccountRoles: string[];
    accountStatuses: string[];
}
