<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <body class="A5 container" v-if="!isLoading && invoice">
    <div class="row justify-content-md-center mt-3" id="noPrint">
      <div class="d-flex align-items-center">
        <button class="btn btn-secondary" @click="onPrintWindow()">
          <i class="fa fa-print mr-2"></i>
          Print
        </button>
        <button class="btn btn-danger" @click="onCloseWindow()">
          <i class="fa fa-times mr-2"></i>
          Close
        </button>
      </div>
    </div>
    <div class="d-flex flex-column min-vh-100">
      <div class="invoice-header">
        <div class="mb-2 d-flex justify-content-between">
          <div>
            <img
              class="logo"
              alt="ostos logo"
              src="img/brand/ori_logo.svg"
              width="180"
              height="90"
            />
          </div>
          <div class="text-right w-50 align-self-lg-end">
            <sapn class="p24-px">
              {{ business.invoice_toptext }}
            </sapn>
          </div>
        </div>
        <hr class="my-1" />
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-baseline">
            <h2 class="font-weight-bold mr-1">Invoce:</h2>
            <p>#INV-{{ invoice.invoice_number }}</p>
          </div>
          <div class="text-right">
            <p class="font-weight-bold">
              Date: <span>{{ invoice.date }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="customer-info">
        <div class="mb-2 d-flex justify-content-between">
          <div class="w-75 d-flex align-items-start flex-column">
            <!-- <h2>AT :</h2> -->
            <h2 v-if="invoice.customer_name">
              To : {{ invoice.customer_name }}
            </h2>
            <h2>
              Tel :
              <span
                class="p"
                v-if="
                  invoice.customer_phone_number ||
                  invoice.customer_phone_number2
                "
              >
                {{ invoice.customer_phone_number }}
                {{
                  invoice.customer_phone_number2
                    ? `| ${invoice.customer_phone_number2}`
                    : ""
                }}
              </span>
            </h2>
            <h2 v-if="invoice.customer_email">
              Email : <span class="p">{{ invoice.customer_email }}</span>
            </h2>
          </div>
          <div class="text-right">
            <p class="mb-0">
              <span class="font-weight-bold h2">Address</span> :
              {{ business.address }}
            </p>
            <p class="mb-0">
              <span class="font-weight-bold p">Email</span> :
              {{ business.email }}
            </p>
            <p class="mb-0">
              <span class="font-weight-bold p">Phone</span> :
              {{ business.phone_number1 }}
              {{ business.phone_number2 ? `| ${business.phone_number2}` : "" }}
              {{ business.phone_number3 ? `| ${business.phone_number3}` : "" }}
            </p>
          </div>
        </div>
      </div>

      <div class="invoice-items">
        <table class="table table-sm">
          <tr class="invoiceListHeading">
            <th>NO.</th>
            <th>DESCRIPTION</th>
            <th v-if="selectedBusiness !== 'car'">Size CM</th>
            <th v-if="selectedBusiness == 'printing'">M&sup2;</th>
            <th v-if="selectedBusiness !== 'car'">QUANTITY</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
          <tbody>
            <tr v-for="(product, index) in invoice.product_data" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ product.product_name }}</td>
              <td v-if="selectedBusiness !== 'car'">
                {{ product.width }} x {{ product.length }}
              </td>
              <td v-if="selectedBusiness == 'printing'">
                <span>{{ (product.width * product.length) / 10000 }}</span>
                m&sup2;
              </td>
              <td v-if="selectedBusiness !== 'car'">{{ product.quantity }}</td>
              <td>${{ product.unit_price }}.00</td>
              <td>${{ product.total_price }}.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="invoice-footer mt-auto">
        <div class="bank-info mb-2 d-flex justify-content-between">
          <div class="w-75">
            <div class="d-flex">
              <img
                alt="ostos logo"
                src="img/brand/aba_logo.png"
                width="120"
                height="120"
              />
              <div class="ml-2">
                <p class="mr-2 mb-0 p24-px">
                  លេខគណនីធនាគារ : <span class="font-weight-bold">ABA</span>
                </p>
                <p class="mr-2 mb-0 p24-px">
                  លេខកុង :
                  <span class="font-weight-bold">{{
                    business.acc_number
                  }}</span>
                </p>
                <p class="mr-2 mb-0 p24-px">
                  ឈ្មេាះ :
                  <span class="font-weight-bold">{{ business.aba_name }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="w-50">
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">សរុប/Total</h3>
              <h3 class="col-sm-4 total-bg-color">${{ invoice.total }}.00</h3>
            </div>
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">ប្រាក់កក់/Deposite</h3>
              <h3 class="col-sm-4">${{ invoice.due_amount }}.00</h3>
            </div>
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">នៅខ្វះ/Balance</h3>
              <h3 class="col-sm-4 bg-pink">
                <span
                  class="py-1 text-red"
                  v-if="invoice.due_amount - invoice.total < 0"
                  >${{ (invoice.due_amount - invoice.total) * -1 }}.00</span
                >
              </h3>
            </div>
          </div>
        </div>
        <br />

        <div class="customer-info">
          <div class="mb-2 d-flex justify-content-between">
            <div class="w-75">
              <img alt="ostos logo" src="img/brand/aba_qr.jpg" width="170" />
            </div>
            <div class="text-left">
              <div class="d-flex">
                <p class="font-weight-bold mr-1 mb-0">ចំណាំ:</p>
                <p class="mb-0">
                  {{ business.invoice_note[0] }}
                </p>
              </div>
              <div class="d-flex">
                <p class="font-weight-bold mr-1 mb-0">Note:</p>
                <p class="mb-0">
                  {{ business.invoice_note[1] }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="customer-info">
          <div class="mb-2 d-flex justify-content-between">
            <div class="text-align-center">
              <p class="mb-0 ml-2">SCAN HERE TO PAY</p>
              <h4 class="mb-0 ml-3">{{ business.aba_name.toUpperCase() }}</h4>
            </div>
            <div class="text-center">
              <h3 class="mb-0 ml-2">ហត្ថលេខាអ្នកទិញ</h3>
              <h3 class="mb-0 ml-2">Customer Signature</h3>
            </div>
            <div class="text-center">
              <h3 class="mb-0 ml-2">ហត្ថលេខាអ្នកទិញ</h3>
              <h3 class="mb-0 ml-2">Customer Signature</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mb-0">
        <p style="font-size: 10px">OSTOS EXCELLENT STICKER Since 2010</p>
      </div>
    </div>
  </body>
</template>

<script>
import InvoiceService from "../../services/invoice.service";
import BusinessService from "../../services/business.service";
import moment from "moment";

export default {
  name: "preview-invoice",
  components: {},
  data() {
    return {
      isLoading: true,
      invoice: {},
      business: {},
      selectedBusiness: "",
    };
  },
  methods: {
    onPrintWindow() {
      window.print();
    },
    onCloseWindow() {
      window.close();
    },
  },
  mounted() {
    this.isLoading = true;
    this.invoiceId = this.$route.params.invoiceId;
    InvoiceService.getInvoiceById(this.invoiceId).then((item) => {
      const invoice = item.data.data;

      invoice.invoice_number = String(invoice.invoice_number).padStart(6, "0");
      invoice.date = moment(invoice.date).format("dddd, Do MMMM, YYYY");
      this.employees = invoice.employee_data.map((emp) => emp.employee_id);
      this.products = invoice.product_data;
      this.invoice = invoice;

      this.businessId = invoice.business_id;
      BusinessService.getBusinessById(this.businessId).then((item) => {
        const business = item.data.data;
        this.selectedBusiness = business.name.toLowerCase().trim();
        business.invoice_note = business.invoice_note.split("\n");
        this.business = business;
        this.isLoading = false;
      });
    });
  },
};
</script>

<style>
html,
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: Battambang !important;
  src: url("/static/invoice/fonts/Battambang/Battambang-Regular.ttf") !important;
}

@font-face {
  font-family: Opensans !important;
  src: url("/static/invoice/fonts/OpenSans-Regular.ttf") !important;
}

body {
  font-family: "Battambang", "Opensans", sans-serif !important;
  font-size: 16px !important;
}

.logo {
  height: 160px;
  width: auto;
  display: block;
}

.invoice-header {
  padding: 30px 0;
}

tr.invoiceListHeading {
  background-color: #1a4567;
  color: #fff;
}

.total-bg-color {
  background-color: #1a4567;
  color: #fff;
}

@media print {
  #noPrint {
    display: none;
  }

  body {
    background-color: #fff !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    font-family: "Battambang", "Opensans", sans-serif !important;
    font-size: 16px !important;
  }

  table tr th {
    font-size: 24px !important;
  }

  table tr td {
    font-size: 24px !important;
  }

  .p24-px {
    font-size: 24px !important;
  }

  p {
    font-size: 20px !important;
  }

  h3 {
    font-size: 20px !important;
  }

  h2 {
    font-size: 24px !important;
  }

  tr.invoiceListHeading {
    background-color: #1a4567 !important;
    color: #525f7f !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  @page {
    size: a4 portrait;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 1cm;
    margin-right: 1cm;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
</style>
