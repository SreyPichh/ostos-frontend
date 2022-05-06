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
              width="150"
              height="70"
            />
          </div>
          <div class="text-right">
            <p>
              អស់ទាស់ ស្ទីកគ័រ និង ដេគ័រ <br />
              មានផ្តល់សេវាកម្ម ដេគ័រ ខេធីវី ក្លឹប និងគូរប្លង់ 3D<br />
              បិតស្ទីកគ័រ ខារ៉ាអូខេ ក្លឹប ការិយាល័យ និង អាគារខ្ពស់ៗ<br />
              បិតស្ទីកគ័រពាណិជ្ជកលមលលើរថ នតកាត់ស្ទីកគ័រ និង ត្រីនស្ទីកគ័រ
            </p>
          </div>
        </div>
        <hr class="my-1" />
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-baseline">
            <h2 class="font-weight-bold mr-1">Invoce:</h2>
            <p>
              {{
                invoice.object === "Invoice"
                  ? "#INV-"
                  : invoice.object === "Quote"
                  ? "#QUN"
                  : "#REN"
              }}{{ invoice.invoice_number }}
            </p>
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
          <div class="w-100 d-flex align-items-start flex-column">
            <h3 class="mr-2">
              Customer : <span>{{ invoice.customer_name }}</span>
            </h3>
            <h3 class="mr-2">ឈ្មោះ :</h3>
            <h3 class="mr-2">លេខទូរសព្ទ៍ :</h3>
          </div>
          <div class="text-right">
            <p class="mr-2">
              <span class="font-weight-bold">Address</span> : #No.28Eo, St.234,
              Sk.Phsa Dermkor Khan Toul Kok, Phnom Penh, Cambodia
            </p>
          </div>
        </div>
      </div>

      <div class="invoice-items">
        <table class="table table-sm">
          <thead>
            <tr class="invoiceListHeading">
              <th scope="col">NO.</th>
              <th scope="col">DESCRIPTION</th>
              <th scope="col">Size CM</th>
              <th scope="col">QUANTITY</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>ស្ទីកគ័រ តាមពុម្ព</td>
              <td>100 x 57</td>
              <td>3</td>
              <td>$5.00</td>
              <td>$15.00</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>ស្ទីកគ័រ តាមពុម្ព</td>
              <td>57 x 40</td>
              <td>1</td>
              <td>$3.00</td>
              <td>$3.00</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>ស្ទីកគ័រ តាមពុម្ព</td>
              <td>57 x 40</td>
              <td>1</td>
              <td>$3.00</td>
              <td>$3.00</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>ស្ទីកគ័រ តាមពុម្ព</td>
              <td>57 x 40</td>
              <td>1</td>
              <td>$3.00</td>
              <td>$3.00</td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>ស្ទីកគ័រ តាមពុម្ព</td>
              <td>57 x 40</td>
              <td>1</td>
              <td>$3.00</td>
              <td>$3.00</td>
            </tr>
            <tr>
              <th scope="row">6</th>
              <td>ស្ទីកគ័រ តាមពុម្ព</td>
              <td>57 x 40</td>
              <td>1</td>
              <td>$3.00</td>
              <td>$3.00</td>
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
                width="80"
                height="80"
              />
              <div class="ml-2">
                <p class="mr-2 mb-0">
                  លេខគណនីធនាគារ : <span class="font-weight-bold">ABA</span>
                </p>
                <p class="mr-2 mb-0">
                  លេខកុង : <span class="font-weight-bold">012 755 755</span>
                </p>
                <p class="mr-2 mb-0">
                  ឈ្មេាះ : <span class="font-weight-bold">Chea Sambath</span>
                </p>
              </div>
            </div>
          </div>
          <div class="w-50">
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">សរុប/Total</h3>
              <h3 class="col-sm-4 total-bg-color">$63.00</h3>
            </div>
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">ប្រាក់កក់/Deposite</h3>
              <h3 class="col-sm-4 deposite-bg-color">$</h3>
            </div>
            <div class="d-flex align-items-baseline">
              <h3 class="col-sm-8 text-right">នៅខ្វះ/Balance</h3>
              <h3 class="col-sm-4 balance-bg-color">$</h3>
            </div>
          </div>
        </div>

        <div class="customer-info">
          <div class="mb-2 d-flex justify-content-between">
            <div class="w-75">
              <img alt="ostos logo" src="img/brand/aba_qr.jpg" width="170" />
            </div>
            <div class="text-left">
              <div class="d-flex">
                <p class="font-weight-bold mr-1 mb-0">ចំណាំ:</p>
                <p class="mb-0">
                  សូមពិនិត្យទំនិញ និង
                  សេវាកម្មទាំងអស់ដោយខ្លួនឯងទំនិញទិញរួចឬសេវាកម្មបំរើហើយមិនអាចប្ដូរយកប្រាក់វិញទេ
                </p>
              </div>
              <div class="d-flex">
                <p class="font-weight-bold mr-1 mb-0">Note:</p>
                <p class="mb-0">
                  Goods purchased or service served can't be return please check
                  it before pay the bill thank.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="customer-info">
          <div class="mb-2 d-flex justify-content-between">
            <div class="text-align-center">
              <p class="mb-0 ml-2">SCAN HERE TO PAY</p>
              <h3 class="mb-0 ml-3">MEN RATANA</h3>
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
import moment from "moment";

export default {
  name: "preview-invoice",
  components: {},
  data() {
    return {
      isLoading: true,
      invoice: {},
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
      this.isLoading = false;
      console.log(this.invoice);
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
  font-family: Battambang;
  src: url("/static/invoice/fonts/Battambang/Battambang-Regular.ttf");
}

@font-face {
  font-family: Opensans;
  src: url("/static/invoice/fonts/OpenSans-Regular.ttf");
}

body {
  font-family: "Battambang", "Opensans", sans-serif;
  font-size: 16px;
}

.logo {
  height: 90px;
  width: auto;
  display: block;
}

.invoice-header {
  padding: 30px 0;
}

.invoiceListHeading {
  background-color: #1a4567;
  color: white;
  -webkit-print-color-adjust: exact;
}

.total-bg-color {
  background-color: #1a4567;
  color: #fff;
}

@media print {
  #noPrint {
    display: none;
  }
  tr.invoiceListHeading {
    background-color: #1a4567 !important;
    -webkit-print-color-adjust: exact !important;
  }
  .invoiceListHeading th {
    color: #000 !important;
    background-color: #1a4567 !important;
  }
  @page {
    size: a4 portrait;
    margin-top: 0;
    margin-bottom: 0;
    margin-left: 1cm;
    margin-right: 1cm;
    print-color-adjust: exact;
  }
}
</style>
