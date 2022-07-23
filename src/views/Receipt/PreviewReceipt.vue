<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <body class="A5 landscape container" v-if="!isLoading && receipt">
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
    <div id="receipt-body" class="banner mt-3">
      <div class="receipt-no text-left p21-px font-weight-bold">
        <span>{{ receipt.receipt_number }}&nbsp;</span>
      </div>
      <div class="receipt-date text-right p21-px font-weight-bold">
        <span class="receipt-day"
          >{{ moment(receipt.date).format("DD") }}&nbsp;</span
        >
        <span class="receipt-month"
          >{{ moment(receipt.date).format("MM") }}&nbsp;</span
        >
        <span>{{ moment(receipt.date).format("YYYY") }}&nbsp;</span>
        &nbsp;
      </div>
      <div class="receipt-name text-left p21-px font-weight-bold">
        <span>{{ receipt.customer_info.customer_name }}&nbsp;</span>
      </div>
      <div class="receipt-sum-1 text-left p21-px font-weight-bold d-flex">
        <span>{{ receipt.sumOf }}&nbsp;</span>
      </div>
      <div class="receipt-amount text-left p21-px font-weight-bold">
        <span>${{ receipt.amount.toFixed(2) }}&nbsp;</span>
      </div>
      <div class="receipt-sum-2 text-left p21-px font-weight-bold d-flex">
        <span>&nbsp;</span>
      </div>
      <div class="receipt-paymentOf text-left p21-px font-weight-bold d-flex">
        <span>{{ receipt.paymentOf }}&nbsp;</span>
      </div>
      <div
        class="text-right p21-px font-weight-bold"
        :class="
          receipt.signature ? 'has-receipt-signature' : 'no-receipt-signature'
        "
      >
        <div v-if="receipt.signature">
          <img alt="ostos logo" src="img/invoice/signature.png" width="110" />
        </div>
      </div>
      <div class="receipt-payment-type">
        <div class="cash text-left p21-px font-weight-bold d-flex">
          <i class="fa fa-check" v-if="receipt.type === 'Cash'"></i>&nbsp;
        </div>
        <div class="eBooking text-left p21-px font-weight-bold d-flex">
          <i class="fa fa-check" v-if="receipt.type === 'eBooking'"></i>&nbsp;
        </div>
        <div class="cheque text-left p21-px font-weight-bold d-flex">
          <i class="fa fa-check" v-if="receipt.type === 'Cheque'"></i>&nbsp;
        </div>
        <div class="cheque-no text-left p21-px font-weight-bold d-flex">
          <span v-if="receipt.no">{{ receipt.no }}</span
          >&nbsp;
        </div>
        &nbsp;
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
  created() {
    this.moment = moment;
  },
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
    splitString(str, length) {
      var words = str.split(" ");
      for (var j = 0; j < words.length; j++) {
        var l = words[j].length;
        if (l > length) {
          var result = [],
            i = 0;
          while (i < l) {
            result.push(words[j].substr(i, length));
            i += length;
          }
          words[j] = result.join(" ");
        }
      }
      return words.join(" ");
    },
  },
  mounted() {
    const converter = require("number-to-words");
    this.isLoading = true;
    this.receiptId = this.$route.params.receiptId;
    ReceiptService.getReceiptById(this.receiptId).then((item) => {
      const receipt = item.data.data;
      this.customerInfo = receipt.customer_info;
      receipt.receipt_number = String(receipt.receipt_number).padStart(6, "0");
      receipt.date = moment(receipt.date).format("YYYY-MM-DD");
      receipt.sumOf = converter.toWordsOrdinal(receipt.amount) + " US.Dollar.";

      const input = "This is a long sentence with more than 18 letters.";

      this.receipt = receipt;
      console.log(this.splitString(input, 5));

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
  padding-top: 3.6rem;
  padding-left: 62rem;
}

.receipt-date {
  padding-right: 1.8rem;
  padding-top: 0.7rem;
}

.receipt-month {
  padding-right: 3.2rem;
}

.receipt-day {
  padding-right: 4rem;
}

.receipt-name {
  padding-left: 12.8rem;
  padding-top: 3.8rem;
}

.receipt-sum-1 {
  padding-left: 10.8rem;
  padding-top: 2rem;
}

.receipt-sum-2 {
  padding-left: 3.8rem;
  padding-top: 3rem;
}

.receipt-amount {
  padding-left: 53.8rem;
  margin-top: -3rem;
}

.receipt-paymentOf {
  padding-left: 13.8rem;
  padding-top: 1.6rem;
}

.has-receipt-signature {
  padding-right: 10rem;
  margin-top: -4rem;
}

.no-receipt-signature {
  padding-right: 10rem;
  margin-top: 2rem;
}

.receipt-payment-type {
  padding-bottom: 1.5rem;
}

.cash {
  padding-left: 6.5rem;
  margin-top: 0.5rem;
}

.eBooking {
  padding-left: 18.2rem;
  margin-top: -2rem;
}

.cheque {
  padding-left: 28.5rem;
  margin-top: -2rem;
}

.cheque-no {
  padding-left: 33rem;
  margin-top: -2.2rem;
}

.space-pre-line {
  white-space: pre-line;
}

#receipt-body {
  background-image: url("../../../public/img/receipt/receipt-form.png");
  background-repeat: no-repeat;
  background-size: cover;
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

  .receipt-no {
    padding-top: 3rem;
    padding-left: 54rem;
  }

  .receipt-date {
    padding-right: 1.3rem;
    padding-top: 0.5rem;
  }

  .receipt-month {
    padding-right: 2.2rem;
  }

  .receipt-day {
    padding-right: 3rem;
  }

  .receipt-name {
    padding-left: 10.8rem;
    padding-top: 3rem;
  }

  .receipt-sum-1 {
    padding-left: 8.8rem;
    padding-top: 1.6rem;
  }

  .receipt-sum-2 {
    padding-left: 3.8rem;
    padding-top: 2.2rem;
  }

  .receipt-amount {
    padding-left: 45rem;
    margin-top: -3rem;
  }

  .receipt-paymentOf {
    padding-left: 11.8rem;
    padding-top: 1.2rem;
  }

  .has-receipt-signature {
    padding-right: 8rem;
    margin-top: -2rem;
  }

  .no-receipt-signature {
    padding-right: 8rem;
    margin-top: 3rem;
  }

  .receipt-payment-type {
    padding-bottom: 1rem;
  }

  .cash {
    padding-left: 5.5rem;
    margin-top: -1.5rem;
  }

  .eBooking {
    padding-left: 15.7rem;
    margin-top: -2rem;
  }

  .cheque {
    padding-left: 24.5rem;
    margin-top: -2rem;
  }

  .cheque-no {
    padding-left: 29rem;
    margin-top: -2.2rem;
  }

  body {
    background-color: #fff !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    font-family: "kh-content", "Opensans", sans-serif !important;
  }

  @page {
    size: A5 landscape !important;
    margin: 1cm 0 1cm 0 !important;
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
</style>
