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
              src="img/invoice/ori_logo.svg"
              width="180"
              height="90"
            />
          </div>
          <div class="text-right w-50 align-self-lg-end">
            <sapn class="p21-px">
              {{ business.invoice_toptext }}
            </sapn>
          </div>
        </div>
        <hr class="my-1" />
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-baseline">
            <h2 class="mr-1">Invoce:</h2>
            <p>#INV-{{ invoice.invoice_number }}</p>
          </div>
          <div class="text-right">
            <p>
              Date: <span>{{ invoice.date }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="customer-info">
        <div class="mb-2 d-flex justify-content-between">
          <div class="w-75 d-flex align-items-start flex-column">
            <!-- <h2>AT :</h2> -->
            <p v-if="invoice.customer_name">To : {{ invoice.customer_name }}</p>
            <p>
              Tel :
              <span class="p" v-if="invoice.customer_phone_number">
                {{ invoice.customer_phone_number }}
              </span>
            </p>
            <p v-if="invoice.customer_email">
              Email : <span class="p">{{ invoice.customer_email }}</span>
            </p>
          </div>
          <div class="text-right">
            <p class="mb-0">
              Address :
              {{ business.address }}
            </p>
            <p class="mb-0">
              Email :
              {{ business.email }}
            </p>
            <p class="mb-0">
              Phone :
              {{ business.phone_number1 }}
              {{ business.phone_number2 ? `| ${business.phone_number2}` : "" }}
              {{ business.phone_number3 ? `| ${business.phone_number3}` : "" }}
            </p>
          </div>
        </div>
      </div>

      <div id="invoice-items">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>NO.</th>
              <th>DESCRIPTION</th>
              <th v-if="selectedBusiness !== 'car'">Size CM</th>
              <th v-if="selectedBusiness == 'printing'">M&sup2;</th>
              <th v-if="selectedBusiness !== 'car'">QUANTITY</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in invoice.product_data" :key="index">
              <td scope="row" class="align-middle">{{ index + 1 }}</td>
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
        <div class="bank-info d-flex justify-content-between">
          <div class="w-75">
            <div class="d-flex">
              <img alt="ostos logo" src="img/invoice/aba_logo.png" width="80" />
              <div class="ml-2">
                <h3 class="mr-2 mb-0">លេខគណនីធនាគារ : <span>ABA</span></h3>
                <h3 class="mr-2 mb-0">
                  លេខកុង :
                  <span>{{ business.acc_number }}</span>
                </h3>
                <h3 class="mr-2 mb-0">
                  ឈ្មេាះ :
                  <span>{{ business.aba_name }}</span>
                </h3>
              </div>
            </div>
          </div>
          <div class="w-50">
            <div class="d-flex align-items-baseline">
              <span class="col-sm-8 p20-px text-right">សរុប/Total</span>
              <span class="col-sm-4 p20-px total-bg-color">
                ${{ invoice.total }}{{ invoice.total >= 1 ? ".00" : "" }}
              </span>
            </div>
            <div class="d-flex align-items-baseline">
              <span class="col-sm-8 p20-px text-right">ប្រាក់កក់/Deposite</span>
              <span class="col-sm-4 p20-px">
                ${{ invoice.due_amount }}{{ invoice.total >= 1 ? ".00" : "" }}
              </span>
            </div>
            <div class="d-flex align-items-baseline">
              <span class="col-sm-8 p20-px text-right">នៅខ្វះ/Balance</span>
              <span class="col-sm-4 p20-px total-bg-color">
                <span class="py-1" v-if="invoice.due_amount - invoice.total < 0"
                  >${{ (invoice.due_amount - invoice.total) * -1
                  }}{{ invoice.total >= 1 ? ".00" : "" }}</span
                >
              </span>
            </div>
          </div>
        </div>
        <br />

        <div class="customer-info">
          <div class="mb-2 d-flex justify-content-between">
            <div class="w-50">
              <img alt="ostos logo" src="img/invoice/aba_qr.png" width="170" />
            </div>
            <div class="text-left">
              <div class="d-flex">
                <p class="mr-1 mb-0">ចំណាំ:</p>
                <p class="mb-0">
                  {{ business.invoice_note[0] }}
                </p>
              </div>
              <div class="d-flex">
                <p class="mr-1 mb-0">Note:</p>
                <p class="mb-0">
                  {{ business.invoice_note[1] }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="customer-info">
          <div
            class="d-flex justify-content-between"
            :class="{ 'mb-5': !invoice.signature }"
          >
            <div class="text-align-center">
              <h4 class="mb-0 ml-2">SCAN HERE TO PAY</h4>
              <h4 class="mb-0 ml-4">{{ business.aba_name.toUpperCase() }}</h4>
            </div>
            <div class="text-center mt--4">
              <h3 class="mb-0 ml-2">ហត្ថលេខាអ្នកទិញ</h3>
              <h3 class="mb-0 ml-2">Customer Signature</h3>
            </div>
            <div class="text-center mt--4">
              <h3 class="mb-0 ml-2">ហត្ថាលេខាអ្នកលក់</h3>
              <h3 class="mb-0 ml-2">Seller Signature</h3>
              <div v-if="invoice.signature">
                <img
                  alt="ostos logo"
                  src="img/invoice/signature.png"
                  width="110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="p8-px text-left">OSTOS EXCELLENT STICKER Since 2010</p>
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
      invoice.date = moment(invoice.date).format("ddd DD-MM-YYYY");
      this.employees = invoice.employee_data.map((emp) => emp.employee_id);
      this.products = invoice.product_data;
      this.invoice = invoice;

      this.businessId = invoice.business_id;
      BusinessService.getBusinessById(this.businessId).then((item) => {
        const business = item.data.data;
        if (business && business.name && business.invoice_note) {
          this.selectedBusiness = business.name.toLowerCase().trim();
          business.invoice_note = business.invoice_note.split("\n");
        }
        this.business = business;
        this.isLoading = false;
      });
    });
  },
};
</script>

<style scoped>
html,
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: "kh-content";
  src: local("kh-content"), url(../../fonts/kh-content.ttf) format("truetype");
}
@font-face {
  font-family: "trebuc";
  src: local("trebuc"), url(../../fonts/trebuc.ttf) format("truetype");
  unicode-range: U+0B02-CD;
}

body {
  font-family: "kh-content", sans-serif !important;
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

table tr th {
  font-size: 21px !important;
}

table tr td {
  font-size: 21px !important;
}

.table th {
  background-color: #1a4567 !important;
  color: #fff;
  padding: 0.2rem 0.5rem;
}

.p21-px {
  font-size: 21px !important;
}

.p20-px {
  font-size: 20px !important;
}

@media print {
  #noPrint {
    display: none;
  }
  .p8-px {
    font-size: 8px !important;
  }

  p {
    font-size: 18px !important;
  }

  h3 {
    font-size: 18px !important;
  }

  h2 {
    font-size: 24px !important;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: normal !important;
  }

  body {
    background-color: #fff !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    font-family: "kh-content", "Opensans", sans-serif !important;
  }

  @page {
    size: a4 portrait;
    margin: 1cm 0 1cm 0 !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
</style>
