// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/HomeView.vue"),
      },
      {
        path: "links/new",
        name: "CreateLink",
        component: () => import("@/views/app/CreateLinkView.vue"),
      },
      {
        path: "links",
        name: "PaymentLinks",
        component: () => import("@/views/app/PaymentLinksView.vue"),
      },
      {
        path: "links/:id",
        name: "PaymentLinkDetails",
        component: () => import("@/views/app/LinksView.vue"),
      },
      {
        path: "customers",
        name: "Customers",
        component: () => import("@/views/app/CustomersView.vue"),
      },
      {
        path: "transactions",
        name: "Transactions",
        component: () => import("@/views/app/TransactionsView.vue"),
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/app/SettingsView.vue"),
      },
    ],
  },

  // Auth (outside layouts)
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "Registration",
    component: () => import("@/views/RegistrationView.vue"),
  },

  { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/views/NotFoundView.vue") },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
