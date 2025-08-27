import { authGuard } from "../../utils/index.js";
import * as getCls from "./getUsers.js";

const usersRoutes = async (app) => {
  app.get(
    "/",
    { schema: getCls.schema, preHandler: [authGuard] },
    getCls.content,
  );
};

export default usersRoutes;
