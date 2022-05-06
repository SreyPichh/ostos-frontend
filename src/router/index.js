import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";
import GeneratePDFLayout from "@/layout/GeneratePDFLayout";

import Dashboard from "../views/Dashboard.vue";
import Business from "../views/Business/Business.vue";
import NewBusiness from "../views/Business/NewBusiness.vue";
import EditBusiness from "../views/Business/EditBusiness.vue";

import Invoice from "../views/Invoice/Invoice.vue";
import NewInvoice from "../views/Invoice/NewInvoice.vue";
import PreviewInvoice from "../views/Invoice/PreviewInvoice.vue";
import EditInvoice from "../views/Invoice/EditInvoice.vue";

import Product from "../views/Product/Product.vue";
import NewProduct from "../views/Product/NewProduct.vue";
import EditProduct from "../views/Product/EditProduct.vue";

import Employee from "../views/Employee/Employee.vue";
import NewEmployee from "../views/Employee/NewEmployee.vue";
import EditEmployee from "../views/Employee/EditEmployee.vue";

import Quote from "../views/Quote/Quote.vue";

import Receipt from "../views/Receipt/Receipt.vue";

import Profile from "../views/UserProfile.vue";

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
        path: "/businesses",
        name: "Businesses",
        components: { default: Business },
      },
      {
        path: "/businesses/new",
        name: "new-business",
        components: { default: NewBusiness },
      },
      {
        path: "/businesses/:Bid",
        name: "edit-business",
        components: { default: EditBusiness },
      },
      {
        path: "/invoices",
        name: "invoices",
        components: { default: Invoice },
      },
      {
        path: "/invoices/new",
        name: "new-invoice",
        components: { default: NewInvoice },
      },
      {
        path: "/invoices/:invoiceId",
        name: "edit-invoice",
        components: { default: EditInvoice },
      },
      {
        path: "/quotes",
        name: "quotes",
        components: { default: Quote },
      },
      {
        path: "/quotes/new",
        name: "new-quote",
        components: { default: Quote },
      },
      {
        path: "/receipts",
        name: "receipts",
        components: { default: Receipt },
      },
      {
        path: "/receipts/new",
        name: "new-receipt",
        components: { default: Receipt },
      },
      {
        path: "/products",
        name: "products",
        components: { default: Product },
      },
      {
        path: "/products/:Pid",
        name: "edit-product",
        components: { default: EditProduct },
      },
      {
        path: "/products/new",
        name: "new-product",
        components: { default: NewProduct },
      },
      {
        path: "/employees",
        name: "employees",
        components: { default: Employee },
      },
      {
        path: "/employees/:UserId",
        name: "edit-employee",
        components: { default: EditEmployee },
      },
      {
        path: "/employees/new",
        name: "new-employee",
        components: { default: NewEmployee },
      },
      {
        path: "/profile",
        name: "profile",
        components: { default: Profile },
      },
    ],
  },
  {
    path: "/invoices/preview",
    redirect: "/invoices/:invoiceId/generate-pdf/preview",
    component: GeneratePDFLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/invoices/:invoiceId/generate-pdf/preview",
        name: "preview-invoice",
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

router.beforeEach((to, from, next) => {
  const publicPages = ["/login", "/register"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("user");
  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
