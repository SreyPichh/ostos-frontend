<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <body class="A5 container" v-if="!isLoading && quote">
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
      <div class="quote-header">
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
            <h2 class="mr-1">Quote:</h2>
            <p>#INV-{{ quote.quote_number }}</p>
          </div>
          <div class="text-right">
            <p>
              Date: <span>{{ quote.date }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="customer-info">
        <div class="mb-2 d-flex justify-content-between">
          <div class="w-75 d-flex align-items-start flex-column">
            <h2 v-if="quote.customer_name">To : {{ quote.customer_name }}</h2>
            <h2>
              Tel :
              <span
                class="p"
                v-if="
                  quote.customer_phone_number || quote.customer_phone_number2
                "
              >
                {{ quote.customer_phone_number }}
                {{
                  quote.customer_phone_number2
                    ? `| ${quote.customer_phone_number2}`
                    : ""
                }}
              </span>
            </h2>
            <h2 v-if="quote.customer_email">
              Email : <span class="p">{{ quote.customer_email }}</span>
            </h2>
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

      <!-- <div class="quote-items">
        <table class="table table-sm">
          <tr class="quoteListHeading">
            <th>NO.</th>
            <th>DESCRIPTION</th>
            <th v-if="selectedBusiness !== 'car'">Size CM</th>
            <th v-if="selectedBusiness == 'printing'">M&sup2;</th>
            <th v-if="selectedBusiness !== 'car'">QUANTITY</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
          <tbody>
            <tr v-for="(product, index) in quote.product_data" :key="index">
              <th scope="row" class="align-middle">{{ index + 1 }}</th>
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
      </div> -->

      <div class="quote-footer mt-auto">
        <div class="bank-info mb-2 d-flex justify-content-between">
          <div class="w-75">
            <div class="d-flex">
              <div class="ml-2">
                <p class="mr-2 mb-0 p24-px">
                  Note: Payment term: Payment term:
                </p>
                <p class="mr-2 mb-0 p24-px">
                  {{ business.quote_note }}
                </p>
              </div>
            </div>
          </div>
          <div class="w-50">
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">សរុប/Total</h3>
              <h3 class="col-sm-4 total-bg-color">
                ${{ quote.total }}{{ quote.total >= 1 ? ".00" : "" }}
              </h3>
            </div>
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">ប្រាក់កក់/Deposite</h3>
              <h3 class="col-sm-4">
                ${{ quote.due_amount }}{{ quote.total >= 1 ? ".00" : "" }}
              </h3>
            </div>
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">នៅខ្វះ/Balance</h3>
              <h3 class="col-sm-4 bg-pink">
                <span
                  class="py-1 text-red"
                  v-if="quote.due_amount - quote.total < 0"
                  >${{ (quote.due_amount - quote.total) * -1
                  }}{{ quote.total >= 1 ? ".00" : "" }}</span
                >
              </h3>
            </div>
          </div>
        </div>
        <br />

        <div class="customer-info">
          <div
            class="d-flex justify-content-between"
            :class="{ 'mb-7': !quote.signature }"
          >
            <div class="text-center">
              <h3 class="mb-0 ml-2">ហត្ថលេខាអ្នកទិញ</h3>
              <h3 class="mb-0 ml-2">Customer Signature</h3>
            </div>
            <div class="text-center">
              <h3 class="mb-0 ml-2">ហត្ថាលេខាអ្នកលក់</h3>
              <h3 class="mb-0 ml-2">Seller Signature</h3>
              <div v-if="quote.signature">
                <img
                  alt="ostos logo"
                  src="img/quote/signature.png"
                  width="120"
                />
              </div>
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
import QuoteService from "../../services/quote.service";
import BusinessService from "../../services/business.service";
// import moment from "moment";

export default {
  name: "preview-quote",
  components: {},
  data() {
    return {
      isLoading: true,
      quote: {},
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
    this.quoteId = this.$route.params.quoteId;
    QuoteService.getQuoteById(this.quoteId).then((item) => {
      const quote = item.data.data;
      // quote.quote_number = String(quote.quote_number).padStart(6, "0");
      // quote.date = moment(quote.date).format("dddd, Do MMMM, YYYY");
      // this.employees = quote.employee_data.map((emp) => emp.employee_id);
      // this.products = quote.product_data;
      this.quote = quote;

      this.businessId = 1;
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
  src: url("/static/quote/fonts/Battambang/Battambang-Regular.ttf") !important;
}

@font-face {
  font-family: Opensans !important;
  src: url("/static/quote/fonts/OpenSans-Regular.ttf") !important;
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

.quote-header {
  padding: 30px 0;
}

tr.quoteListHeading {
  background-color: #1a4567;
  color: #fff;
}

.total-bg-color {
  background-color: #1a4567;
  color: #fff;
}

h1,
h2,
h3,
h4,
h5 {
  font-weight: normal !important;
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

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-weight: normal !important;
  }

  tr.quoteListHeading {
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
