import { prisma } from "../../utils/index.js";

const ALLOWED_SORT = ["created_at", "name", "email", "id", "last_login_at"];
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const toStr = (v) => (v == null ? "" : String(v));

function parseSorting(sortingStr) {
    const s = toStr(sortingStr).trim();
    if (!s) return [{ created_at: "desc" }];
    const parts = s
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
            const token = p.replace(":", "."); // Also accept "field:desc"
            const [field, dirRaw] = token.split(".");
            if (!ALLOWED_SORT.includes(field)) return null;
            const dir = (toStr(dirRaw) || "asc").toLowerCase() === "desc" ? "desc" : "asc";
            return { [field]: dir };
        })
        .filter(Boolean);
    return parts.length ? parts : [{ created_at: "desc" }];
}

export const content = async (req, reply) => {
    try {
        const pageIndex = Math.max(0, parseInt(req.query.pageIndex) || 0);
        const pageSize = clamp(parseInt(req.query.pageSize) || 10, 1, 100);
        const skip = pageIndex * pageSize;

        const globalFilter = toStr(req.query.globalFilter).trim();
        const where = globalFilter
            ? {
                  OR: [{ name: { contains: globalFilter } }, { id: { contains: globalFilter } }],
              }
            : {};

        const orderBy = parseSorting(req.query.sorting);

        const [users, totalItems] = await Promise.all([
            prisma.users.findMany({
                where,
                orderBy,
                skip,
                take: pageSize,
            }),
            prisma.users.count({ where }),
        ]);

        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

        reply.status(200).send({
            data: users,
            pagination: {
                pageIndex,
                pageSize,
                totalPages,
                totalItems,
            },
        });
    } catch (err) {
        console.error("Error in getUsers:", err);
        throw err;
    }
};

export const schema = {};
