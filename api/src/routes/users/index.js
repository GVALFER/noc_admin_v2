import { authGuard } from "../../utils/index.js";
import * as getCls from "./getClients.js";
import * as getAdms from "./getAdmins.js";
import * as updAdm from "./updateUserAdmin.js";
import * as delAdm from "./deleteUserAdmin.js";
import * as getAdmin from "./getUserAdmin.js";
import * as delAcc from "./deleteAdminAccount.js";
import * as createAcc from "./createAdminAccount.js";

const usersRoutes = async (app) => {
    app.get("/clients", { schema: getCls.schema, preHandler: [authGuard] }, getCls.content);
    app.get("/admins", { schema: getAdms.schema, preHandler: [authGuard] }, getAdms.content);
    app.get("/admins/:id", { schema: getAdmin.schema, preHandler: [authGuard] }, getAdmin.content);
    app.put("/account", { schema: updAdm.schema, preHandler: [authGuard] }, updAdm.content);
    app.post("/account", { schema: createAcc.schema, preHandler: [authGuard] }, createAcc.content);
    app.delete("/admin", { schema: delAdm.schema, preHandler: [authGuard] }, delAdm.content);
    app.delete("/account", { schema: delAcc.schema, preHandler: [authGuard] }, delAcc.content);
};

export default usersRoutes;
