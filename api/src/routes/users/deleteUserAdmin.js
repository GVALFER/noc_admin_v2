import { prisma } from "../../utils/index.js";

export const content = async (req, reply) => {
    const { id } = req.body;
    const { role } = req.account;

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

        if (role !== "OWNER") {
            return reply.status(403).send({
                code: "INSUFFICIENT_PERMISSIONS",
                error: "You do not have permission to delete this account",
            });
        }

        await prisma.users.delete({
            where: {
                id: id,
            },
        });

        reply.status(200).send({
            message: "Admin user deleted successfully",
        });
    } catch (err) {
        throw err;
    }
};

export const schema = {
    body: {
        type: "object",
        required: ["id"],
        properties: {
            id: { type: "string", format: "uuid" },
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
