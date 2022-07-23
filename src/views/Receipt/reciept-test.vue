<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <body class="A5 container" v-if="!isLoading && receipt">
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
    <div id="receipt-body mt-3" class="banner">
      <div class="receipt-no text-right p21-px font-weight-bold">
        <span>1005</span>
      </div>
      <div class="receipt-date text-right p21-px font-weight-bold">
        <span class="receipt-day">10</span>
        <span class="receipt-month">01</span>
        <span>2022</span>
      </div>
      <div class="receipt-name text-left p21-px font-weight-bold">
        <span>Test</span>
      </div>
      <div class="receipt-sum text-left p21-px font-weight-bold d-flex">
        <span>One Thousand Us.Dollar.</span>
        <div class="receipt-amount text-left p21-px font-weight-bold">
          <span>USD</span>
          <span>$1000.00</span>
        </div>
      </div>
      <div class="receipt-paymentOf text-left p21-px font-weight-bold d-flex">
        <span>Sticker Production</span>
        <div class="receipt-signature text-left p21-px font-weight-bold">
          <div>
            <img alt="ostos logo" src="img/invoice/signature.png" width="110" />
          </div>
        </div>
      </div>
      <div
        class="receipt-payment-type text-left p21-px font-weight-bold d-flex"
      >
        <span><i class="fa fa-check cash"></i></span>
        <span><i class="fa fa-check eBooking"></i></span>
        <span><i class="fa fa-check cheque"></i></span>
        <span class="cheque-no">0110011001</span>
      </div>
    </div>
  </body>
</template>

<script>
import ReceiptService from "../../services/receipt.service";
// import BusinessService from "../../services/business.service";
import moment from "moment";

export default {
  name: "preview-receipt",
  components: {},
  data() {
    return {
      isLoading: true,
      receipt: {},
      business: {},
      customerInfo: {},
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
    this.receiptId = this.$route.params.receiptId;
    ReceiptService.getReceiptById(this.receiptId).then((item) => {
      const receipt = item.data.data;
      this.customerInfo = receipt.customer_info;
      receipt.receipt_number = String(receipt.receipt_number).padStart(6, "0");
      receipt.date = moment(receipt.date).format("ddd DD-MM-YYYY");
      this.receipt = receipt;

      // this.businessId = receipt.business_id;
      // BusinessService.getBusinessById(this.businessId).then((item) => {
      //   const business = item.data.data;
      //   if (business && business.name && business.receipt_note) {
      //     this.selectedBusiness = business.name.toLowerCase().trim();
      //     business.receipt_note = business.receipt_note.split("\n");
      //   }
      //   this.business = business;
      this.isLoading = false;
      // });
    });
  },
};
</script>

<style scoped>
.container {
  position: relative;
}

.receipt-no {
  padding-right: 4.7rem;
  padding-top: 3.6rem;
}

.receipt-date {
  padding-right: 2.8rem;
  padding-top: 0.7rem;
}

.receipt-day {
  padding-right: 4.6rem;
}

.receipt-month {
  padding-right: 3.6rem;
}

.receipt-name {
  padding-left: 12.8rem;
  padding-top: 3.8rem;
}

.receipt-sum {
  padding-left: 10.8rem;
  padding-top: 2rem;
}

.receipt-amount {
  padding-left: 27.8rem;
  margin-top: -1.2rem;
}

.receipt-paymentOf {
  padding-left: 13.8rem;
  padding-top: 5.6rem;
}

.receipt-signature {
  padding-left: 28.8rem;
}

.receipt-payment-type {
  padding-left: 6.5rem;
  margin-top: -1.75rem;
}

.cash {
  padding-left: -8.5rem;
}

.eBooking {
  padding-left: 10.5rem;
}

.cheque {
  padding-left: 8.9rem;
}

.cheque-no {
  padding-left: 3rem;
}

.space-pre-line {
  white-space: pre-line;
}

#receipt-body {
  background-image: url("../../../public/img/receipt/receipt-form.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top;
}

body {
  font-family: "kh-content", sans-serif !important;
  font-size: 16px !important;
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

  /* .receipt-no {
    padding-right: 3.8rem;
    padding-top: 3rem;
  }

  .receipt-date {
    padding-right: 2.3rem;
    padding-top: 0.4rem;
  }

  .receipt-day {
    padding-right: 3.6rem;
  }

  .receipt-month {
    padding-right: 2.8rem;
  }

  .receipt-name {
    padding-left: 10.8rem;
    padding-top: 2.8rem;
  }

  .receipt-sum {
    padding-left: 8.8rem;
    padding-top: 1.7rem;
  }

  .receipt-amount {
    padding-left: 22.8rem;
    margin-top: -1rem;
  }

  .receipt-paymentOf {
    padding-left: 11.5rem;
    padding-top: 4.5rem;
  }

  .receipt-signature {
    padding-left: 23.8rem;
  } */

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
