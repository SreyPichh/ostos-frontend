import { createRouter, createWebHashHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";
import GeneratePDFLayout from "@/layout/GeneratePDFLayout";

import Dashboard from "../views/Dashboard.vue";
import Business from "../views/Business/Business.vue";
import BusinessTable from "../views/Business/BusinessTable.vue";
import NewBusiness from "../views/Business/NewBusiness.vue";
import EditBusiness from "../views/Business/EditBusiness.vue";

import Invoice from "../views/Invoice/Invoice.vue";
import InvoiceTable from "../views/Invoice/InvoiceTable.vue";
import NewInvoice from "../views/Invoice/NewInvoice.vue";
import PreviewInvoice from "../views/Invoice/PreviewInvoice.vue";
import EditInvoice from "../views/Invoice/EditInvoice.vue";

import Quote from "../views/Quote/Quote.vue";
import NewQuote from "../views/Quote/NewQuote.vue";
import PreviewQuote from "../views/Quote/PreviewQuote.vue";

import Receipt from "../views/Receipt/Receipt.vue";
import ReceiptTable from "../views/Receipt/ReceiptTable.vue";
import NewReceipt from "../views/Receipt/NewReceipt.vue";
import EditReceipt from "../views/Receipt/EditReceipt.vue";
import PreviewReceipt from "../views/Receipt/PreviewReceipt.vue";

import Product from "../views/Product/Product.vue";
import ProductTable from "../views/Product/ProductTable.vue";
import NewProduct from "../views/Product/NewProduct.vue";
import EditProduct from "../views/Product/EditProduct.vue";

import Customer from "../views/Customer/Customer.vue";
import CustomerTable from "../views/Customer/CustomerTable.vue";
import NewCustomer from "../views/Customer/NewCustomer.vue";
import EditCustomer from "../views/Customer/EditCustomer.vue";

import Employee from "../views/Employee/Employee.vue";
import EmployeeTable from "../views/Employee/EmployeeTable.vue";
import NewEmployee from "../views/Employee/NewEmployee.vue";
import EditEmployee from "../views/Employee/EditEmployee.vue";

import Payment from "../views/Payment/Payment.vue";
import PaymentReportTable from "../views/Payment/PaymentReportTable.vue";
import PaymentListTable from "../views/Payment/PaymentListTable.vue";

import Purchase from "../views/Purchase/Purchase.vue";
import PurchaseTable from "../views/Purchase/PurchaseTable.vue";
import NewPurchase from "../views/Purchase/NewPurchase.vue";
import EditPurchase from "../views/Purchase/EditPurchase.vue";

import NoteBook from "../views/NoteBook/NoteBook.vue";
import NoteBookTable from "../views/NoteBook/NoteBookTable.vue";
import NewNoteBook from "../views/NoteBook/NewNoteBook.vue";
import EditNoteBook from "../views/NoteBook/EditNoteBook.vue";

import User from "../views/User/User.vue";
import Profile from "../views/UserProfile.vue";

import Activity from "../views/Activity/Activity.vue";

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
        children: [
          { path: "", name: "business-table", component: BusinessTable },
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
        ],
      },
      {
        path: "/invoices",
        name: "invoices",
        components: { default: Invoice },
        children: [
          { path: "", name: "invoice-table", component: InvoiceTable },
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
        ],
      },
      {
        path: "/quotes",
        name: "quotes",
        components: { default: Quote },
      },
      {
        path: "/new",
        name: "new-quote",
        components: { default: NewQuote },
      },
      {
        path: "/receipts",
        name: "receipts",
        components: { default: Receipt },
        children: [
          { path: "", name: "receipt-table", component: ReceiptTable },
          {
            path: "/receipts/new",
            name: "new-receipt",
            components: { default: NewReceipt },
          },
          {
            path: "/receipts/:receiptId",
            name: "edit-receipt",
            components: { default: EditReceipt },
          },
        ],
      },
      {
        path: "/products",
        name: "products",
        components: { default: Product },
        children: [
          { path: "", name: "product-table", component: ProductTable },
          {
            path: "/products/new",
            name: "new-product",
            components: { default: NewProduct },
          },
          {
            path: "/products/:Pid",
            name: "edit-product",
            components: { default: EditProduct },
          },
        ],
      },
      {
        path: "/customers",
        name: "customers",
        components: { default: Customer },
        children: [
          { path: "", name: "customer-table", component: CustomerTable },
          {
            path: "/customers/new",
            name: "new-customer",
            components: { default: NewCustomer },
          },
          {
            path: "/customers/:customerId",
            name: "edit-customer",
            components: { default: EditCustomer },
          },
        ],
      },
      {
        path: "/employees",
        name: "employees",
        components: { default: Employee },
        children: [
          { path: "", name: "employee-table", component: EmployeeTable },
          {
            path: "/employees/new",
            name: "new-employee",
            components: { default: NewEmployee },
          },
          {
            path: "/employees/:employeeId",
            name: "edit-employee",
            components: { default: EditEmployee },
          },
        ],
      },

      {
        path: "/payments",
        name: "payments",
        components: { default: Payment },
        children: [
          { path: "", name: "payment-table", component: PaymentReportTable },
          {
            path: "/payments/:customer_id",
            name: "payment-list",
            components: { default: PaymentListTable },
          },
        ],
      },
      {
        path: "/purchases",
        name: "purchases",
        components: { default: Purchase },
        children: [
          { path: "", name: "purchase-table", component: PurchaseTable },
          {
            path: "/purchases/new",
            name: "new-purchase",
            components: { default: NewPurchase },
          },
          {
            path: "/purchases/:purchaseId",
            name: "edit-purchase",
            components: { default: EditPurchase },
          },
        ],
      },
      {
        path: "/notebooks",
        name: "notebooks",
        components: { default: NoteBook },
        children: [
          { path: "", name: "notebook-table", component: NoteBookTable },
          {
            path: "/notebooks/new",
            name: "new-notebook",
            components: { default: NewNoteBook },
          },
          {
            path: "/notebooks/:notebookId",
            name: "edit-notebook",
            components: { default: EditNoteBook },
          },
        ],
      },
      {
        path: "/users",
        name: "users",
        components: { default: User },
      },
      {
        path: "/profile",
        name: "profile",
        components: { default: Profile },
      },
      {
        path: "/activity",
        name: "activity",
        components: { default: Activity },
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
    path: "/receipts/preview",
    redirect: "/receipts/:receiptId/generate-pdf/preview",
    component: GeneratePDFLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/receipts/:receiptId/generate-pdf/preview",
        name: "preview-receipt",
        components: { default: PreviewReceipt },
      },
    ],
  },
  {
    path: "/quotes/preview",
    redirect: "/quotes/:quoteId/generate-pdf/preview",
    component: GeneratePDFLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/quotes/:quoteId/generate-pdf/preview",
        name: "preview-quote",
        components: { default: PreviewQuote },
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
  {
    path: "/logout",
    name: "logout",
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
