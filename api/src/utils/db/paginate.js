import { prisma } from "../../utils/index.js";

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const toStr = (v) => (v == null ? "" : String(v));

const parseSorting = (sortingStr, allowedSort = []) => {
    const s = toStr(sortingStr).trim();

    if (!s) {
        return [{ created_at: "desc" }];
    }

    const parts = s
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => {
            const token = p.replace(":", "."); // Also accept "field:desc"
            const [field, dirRaw] = token.split(".");
            if (!allowedSort.includes(field)) return null;
            const dir = (toStr(dirRaw) || "asc").toLowerCase() === "desc" ? "desc" : "asc";
            return { [field]: dir };
        })
        .filter(Boolean);
    return parts.length ? parts : [{ created_at: "desc" }];
};

export const paginate = async ({ table, query = {}, allowedSort = [], where = {}, select, include, ...rest }) => {
    if (!prisma) throw new Error("Missing 'prisma' parameter");
    if (!table) throw new Error("Missing 'table' parameter (ex: 'users')");

    const model = prisma[table];
    if (!model) throw new Error(`Prisma model '${table}' not found`);

    const pageIndex = Math.max(0, parseInt(query.pageIndex) || 0);
    const pageSize = clamp(parseInt(query.pageSize) || 10, 1, 100);

    const skip = pageIndex * pageSize;
    const take = pageSize;

    const orderBy = parseSorting(query.sorting, allowedSort);

    const resolvedWhere = typeof where === "function" ? where(toStr(query.globalFilter)) : where;

    const totalItems = await model.count({ where: resolvedWhere });
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const data = await model.findMany({
        where: resolvedWhere ?? undefined,
        orderBy,
        skip,
        take,
        select,
        include,
        ...rest,
    });

    return {
        data,
        pagination: {
            pageIndex,
            pageSize,
            totalPages,
            totalItems,
        },
    };
};
