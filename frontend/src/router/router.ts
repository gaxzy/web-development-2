import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import LoginView from "../views/LoginView.vue";
import DashboardView from "../views/DashboardView.vue";

import AuthService from "../services/AuthService";

const routes: Array<RouteRecordRaw> = [
  { path: "/login", component: LoginView },
  {
    path: "/dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.meta.requiresAuth && !AuthService.isAuthenticated()) {
    next("/login");
  } else {
    next();
  }
});

export default router;
