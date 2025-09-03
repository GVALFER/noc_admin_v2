import { paginate } from "../../utils/index.js";

export const content = async (req, reply) => {
    try {
        const result = await paginate({
            table: "users",
            query: req.query,
            where: (q) => ({
                OR: [{ name: { contains: q } }],
                AND: [{ role: "USER" }],
            }),
        });

        reply.status(200).send(result);
    } catch (err) {
        console.error("Error in getUsers:", err);
        throw err;
    }
};

export const schema = {};
