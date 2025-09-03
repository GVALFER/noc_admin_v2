import { prisma } from "../../utils/index.js";
import { UserType, UserStatus } from "@prisma/client";

export const content = async (req, reply) => {
    const { id, name, type, status, metadata } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                id: id,
                role: "ADMIN",
            },
        });

        if (!user) {
            return reply.status(404).send({
                code: "USER_NOT_FOUND",
                error: "User not found",
            });
        }

        await prisma.users.update({
            where: {
                id: id,
            },
            data: {
                name,
                type,
                status,
                metadata,
                updated_at: new Date(),
            },
        });

        reply.status(200).send({
            message: "Admin user updated successfully",
        });
    } catch (err) {
        throw err;
    }
};

export const schema = {
    body: {
        type: "object",
        required: ["id", "name", "type", "status"],
        properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string", minLength: 3, maxLength: 100 },
            type: { type: "string", enum: Object.values(UserType) },
            status: { type: "string", enum: Object.values(UserStatus) },
            metadata: {
                type: ["object", "null"],
                additionalProperties: { type: "string" },
            },
        },
        additionalProperties: false,
    },
    response: {
        200: {
            type: "object",
            properties: {
                message: { type: "string" },
            },
            additionalProperties: false,
        },
        404: {
            type: "object",
            properties: {
                code: { type: "string" },
                error: { type: "string" },
            },
            additionalProperties: false,
        },
    },
};
