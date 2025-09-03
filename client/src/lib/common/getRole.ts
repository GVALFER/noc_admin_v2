type Roles = "OWNER" | "ADMIN" | "MEMBER";

const roles: Roles[] = ["OWNER", "ADMIN", "MEMBER"];

export const getRole = (role: Roles) => {
    const index = roles.indexOf(role);
    return {
        role,
        index: index >= 0 ? index : 0,
    };
};
