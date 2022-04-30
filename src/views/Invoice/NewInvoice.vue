<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <div class="container-fluid mt--5 mb-5" v-if="!isLoading">
    <div class="row my-3">
      <div class="col-xl-12">
        <card shadow type="secondary" bodyClasses="pb-0">
          <div class="row">
            <div class="col-lg-2">
              <label class="form-control-label">Select Type</label>
              <Multiselect
                v-model="invoice.invoiceType"
                mode="single"
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
                  id="example-datetime-local-input"
                />
              </base-input>
            </div>
            <div class="col-lg-2">
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

    <div class="row">
      <div class="col-xl-6 order-xl-1">
        <card shadow type="secondary" bodyClasses="pb-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Customer Information</h3>
                </div>
              </div>
            </div>
          </template>

          <div class="row">
            <div class="col-lg-6">
              <base-input
                alternative=""
                placeholder="Enter Name"
                input-classes="form-control-alternative"
                v-model="invoice.cName"
              />
            </div>
            <div class="col-lg-6">
              <base-input
                addonLeftIcon="fa fa-envelope"
                placeholder="jesse@example.com"
                input-classes="form-control-alternative"
                v-model="invoice.cEmail"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <base-input
                addonLeftIcon="fa fa-phone"
                placeholder="Phone Number"
                input-classes="form-control-alternative"
                v-model="invoice.cPhone"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <base-input
                alternative=""
                placeholder="Address 1"
                input-classes="form-control-alternative"
                v-model="invoice.cAdd1"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <base-input
                alternative=""
                placeholder="Address 2"
                input-classes="form-control-alternative"
                v-model="invoice.cAdd2"
              />
            </div>
          </div>
        </card>
      </div>

      <div class="col-xl-6 pl-0 order-xl-2">
        <card
          height="100%"
          shadow
          type="secondary"
          class="pb-4"
          bodyClasses="pb-0"
        >
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

    <div class="row my-3">
      <div class="col-xl-12 order-xl-2">
        <card shadow type="secondary" bodyClasses="py-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center justify-content-between">
                <div class="col">
                  <h3 class="mb-0">Invoices Items</h3>
                </div>
                <div class="col-lg-3">
                  <Multiselect
                    v-model="invoice.business_id"
                    placeholder="Business Type"
                    @change="onChangeBusiness"
                    :searchable="true"
                    :options="businesses"
                  />
                </div>
              </div>
            </div>
          </template>

          <div class="table-responsive pb-7" v-if="invoice.business_id">
            <table class="table tablesorter thead-light table-sm">
              <thead>
                <th
                  :class="selectedBusiness !== 'car' ? 'col-sm-4' : 'col-sm-5'"
                >
                  Product Name
                </th>
                <template v-if="selectedBusiness == 'printing'">
                  <th>ALL Cover</th>
                </template>
                <template v-if="selectedBusiness !== 'car'">
                  <th>width</th>
                  <th>length</th>
                  <th>quantity</th>
                </template>
                <!-- <th>M2</th> -->
                <th>Unit Price</th>
                <th>Total</th>
                <th></th>
              </thead>

              <tbody v-for="(product, index) in products" :key="index">
                <td>
                  <Multiselect
                    v-model="product.product_id"
                    :searchable="true"
                    placeholder="Choose Product"
                    @change="onProductChange(index, $event)"
                    :options="productList"
                  />
                </td>
                <template v-if="selectedBusiness == 'printing'">
                  <td>
                    <base-checkbox
                      @input="onCoverALlClick(index, $event)"
                      v-model="product.coverAll"
                    >
                    </base-checkbox>
                  </td>
                </template>
                <template v-if="selectedBusiness !== 'car'">
                  <td>
                    <base-input
                      addonRightText="CM"
                      :disabled="product.coverAll"
                      @keypress="isNumber($event)"
                      @change="onProductCalculate(index, $event)"
                      input-classes="form-control-alternative"
                      v-model="product.width"
                    />
                  </td>
                  <td>
                    <base-input
                      addonRightText="CM"
                      :disabled="product.coverAll"
                      @keypress="isNumber($event)"
                      @change="onProductCalculate(index, $event)"
                      input-classes="form-control-alternative"
                      v-model="product.length"
                    />
                  </td>
                  <td>
                    <base-input
                      addonLeftText="Qty"
                      @keypress="isNumber($event)"
                      @change="onProductCalculate(index, $event)"
                      :name="`products[${index}][quantity]`"
                      input-classes="form-control-alternative"
                      v-model="product.quantity"
                    />
                  </td>
                </template>
                <td>
                  <base-input
                    addonLeftText="$"
                    addonRightText=".00"
                    @keypress="isNumber($event)"
                    @change="onProductCalculate(index, $event)"
                    placeholder="Unit Price"
                    input-classes="form-control-alternative"
                    v-model="product.unit_price"
                  />
                </td>

                <td>$ {{ product.total_price }}</td>
                <td>
                  <span @click.prevent="remove(index)" class="delete-icon"
                    ><i class="fa fa-trash"></i
                  ></span>
                </td>
              </tbody>
            </table>
            <div class="form-group">
              <button @click="addProduct" type="button" class="btn btn-default">
                Add Product
              </button>
            </div>
          </div>

          <div v-if="!invoice.business_id" class="text-center pt-3 pb-5">
            Please select business type
          </div>
        </card>
      </div>
    </div>
    <div class="float-right mb-3">
      <button
        @click.prevent="createNewInvoice()"
        type="button"
        class="btn btn-default"
      >
        Create
      </button>
    </div>
  </div>

  <modal v-model:show="warningAlert">
    <template v-slot:header>
      <h3 class="modal-title text-danger">Warning</h3>
    </template>
    <div>
      If you change the business type, the data of product will be
      <span class="text-danger font-weight-bold">reset</span>
    </div>
    <br />
    <p class="text-danger">Are you sure, to change it?</p>
    <template v-slot:footer>
      <base-button type="secondary" @click.prevent="onCancelChangeBusiness()"
        >Cancel</base-button
      >
      <base-button
        type="danger"
        @click.prevent="onBusinessSelected(invoice.business_id)"
        >Change</base-button
      >
    </template>
  </modal>
</template>

<script>
import BusinessService from "../../services/business.service";
import ProductService from "../../services/product.service";
import UserService from "../../services/user.service";
import InvoiceService from "../../services/invoice.service";

import Multiselect from "@vueform/multiselect";
export default {
  components: {
    Multiselect,
  },
  name: "new-invoice",
  data() {
    return {
      isLoading: true,
      invoice: {
        invoiceType: "Invoice",
        status: "Paid",
      },
      businesses: [],
      employees: [],
      productList: [],
      allProductLists: [],
      products: [],
      warningAlert: false,
    };
  },
  mounted() {
    this.isLoading = true;
    BusinessService.getBusinesses().then((items) => {
      this.isLoading = false;
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
    });

    ProductService.getProducts({ limit: 0 }).then((items) => {
      this.isLoading = false;
      this.allProductLists = items.data.data;
    });

    UserService.getUsers().then((items) => {
      this.isLoading = false;
      this.employees = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
    });
  },
  methods: {
    // On Change Business Type
    onCancelChangeBusiness() {
      this.warningAlert = false;
      this.invoice.business_id = this.previousBid;
    },
    onChangeBusiness(id) {
      this.previousBid = this.invoice.business_id;
      if (this.invoice.business_id) {
        this.warningAlert = true;
      } else {
        this.onBusinessSelected(id);
      }
    },
    onBusinessSelected(id) {
      this.warningAlert = false;
      if (id) {
        this.selectedBusiness = this.businesses
          .find((b) => b.value === id)
          .label.toLowerCase()
          .trim();
        this.products = [
          {
            product_id: "",
            product_name: "",
            coverAll: false,
            width: "",
            length: "",
            quantity: "",
            unit_price: "",
            total_price: 0,
          },
        ];
        this.productList = this.allProductLists
          .filter((product) => product.business_id === id)
          .map((item) => {
            return { label: item.name, value: item.id };
          });
      }
    },
    onCoverALlClick(index, isChecked) {
      const product = this.products[index];
      product.coverAll = isChecked;
      if (isChecked) {
        product.width = "";
        product.length = "";
      }
      this.onProductCalculate(index);
    },

    // Products
    addProduct() {
      this.products.push({
        product_id: "",
        product_name: "",
        width: "",
        length: "",
        quantity: "",
        unit_price: "",
        total_price: 0,
      });
    },
    remove(index) {
      this.products.splice(index, 1);
    },
    onProductChange(index, pId) {
      const product = this.products[index];
      if (pId) {
        product.unit_price = this.allProductLists.find(
          (prod) => prod.id === pId
        ).price;
      } else {
        product.unit_price = "";
      }
      product.total_price = 0;
      product.width = "";
      product.length = "";
      product.quantity = "";
    },
    onProductCalculate(index) {
      const product = this.products[index];
      const isCoverAll = product.coverAll;
      const unit_price = product.unit_price;
      const qty = product.quantity;
      const width = product.width;
      const length = product.length;
      // Set Total Price
      if (!isCoverAll) {
        const m2 = (width * length) / 10000;
        this.products[index].total_price = m2 * unit_price * qty;
      } else if (this.selectedBusiness !== "ktv") {
        console.log("this from ktv");
        this.products[index].total_price = unit_price * qty;
      } else {
        this.products[index].total_price = unit_price * qty;
      }
    },
    createNewInvoice() {
      const invoice = this.invoice;
      const employees = this.employees.map((emp) => {
        return { employee_id: emp.value, employee_name: emp.label };
      });
      const data = {
        type: invoice.invoiceType,
        invoice_number: invoice.invoice_number,
        date: invoice.date,
        due_amount: invoice.due_amount,
        business_id: invoice.business_id,
        customer_name: invoice.cName,
        customer_phone_number: invoice.cPhone,
        customer_email: invoice.cEmail,
        customer_address1: invoice.cAdd1,
        customer_address2: invoice.cAdd2,
        status: invoice.status,
        total: invoice.total,
        employess_data: employees,
        product_data: this.products,
      };
      InvoiceService.postInvoice(data).then(
        () => {
          this.$router.push("/products");
        },
        (error) => {
          alert("error to get data", error);
        }
      );
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
<style scoped>
.table td {
  padding: 0.5rem;
  vertical-align: unset !important;
  border-top: 1px solid #e9ecef;
}

.table td .form-group {
  margin-bottom: 0;
}
</style>
