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
      <div class="receipt-no text-left p21-px">
        <span>{{ receipt.receipt_number }}&nbsp;</span>
      </div>
      <div class="receipt-date text-right p21-px">
        <span class="receipt-day"
          >{{ moment(receipt.date).format("DD") }}&nbsp;</span
        >
        <span class="receipt-month"
          >{{ moment(receipt.date).format("MM") }}&nbsp;</span
        >
        <span>{{ moment(receipt.date).format("YYYY") }}&nbsp;</span>
        &nbsp;
      </div>
      <div class="receipt-name text-left p21-px">
        <span>{{ receipt.customer_info.customer_name }}&nbsp;</span>
      </div>
      <div class="receipt-sum-1 text-left p21-px d-flex">
        <span
          >{{ sumOf1.charAt(0).toUpperCase() + sumOf1.slice(1) }}&nbsp;</span
        >
      </div>
      <div class="receipt-amount text-left p21-px">
        <span>${{ receipt.amount.toFixed(2) }}&nbsp;</span>
      </div>
      <div class="receipt-sum-2 text-left p21-px d-flex">
        <span>{{ sumOf2 }}&nbsp;</span>
      </div>
      <div class="receipt-paymentOf text-left p21-px d-flex">
        <span>{{ receipt.paymentOf }}&nbsp;</span>
      </div>
      <div
        class="text-right p21-px"
        :class="
          receipt.signature ? 'has-receipt-signature' : 'no-receipt-signature'
        "
      >
        <div v-if="receipt.signature">
          <img alt="ostos logo" src="img/invoice/signature.png" width="110" />
        </div>
      </div>
      <div class="receipt-payment-type">
        <div class="cash text-left p21-px d-flex">
          <i class="fa fa-check" v-if="receipt.type === 'cash'"></i>&nbsp;
        </div>
        <div class="eBooking text-left p21-px d-flex">
          <i class="fa fa-check" v-if="receipt.type === 'eBanking'"></i>&nbsp;
        </div>
        <div class="cheque text-left p21-px d-flex">
          <i class="fa fa-check" v-if="receipt.type === 'cheque'"></i>&nbsp;
        </div>
        <div class="cheque-no text-left p21-px d-flex">
          <span v-if="receipt.type === 'cheque' && receipt.no">{{
            receipt.no
          }}</span
          >&nbsp;
        </div>
        &nbsp;
      </div>
    </div>
  </body>
</template>

<script>
import ReceiptService from "../../services/receipt.service";
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
      sumOf1: "",
      sumOf2: "",
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
    const converter = require("number-to-words");
    this.isLoading = true;
    this.receiptId = this.$route.params.receiptId;
    ReceiptService.getReceiptById(this.receiptId).then((item) => {
      const receipt = item.data.data;
      this.customerInfo = receipt.customer_info;
      receipt.receipt_number = String(receipt.receipt_number).padStart(6, "0");
      receipt.date = moment(receipt.date).format("YYYY-MM-DD");
      const amountConvertToWord = converter
        .toWordsOrdinal(receipt.amount)
        .split(" ");
      if (
        amountConvertToWord.length < 5 ||
        amountConvertToWord.join(" ").length <= 40
      ) {
        this.sumOf1 = amountConvertToWord.join(" ") + " US.Dollar.";
        this.sumOf2 = "";
      } else if (amountConvertToWord.length >= 5) {
        this.sumOf1 = amountConvertToWord.slice(0, 5).join(" ");
        this.sumOf2 = amountConvertToWord.slice(5).join(" ") + " US.Dollar.";
      }
      this.receipt = receipt;
      this.isLoading = false;
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
  padding-left: 10.8rem;
  padding-top: 2rem;
}

.receipt-amount {
  padding-left: 53.8rem;
  margin-top: -3rem;
}

.receipt-paymentOf {
  padding-left: 13.8rem;
  padding-top: 2.6rem;
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
  color: #000;
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
    padding-left: 8.8rem;
    padding-top: 1.2rem;
  }

  .receipt-amount {
    padding-left: 45rem;
    margin-top: -3rem;
  }

  .receipt-paymentOf {
    padding-left: 11.8rem;
    padding-top: 2.2rem;
  }

  .has-receipt-signature {
    padding-right: 8rem;
    margin-top: -3rem;
  }

  .no-receipt-signature {
    padding-right: 8rem;
    margin-top: 2rem;
  }

  .receipt-payment-type {
    padding-bottom: 1rem;
  }

  .cash {
    padding-left: 5.5rem;
    margin-top: -1rem;
  }

  .eBooking {
    padding-left: 15.7rem;
    margin-top: -2rem;
  }

  .cheque {
    padding-left: 24.5rem;
    margin-top: -1.5rem;
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
