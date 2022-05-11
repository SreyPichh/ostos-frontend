<template>
  <modal modal-classes="modal-dialog-centered" @close="onClose">
    <template v-slot:header>
      <h4>Filter Modal</h4>
    </template>
    <base-input
      addonLeftText="#INV-"
      label="Invoice No"
      @keypress="isNumber($event)"
      label-classes="form-control-range"
      input-classes="form-control-alternative px-2"
      v-model="invoice_number"
    />
    <template v-slot:footer>
      <button @click.prevent="onFilter()" class="btn btn-default">
        Search
      </button>
      <button
        type="link"
        class="ml-auto btn btn-secondary"
        @click.prevent="onClose"
      >
        Close
      </button>
    </template>
  </modal>
</template>

<script>
// @ is an alias to /src
import InvoiceService from "../../services/invoice.service";

export default {
  name: "filter-invoice",
  components: {},
  data() {
    return {
      isOpen: false,
      invoice_number: "",
    };
  },
  methods: {
    onFilter() {
      InvoiceService.getInvoiceById(6).then((items) => {
        this.$emit("items", [items.data.data]);
      });
    },
    onClose() {
      this.isOpen = false;
      this.$emit("close");
    },

    // Allow only Nubmer
    isNumber(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      }
    },
  },
};
</script>
