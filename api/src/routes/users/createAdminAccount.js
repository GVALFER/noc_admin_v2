import { logger } from "../../utils/common/logger.ts";
import { hashPassword, prisma } from "../../utils/index.js";
import { UserAccountRole, UserStatus } from "@prisma/client";

export const content = async (req, reply) => {
    const { user_id, name, email, phone, role, status, password } = req.body;
    const { role: accRole } = req.account;

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: user_id,
                role: "ADMIN",
            },
        });

        if (!user) {
            return reply.status(404).send({
                code: "USER_NOT_FOUND",
                error: "User not found",
            });
        }

        if (accRole !== "OWNER") {
            return reply.status(401).send({
                code: "INSUFFICIENT_PERMISSIONS",
                error: "You do not have permission to delete this account",
            });
        }

        const existingAccount = await prisma.user_accounts.findUnique({
            where: {
                email: email,
            },
        });

        if (existingAccount) {
            return reply.status(400).send({
                code: "ACCOUNT_ALREADY_EXISTS",
                error: "An account with this email already exists",
            });
        }

        const hash = await hashPassword(password);

        const account = await prisma.user_accounts.create({
            data: {
                user_id: user.id,
                name,
                email,
                phone,
                role,
                status,
                hash,
            },
        });

        logger.info({
            category: "user",
            event: "create",
            message: `Admin account created with ID: ${account.id} by user ID: ${req.account.name}`,
            metadata: { accountId: account.id, createdBy: req.account.id },
            user_id: req.account.id,
            req,
        });

        reply.status(200).send({
            message: "Admin account created successfully",
        });
    } catch (err) {
        throw err;
    }
};

export const schema = {
    body: {
        type: "object",
        required: ["user_id", "name", "email", "role", "status", "password"],
        properties: {
            user_id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: ["string", "null"] },
            role: { type: "string", enum: Object.values(UserAccountRole) },
            status: { type: "string", enum: Object.values(UserStatus) },
            password: { type: "string", minLength: 3, maxLength: 100 },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            type: "object",
            properties: {
                message: { type: "string" },
            },
        },
        401: {
            type: "object",
            properties: {
                code: { type: "string" },
                error: { type: "string" },
            },
        },
        404: {
            type: "object",
            properties: {
                code: { type: "string" },
                error: { type: "string" },
            },
        },
    },
};
