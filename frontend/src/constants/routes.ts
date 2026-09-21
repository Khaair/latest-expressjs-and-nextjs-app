export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  users: "/dashboard/users",
  categories: "/dashboard/categories",
  settings: "/dashboard/settings",
  blogs: "/dashboard/blogs",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.home,
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
] as const;

export const AUTH_ROUTES = [
  ROUTES.login,
  ROUTES.register,
  ROUTES.forgotPassword,
  ROUTES.resetPassword,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.dashboard,
  ROUTES.users,
  ROUTES.categories,
  ROUTES.settings,
  ROUTES.blogs,
] as const;
