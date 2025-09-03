import { prisma } from "../../utils/index.js";
import { UserRole, UserType, UserStatus, UserAccountRole } from "@prisma/client";

export const content = async (req, reply) => {
    const { id } = req.params;

    try {
        const admin = await prisma.users.findUnique({
            where: {
                id: id,
                role: "ADMIN",
            },
            select: {
                id: true,
                name: true,
                role: true,
                type: true,
                status: true,
                metadata: true,
                created_at: true,
                updated_at: true,
                accounts: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        notifications: true,
                        phone: true,
                        status: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
            },
        });

        if (!admin) {
            return reply.status(404).send({
                error: "Admin not found",
            });
        }

        const stats = {
            tickets: 1,
            messages: 60,
        };

        const helpers = {
            userRoles: Object.values(UserRole),
            userTypes: Object.values(UserType),
            userStatuses: Object.values(UserStatus),
            userAccountRoles: Object.values(UserAccountRole),
        };

        reply.status(200).send({
            user: { ...admin, stats },
            helpers,
        });
    } catch (err) {
        throw err;
    }
};

export const schema = {};
