import { paginate } from "../../utils/index.js";
import { UserRole, UserType, UserStatus, UserAccountRole } from "@prisma/client";

export const content = async (req, reply) => {
    try {
        const result = await paginate({
            table: "users",
            query: req.query,
            where: (q) => ({
                OR: [{ name: { contains: q } }],
                AND: [{ role: "ADMIN" }],
            }),
            include: {
                accounts: {
                    omit: {
                        hash: true,
                    },
                },
            },
        });

        result.helpers = {
            userRoles: Object.values(UserRole),
            userTypes: Object.values(UserType),
            userStatuses: Object.values(UserStatus),
            userAccountRoles: Object.values(UserAccountRole),
        };

        reply.status(200).send(result);
    } catch (err) {
        throw err;
    }
};

export const schema = {
    querystring: {
        type: "object",
        properties: {
            pageIndex: { type: "integer", minimum: 0, default: 0 },
            pageSize: { type: "integer", minimum: 1, maximum: 100, default: 10 },
            sorting: { type: "string" },
            globalFilter: { type: "string" },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            name: { type: "string" },
                            role: { type: "string", enum: Object.values(UserRole) },
                            type: { type: "string", enum: Object.values(UserType) },
                            status: { type: "string", enum: Object.values(UserStatus) },
                            metadata: {
                                type: ["object", "null"],
                                additionalProperties: {
                                    type: "string",
                                },
                            },
                            created_at: { type: "string", format: "date-time" },
                            updated_at: { type: ["string", "null"], format: "date-time" },
                            accounts: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "string" },
                                        name: { type: "string" },
                                        email: { type: "string" },
                                        phone: { type: ["string", "null"] },
                                        role: { type: "string", enum: Object.values(UserAccountRole) },
                                        status: { type: "string", enum: Object.values(UserStatus) },
                                        notifications: { type: "boolean" },
                                        created_at: { type: "string", format: "date-time" },
                                        updated_at: { type: ["string", "null"], format: "date-time" },
                                    },
                                    required: ["id", "name", "email", "role", "status", "created_at"],
                                    additionalProperties: false,
                                },
                            },
                        },
                        required: ["id", "name", "role", "type", "status", "created_at", "accounts"],
                        additionalProperties: false,
                    },
                },
                pagination: {
                    type: "object",
                    properties: {
                        pageIndex: { type: "integer" },
                        pageSize: { type: "integer" },
                        totalPages: { type: "integer" },
                        totalItems: { type: "integer" },
                    },
                    required: ["pageIndex", "pageSize", "totalPages", "totalItems"],
                },
                helpers: {
                    type: "object",
                    properties: {
                        userRoles: {
                            type: "array",
                            items: { type: "string", enum: Object.values(UserRole) },
                        },
                        userTypes: {
                            type: "array",
                            items: { type: "string", enum: Object.values(UserType) },
                        },
                        userStatuses: {
                            type: "array",
                            items: { type: "string", enum: Object.values(UserStatus) },
                        },
                        userAccountRoles: {
                            type: "array",
                            items: { type: "string", enum: Object.values(UserAccountRole) },
                        },
                    },
                    required: ["userRoles", "userTypes", "userStatuses", "userAccountRoles"],
                    additionalProperties: false,
                },
            },
            required: ["data", "pagination"],
        },
    },
};
