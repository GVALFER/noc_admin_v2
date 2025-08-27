import * as register from "./register.js";
import * as login from "./login.js";
import { authGuard } from "../../utils/index.js";
import * as session from "./getSession.js";
import * as logout from "./logout.js";

const authRoutes = async (app) => {
  app.get(
    "/get-session",
    { schema: session.schema, preHandler: [authGuard] },
    session.content,
  );

  app.post(
    "/register",
    { schema: register.schema, preHandler: [] },
    register.content,
  );

  app.post("/login", { schema: login.schema, preHandler: [] }, login.content);
  app.post(
    "/logout",
    { schema: logout.schema, preHandler: [authGuard] },
    logout.content,
  );
};

export default authRoutes;
