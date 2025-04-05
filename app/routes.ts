import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("admin", "routes/admin.tsx"),
  route("login", "routes/login.tsx")
] satisfies RouteConfig;
