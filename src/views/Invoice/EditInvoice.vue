<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>
  <div class="container-fluid mt--5 mb-5">
    <div class="row">
      <div class="col-xl-12 mb-3">
        <card shadow type="secondary">
          <div class="row">
            <div class="col-lg-2">
              <label class="form-control-label">Select Type</label>
              <Multiselect
                v-model="invoice.invoiceType"
                :options="['Invoice', 'Reciept', 'Quote']"
              />
            </div>
            <div class="col-lg-2">
              <base-input
                addonLeftText="#INV"
                label="Invoice No"
                inputType="number"
                @keypress="isNumber($event)"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                v-model="invoice.invoice_number"
              />
            </div>
            <div class="col-lg-3">
              <base-input label="Date" v-model="invoice.date">
                <input
                  class="form-control"
                  type="datetime-local"
                  value="2018-11-23T10:30:00"
                  id="example-datetime-local-input"
                />
              </base-input>
            </div>
            <div class="col-lg-3">
              <label class="form-control-label">Status</label>
              <Multiselect
                v-model="invoice.status"
                :options="['Paid', 'Unpaid', 'Partial Billed']"
              />
            </div>
            <div class="col-lg-2">
              <base-input
                addonLeftText="$"
                addonRightText=".00"
                @keypress="isNumber($event)"
                label="Due Amount"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                v-model="invoice.dueAmount"
              />
            </div>
          </div>
        </card>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-xl-6 order-xl-1">
        <card shadow type="secondary">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Customer Information</h3>
                </div>
                <!-- <div class="col-5 text-right">
                  <a href="#!" class="btn btn-sm btn-default"
                    >Select Existing Customer</a
                  >
                </div> -->
              </div>
            </div>
          </template>

          <div class="row">
            <div class="col-lg-6">
              <base-input
                alternative=""
                placeholder="Enter Name"
                input-classes="form-control-alternative"
                v-model="invoice.customer_name"
              />
            </div>
            <div class="col-lg-6">
              <base-input
                addonLeftIcon="fa fa-envelope"
                placeholder="jesse@example.com"
                input-classes="form-control-alternative"
                v-model="invoice.customer_email"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <base-input
                addonLeftIcon="fa fa-phone"
                placeholder="Phone Number"
                input-classes="form-control-alternative"
                v-model="invoice.customer_phone_number"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <base-input
                alternative=""
                placeholder="Address 1"
                input-classes="form-control-alternative"
                v-model="invoice.customer_address1"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <base-input
                alternative=""
                placeholder="Address 2"
                input-classes="form-control-alternative"
                v-model="invoice.customer_address2"
              />
            </div>
          </div>
        </card>
      </div>

      <div class="col-xl-6 pl-0 order-xl-2">
        <card height="100%" shadow type="secondary" class="pb-4">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Employee Information</h3>
                </div>
              </div>
            </div>
          </template>

          <div class="row">
            <div class="col-lg-12">
              <Multiselect
                v-model="invoice.employee_id"
                mode="tags"
                placeholder="Choose employee"
                :searchable="true"
                :createTag="true"
                :options="employees"
              >
              </Multiselect>
            </div>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <div class="col-xl-12 order-xl-2">
        <card shadow type="secondary">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Invoices Items</h3>
                </div>
              </div>
            </div>
          </template>

          <div
            class="form-row mb--2"
            v-for="(product, index) in products"
            :key="index"
          >
            <div class="col-md-3">
              <Multiselect
                v-model="product.product_id"
                :searchable="true"
                placeholder="Choose Product"
                :options="productList"
              />
            </div>
            <div class="col-md-2">
              <base-input
                addonLeftText="ទទឹង"
                @keypress="isNumber($event)"
                input-classes="form-control-alternative"
                v-model="product.size_cm"
              />
            </div>
            <div class="col-md-2">
              <base-input
                addonLeftText="បណ្ដោយ"
                @keypress="isNumber($event)"
                input-classes="form-control-alternative"
                v-model="product.size_cm"
              />
            </div>
            <div class="col-md-2">
              <base-input
                addonLeftText="Qty"
                @keypress="isNumber($event)"
                :name="`products[${index}][quantity]`"
                input-classes="form-control-alternative"
                v-model="product.quantity"
              />
            </div>
            <div class="col-md-2">
              <base-input
                addonLeftText="$"
                addonRightText=".00"
                @keypress="isNumber($event)"
                placeholder="Unit Price"
                input-classes="form-control-alternative"
                v-model="product.price"
              />
            </div>
            <div class="col form-group form-inline">
              <span
                v-if="index >= 0"
                @click.prevent="remove(index)"
                class="delete-icon"
                ><i class="fa fa-trash"></i
              ></span>
            </div>
          </div>

          <div class="form-group">
            <button @click="addProduct" type="button" class="btn btn-default">
              Add Product
            </button>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
export default {
  components: {
    Multiselect,
  },
  name: "edit-invoice",
  data() {
    return {
      invoice: {},
      employees: [
        { value: "rey", label: "Rey" },
        { value: "pheap", label: "Pheap" },
        { value: "pruoun", label: "Pruoun" },
        { value: "tem", label: "Tem" },
        { value: "lapa", label: "Lapa" },
        { value: "mey", label: "Mey" },
      ],
      productList: [
        "បិតហ្វីមឡានកំរិត3ឆ្នាំ",
        "ស្ទីកគ័រ សាក់ជញ្ជាំងកញ្ចក់",
        "ព្រីនស្ទីកគ័របាតខ្មៅ",
      ],
      products: [{ name: "", size_cm: "", price: "", quantity: "" }],
    };
  },
  methods: {
    addProduct() {
      this.products.push({
        name: "",
        price: "",
        quantity: "",
        size_cm: "",
      });
    },

    remove(index) {
      this.products.splice(index, 1);
    },

    submit() {
      const data = {
        products: this.products,
      };
      alert(JSON.stringify(data, null, 2));
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
<style src="@vueform/multiselect/themes/default.css"></style>
