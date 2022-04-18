import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";
import GeneratePDFLayout from "@/layout/GeneratePDFLayout";

import Dashboard from "../views/Dashboard.vue";
import Business from "../views/Business.vue";
import NewBusiness from "../views/Business/NewBusiness.vue";
import Invoice from "../views/Invoice.vue";
import NewInvoice from "../views/Invoice/NewInvoice.vue";
import PreviewInvoice from "../views/Invoice/PreviewInvoice.vue";

import Profile from "../views/UserProfile.vue";
import Tables from "../views/Tables.vue";

import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    component: DashboardLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        components: { default: Dashboard },
      },
      {
        path: "/business",
        name: "Business",
        components: { default: Business },
      },
      {
        path: "/business/new",
        name: "new-business",
        components: { default: NewBusiness },
      },
      {
        path: "/invoice",
        name: "invoice",
        components: { default: Invoice },
      },
      {
        path: "/invoice/new",
        name: "new-invoice",
        components: { default: NewInvoice },
      },
      {
        path: "/profile",
        name: "profile",
        components: { default: Profile },
      },
      {
        path: "/tables",
        name: "tables",
        components: { default: Tables },
      },
    ],
  },
  {
    path: "/invoice/preview",
    redirect: "/invoice/generate-pdf/preview",
    component: GeneratePDFLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "//invoice/generate-pdf/preview",
        name: "preview",
        components: { default: PreviewInvoice },
      },
    ],
  },
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        components: { default: Login },
      },
      {
        path: "/register",
        name: "register",
        components: { default: Register },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: "active",
  routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ["/login", "/register", "/home"];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem("user");
//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next("/login");
//   } else {
//     next();
//   }
// });

export default router;
