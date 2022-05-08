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
  <div class="container-fluid mt--5 mb-5" v-if="!isLoading && invoice">
    <div class="row my-3">
      <div class="col-xl-12">
        <card shadow type="secondary" bodyClasses="pb-0">
          <div class="row">
            <div class="col-lg-2">
              <base-input
                addonLeftText="#INV-"
                label="Invoice No"
                @keypress="isNumber($event)"
                label-classes="form-control-range"
                input-classes="form-control-alternative px-2"
                disabled="true"
                v-model="invoice.invoice_number"
              />
            </div>
            <div class="col-lg-4">
              <div class="form-group">
                <label class="form-control-label">Date</label>
                <v-date-picker
                  class="inline-block h-full"
                  :masks="masks"
                  :model-config="modelConfig"
                  is-required
                  mode="date"
                  color="red"
                  v-model="invoice.date"
                >
                  <template v-slot="{ inputValue, togglePopover }">
                    <div class="d-flex items-center">
                      <button
                        class="px-3 border bg-red rounded-left"
                        @click="togglePopover()"
                      >
                        <i class="fa fa-calendar-alt fa-lg text-white"></i>
                      </button>
                      <input
                        :value="inputValue"
                        class="px-2 border rounded-0 form-control bg-white"
                        readonly
                      />
                    </div>
                  </template>
                </v-date-picker>
              </div>
            </div>
            <div class="col-lg-2">
              <div class="form-group">
                <label class="form-control-label">Status</label>
                <Multiselect
                  v-model="invoice.status"
                  :options="['paid', 'unpaid', 'partial-billed']"
                />
              </div>
            </div>
            <div class="col-lg-2">
              <base-input
                addonLeftText="$"
                addonRightText=".00"
                @keypress="isNumber($event)"
                label="Due Amount"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                v-model="invoice.due_amount"
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
                v-model="invoice.customer_name"
              />
            </div>
            <div class="col-lg-6">
              <base-input
                addonLeftIcon="fa fa-envelope"
                placeholder="-----"
                input-classes="form-control-alternative"
                v-model="invoice.customer_email"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <base-input
                addonLeftIcon="fa fa-phone"
                placeholder="Phone Number 1"
                input-classes="form-control-alternative"
                v-model="invoice.customer_phone_number"
              />
            </div>
            <div class="col-lg-6">
              <base-input
                addonLeftIcon="fa fa-phone"
                placeholder="Phone Number 2"
                input-classes="form-control-alternative"
                v-model="invoice.customer_phone_number2"
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
                v-model="employees"
                mode="tags"
                placeholder="Choose employee"
                :searchable="true"
                :createTag="true"
                :options="employeeOptions"
              >
              </Multiselect>
            </div>
          </div>
        </card>
      </div>
    </div>

    <div class="row my-3">
      <div class="col-xl-12 order-xl-2">
        <card shadow type="secondary" bodyClasses="p-0">
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
                    @change="onChangeBusiness()"
                    :searchable="true"
                    :options="businesses"
                  />
                </div>
              </div>
            </div>
          </template>

          <div
            class="table-responsive pb-7"
            v-if="invoice.business_id && productList"
          >
            <table class="table tablesorter thead-light table-sm">
              <thead>
                <th
                  :class="selectedBusiness !== 'car' ? 'col-sm-4' : 'col-sm-5'"
                >
                  Product Name
                </th>
                <template v-if="selectedBusiness == 'printing'">
                  <th>ម៉ៅផ្ដាច់</th>
                </template>
                <template v-if="selectedBusiness !== 'car'">
                  <th>width</th>
                  <th>length</th>
                  <th v-if="selectedBusiness == 'printing'">M&sup2;</th>
                  <th>quantity</th>
                </template>
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
                  <td v-if="selectedBusiness == 'printing'">
                    <span>{{ (product.width * product.length) / 10000 }}</span>
                    m&sup2;
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

                <td>${{ product.total_price }}</td>
                <td>
                  <span @click.prevent="remove(index)" class="delete-icon"
                    ><i class="fa fa-trash"></i
                  ></span>
                </td>
              </tbody>
            </table>
            <div class="row px-3 align-items-center justify-content-between">
              <button
                @click.prevent="addProduct"
                type="button"
                class="btn btn-default ml-2"
              >
                Add Product
              </button>
              <div>
                <h2>
                  Total :
                  <span class="bg-teal px-3 py-1">${{ invoice.total }}.00</span>
                </h2>
              </div>
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
        @click.prevent="updateInvoice()"
        type="button"
        class="btn btn-default"
      >
        Update
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
        @click.prevent="onBusinessSelected(invoice.business_id, true)"
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
  name: "edit-invoice",
  data() {
    return {
      isLoading: true,
      invoice: {},
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "WWWW, DD-MM-YYYY",
      },
      selectedBusiness: "",
      businesses: [],
      productList: [],
      allProductLists: [],
      employeeOptions: [],
      employees: [],
      products: [],
      warningAlert: false,
    };
  },
  mounted() {
    this.isLoading = true;
    this.invoiceId = this.$route.params.invoiceId;
    // Get All Businesses
    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
    });

    // Get ALl Employeese
    UserService.getUsers().then((items) => {
      this.employeesList = items.data.data;
      this.employeeOptions = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
    });

    InvoiceService.getInvoiceById(this.invoiceId).then((item) => {
      const invoice = item.data.data;

      invoice.invoice_number = String(invoice.invoice_number).padStart(6, "0");
      this.employees = invoice.employee_data.map((emp) => emp.employee_id);
      this.products = invoice.product_data;
      this.invoice = invoice;

      // Get All Products
      ProductService.getProducts({ limit: 0 }).then((items) => {
        this.allProductLists = items.data.data;
        this.onBusinessSelected(invoice.business_id, false);
        this.isLoading = false;
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
        this.onBusinessSelected(id, true);
      }
    },
    onBusinessSelected(id, isReset) {
      this.warningAlert = false;
      if (id) {
        this.selectedBusiness = this.businesses
          .find((b) => b.value === id)
          .label.toLowerCase()
          .trim();

        if (isReset) {
          this.onResetProducts();
        }
        this.productList = this.allProductLists
          .filter((product) => product.business_id === id)
          .map((item) => {
            return { label: item.name, value: item.id };
          });
      }
    },
    onResetProducts() {
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
      this.totalALlProducts();
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
      // Not allow to delete product if length equal 1
      if (this.products.length !== 1) {
        this.products.splice(index, 1);
        this.totalALlProducts();
      }
    },
    onProductChange(index, pId) {
      const product = this.products[index];
      if (pId) {
        const selectedProduct = this.allProductLists.find(
          (prod) => prod.id === pId
        );
        product.product_name = selectedProduct.name;
        product.unit_price = selectedProduct.price;
      } else {
        product.unit_price = "";
      }
      product.total_price = 0;
      product.width = "";
      product.length = "";
      product.quantity = "";
      this.onProductCalculate(index);
    },
    onProductCalculate(index) {
      const product = this.products[index];
      const isCoverAll = product.coverAll;
      const unit_price = product.unit_price;
      const qty = product.quantity;
      const width = product.width;
      const length = product.length;
      // Set Total Price
      if (this.selectedBusiness === "car") {
        this.products[index].total_price = unit_price;
      } else if (this.selectedBusiness === "printing") {
        if (!isCoverAll) {
          const m2 = (width * length) / 10000;
          this.products[index].total_price = m2 * unit_price * qty;
        } else {
          this.products[index].total_price = unit_price * qty;
        }
      } else if (this.selectedBusiness === "ktv") {
        this.products[index].unit_price = this.ktvPriceM2(
          (width * length) / 10000
        );
        console.log((width * length) / 10000);

        this.products[index].total_price =
          this.products[index].unit_price * qty;
      }
      this.totalALlProducts();
    },
    ktvPriceM2(size) {
      let unit_price = 0;
      if (size <= 0) {
        unit_price = 0;
      } else if (size > 0 && size <= 0.1) {
        unit_price = 0.5;
      } else if (size > 0.1 && size <= 1) {
        unit_price = 1;
      } else if (size > 1 && size <= 1.5) {
        unit_price = 1.5;
      } else if (size > 1.5 && size <= 1.8) {
        unit_price = 2;
      } else if (size > 1.8 && size <= 2) {
        unit_price = 2.5;
      } else if (size > 2 && size <= 3.4) {
        unit_price = 3;
      } else if (size > 3.4 && size <= 3.5) {
        unit_price = 3.5;
      } else if (size > 3.5 && size <= 4) {
        unit_price = 4;
      } else if (size > 4 && size <= 4.4) {
        unit_price = 4.5;
      } else if (size > 4.4 && size <= 5.4) {
        unit_price = 5;
      } else if (size > 5.4 && size <= 5.9) {
        unit_price = 5.5;
      } else if (size > 5.9 && size <= 6) {
        unit_price = 6;
      } else if (size > 6 && size <= 6.5) {
        unit_price = 6.5;
      } else if (size > 6.5 && size <= 7.4) {
        unit_price = 7;
      } else if (size > 7.4 && size <= 7.9) {
        unit_price = 7.5;
      } else if (size > 7.9 && size <= 8.4) {
        unit_price = 8;
      } else if (size > 8.4 && size <= 8.9) {
        unit_price = 8.5;
      } else if (size > 8.9 && size <= 9.4) {
        unit_price = 9;
      } else if (size > 9.4 && size <= 9.9) {
        unit_price = 9.5;
      } else if (size > 9.9 && size <= 10.8) {
        unit_price = 10;
      } else if (size > 10.8 && size <= 10.9) {
        unit_price = 10.5;
      } else if (size > 10.9 && size <= 11.4) {
        unit_price = 11;
      } else if (size > 11.4 && size <= 11.9) {
        unit_price = 11.5;
      } else if (size > 11.9 && size <= 12) {
        unit_price = 12;
      } else if (size > 12 && size <= 12.9) {
        unit_price = 12.5;
      } else if (size > 12.9 && size <= 13.4) {
        unit_price = 13;
      } else if (size > 13.4 && size <= 13.9) {
        unit_price = 13.5;
      } else if (size > 13.9 && size <= 14.4) {
        unit_price = 14;
      } else if (size > 14.4 && size <= 14.9) {
        unit_price = 14.5;
      } else if (size > 14.9 && size <= 15.4) {
        unit_price = 15;
      } else if (size > 15.4 && size <= 15.9) {
        unit_price = 15.5;
      }
      return unit_price;
    },
    totalALlProducts() {
      this.invoice.total = this.products.length
        ? this.products
            .map((item) => Number(item.total_price))
            .reduce((prev, next) => prev + next)
        : 0;
    },
    updateInvoice() {
      const invoice = this.invoice;
      invoice.invoice_number = invoice.invoice_number.replace(/^0+/, "");
      if (this.employees) {
        const employee_data = this.employees.map((empId) => {
          const emp = this.employeesList.find((emp) => emp.id === empId);
          return {
            employee_id: emp.id,
            employee_name: emp.name,
          };
        });
        invoice.employee_data = employee_data;
      }
      invoice.product_data = this.products;
      if (this.invoice) {
        InvoiceService.updateInvoice(this.invoiceId, this.invoice).then(
          () => {
            this.$router.push("/invoices");
          },
          (error) => {
            alert("error to get data", error);
          }
        );
      }
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
  padding: 0.5rem !important;
  vertical-align: unset !important;
  border-top: 1px solid #e9ecef;
}

.table th {
  padding: 0.5rem !important;
}

.table td .form-group {
  margin-bottom: 0;
}
</style>
