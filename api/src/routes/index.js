import authRoutes from "./auth/index.js";
import usersRoutes from "./users/index.js";

const routes = async (f) => {
  f.register(authRoutes, { prefix: "/auth" });
  f.register(usersRoutes, { prefix: "/users" });
};

export default routes;
