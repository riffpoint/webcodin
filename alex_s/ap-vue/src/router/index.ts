import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import authRoutes from "@/authorization/routes";
import adminRoutes from "@/admin/routes";

import PageNotFound from "@/components/page-not-found/index.vue";
import { authModule } from "@/store/auth";

const defautlRoutes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: { name: "dashboard" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "page-not-found",
    component: PageNotFound,
  },
];

const routes = [...authRoutes, ...adminRoutes, ...defautlRoutes];

const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production" ? "/vue-admin/" : process.env.BASE_URL
  ),
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresLogin) &&
    authModule.state.loggedIn == false
  ) {
    next({ name: "sing-in" });
  } else {
    next();
  }
});

export default router;
