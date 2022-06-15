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
    <div class="row">
      <div class="col-xl-12 order-xl-1">
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
            <div class="col-lg-3">
              <base-input
                label="Name"
                addonLeftIcon="fa fa-user"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                v-model="quote.customer_name"
              />
            </div>
            <div class="col-lg-3">
              <base-input
                label="Email"
                addonLeftIcon="fa fa-envelope"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                v-model="quote.customer_email"
              />
            </div>

            <div class="col-lg-3">
              <base-input
                label="Phone Number 1"
                addonLeftIcon="fa fa-phone"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                v-model="quote.customer_phone_number"
              />
            </div>
            <div class="col-lg-3">
              <base-input
                label="Phone Number 2"
                addonLeftIcon="fa fa-phone"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                v-model="quote.customer_phone_number2"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 form-group">
              <label class="form-control-label">Address</label>
              <textarea
                class="form-control form-control-alternative"
                rows="2"
                v-model="quote.customer_address1"
              ></textarea>
            </div>
          </div>
        </card>
      </div>
    </div>

    <div class="row my-3">
      <div class="col-xl-12">
        <card shadow type="secondary" bodyClasses="pb-0">
          <div class="row">
            <div class="col-lg-2">
              <base-input
                addonLeftText="#INV-"
                label="quote No"
                @keypress="isNumber($event)"
                label-classes="form-control-range"
                input-classes="form-control-alternative px-2"
                v-model="quote.quote_number"
              />
            </div>
            <div class="col-lg-3">
              <div class="form-group">
                <label class="form-control-label">Date</label>
                <v-date-picker
                  class="inline-block h-full"
                  :masks="masks"
                  :model-config="modelConfig"
                  is-required
                  mode="date"
                  color="red"
                  v-model="quote.date"
                >
                  <template v-slot="{ inputValue, inputEvents, togglePopover }">
                    <div class="d-flex items-center">
                      <button
                        class="px-3 border bg-default rounded-left"
                        @click="togglePopover()"
                      >
                        <i class="fa fa-calendar-alt fa-lg text-white"></i>
                      </button>
                      <input
                        :value="inputValue"
                        v-on="inputEvents"
                        class="px-2 border date-control form-control bg-white"
                      />
                    </div>
                  </template>
                </v-date-picker>
              </div>
            </div>
            <div class="col-lg-3">
              <label class="form-control-label">Businesses</label>
              <Multiselect
                v-model="quote.business_id"
                placeholder="Business Type"
                @change="onChangeBusiness"
                :searchable="true"
                :options="businesses"
              />
            </div>
            <div class="col-lg-2">
              <div class="form-group">
                <label class="form-control-label">Status</label>
                <Multiselect
                  v-model="quote.status"
                  :options="['Paid', 'Unpaid', 'Partial Billed']"
                  @change="onChangeStatus($event)"
                />
              </div>
            </div>
            <div class="col-lg-2" v-if="quote.status === 'Partial Billed'">
              <base-input
                addonLeftText="$"
                addonRightText=".00"
                @keypress="isNumber($event)"
                label="Due Amount"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                v-model="quote.due_amount"
              />
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
                  <h3 class="mb-0">Quotes Items</h3>
                </div>
                <div class="col-lg-5">
                  <label class="form-control-label">Employees</label>
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
            </div>
          </template>

          <div class="table-responsive pb-7" v-if="quote.business_id">
            <table class="table">
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
                    <div class="text-center">
                      <input
                        @change="onCoverALlClick(index, $event)"
                        type="checkbox"
                        v-model="product.coverAll"
                      />
                    </div>
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
            <div class="row p-3 align-items-baseline justify-content-between">
              <button
                @click.prevent="addProduct"
                type="button"
                class="btn btn-warning btn-sm ml-2"
              >
                Add Product
              </button>
              <div class="text-left">
                <h4>
                  សរុប/Total :
                  <span class="px-3 py-1"
                    >${{ quote.total }}{{ quote.total >= 1 ? ".00" : "" }}</span
                  >
                </h4>
                <h4>
                  ប្រាក់កក់/Deposite :
                  <span class="px-3 py-1"
                    >${{ quote.due_amount
                    }}{{ quote.total >= 1 ? ".00" : "" }}</span
                  >
                </h4>
                <h4>
                  នៅខ្វះ/Balance :
                  <span
                    class="bg-pink px-3 py-1 text-red"
                    v-if="quote.due_amount - quote.total < 0"
                    >${{ (quote.due_amount - quote.total) * -1
                    }}{{ quote.total >= 1 ? ".00" : "" }}</span
                  >
                </h4>
              </div>
            </div>
          </div>

          <div v-if="!quote.business_id" class="text-center pt-3 pb-5">
            Please select business type
          </div>
        </card>
      </div>
    </div>
    <div class="row justify-content-between mb-3">
      <div class="col-lg-6 form-group">
        <label class="form-control-label">quote Note.</label>
        <textarea
          class="form-control form-control-alternative"
          rows="4"
          v-model="quote.quote_note"
        ></textarea>
      </div>
      <div class="col-lg-1 form-group">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="quote.signature"
            id="signature"
          />
          <label class="form-check-label" for="signature">Signature</label>
        </div>
      </div>
      <div class="col-lg-5 text-right">
        <button
          @click.prevent="createNewQuote(true)"
          type="button"
          class="btn btn-default"
        >
          Create & Print
        </button>
        <button
          @click.prevent="createNewQuote()"
          type="button"
          class="btn btn-default"
        >
          Create
        </button>
      </div>
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
        @click.prevent="onBusinessSelected(quote.business_id)"
        >Change</base-button
      >
    </template>
  </modal>
</template>

<script>
import BusinessService from "../../services/business.service";
import ProductService from "../../services/product.service";
import EmployeeService from "../../services/employee.service";
import QuoteService from "../../services/quote.service";
import Multiselect from "@vueform/multiselect";
import moment from "moment";

export default {
  components: {
    Multiselect,
  },
  name: "new-quote",
  data() {
    return {
      isLoading: true,
      quote: {
        date: moment(new Date()).format("YYYY-MM-DD"),
        total: 0,
      },
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "DD-MM-YYYY",
      },
      selectedBusiness: "",
      employees: [],
      businesses: [],
      employeeOptions: [],
      productList: [],
      allProductLists: [],
      products: [],
      warningAlert: false,
    };
  },
  mounted() {
    this.isLoading = true;
    QuoteService.getLastQuoteId().then((item) => {
      const quoteId = item.data.data.length !== 0 ? item.data.data.id : 0;
      this.quote.quote_number = String(quoteId + 1).padStart(6, "0");
    });
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

    EmployeeService.getEmployees().then((items) => {
      this.isLoading = false;
      this.employeesList = items.data.data;
      this.employeeOptions = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
    });
  },
  methods: {
    // On Change Business Type
    onCancelChangeBusiness() {
      this.warningAlert = false;
      this.quote.business_id = this.previousBid;
    },
    onChangeBusiness(id) {
      this.previousBid = this.quote.business_id;
      if (this.quote.business_id) {
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

        this.onAutoSetStatus(this.selectedBusiness);
        this.onResetProducts();
        this.productList = this.allProductLists
          .filter((product) => product.business_id === id)
          .map((item) => {
            return { label: item.name, value: item.id };
          });
      }
    },
    onAutoSetStatus(business) {
      if (business === "car") {
        this.quote.status = "Paid";
      } else {
        this.quote.status = "Unpaid";
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
      this.quote.due_amount = 0;
      this.totalALlProducts();
    },
    onCoverALlClick(index, isChecked) {
      const product = this.products[index];
      if (isChecked.target.value === "true") {
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
        this.products[index].total_price =
          this.products[index].unit_price * qty;
      }
      this.totalALlProducts();
    },
    ktvPriceM2(size) {
      let unit_price = 0;
      if (size >= 0.01 && size < 0.07) {
        unit_price = 0.5;
      } else if (size >= 0.07 && size < 0.13) {
        unit_price = 1;
      } else if (size >= 0.13 && size < 0.16) {
        unit_price = 1.5;
      } else if (size >= 0.16 && size < 0.2) {
        unit_price = 2;
      } else if (size >= 0.2 && size < 0.26) {
        unit_price = 2.5;
      } else if (size >= 0.26 && size < 0.35) {
        unit_price = 3;
      } else if (size >= 0.35 && size < 0.41) {
        unit_price = 4;
      } else if (size >= 0.41 && size < 0.44) {
        unit_price = 4.5;
      } else if (size >= 0.44 && size < 0.51) {
        unit_price = 5;
      } else if (size >= 0.51 && size < 0.6) {
        unit_price = 5.5;
      } else if (size >= 0.6 && size < 0.63) {
        unit_price = 6;
      } else if (size >= 0.63 && size < 0.7) {
        unit_price = 6.5;
      } else if (size >= 0.7 && size < 0.75) {
        unit_price = 7;
      } else if (size >= 0.75 && size < 0.8) {
        unit_price = 7.5;
      } else if (size >= 0.8 && size < 0.85) {
        unit_price = 8;
      } else if (size >= 0.85 && size < 0.9) {
        unit_price = 8.5;
      } else if (size >= 0.9 && size < 0.95) {
        unit_price = 9;
      } else if (size >= 0.95 && size < 1) {
        unit_price = 9.5;
      } else if (size >= 1 && size < 1.06) {
        unit_price = 10;
      } else if (size >= 1.06 && size < 1.11) {
        unit_price = 10.5;
      } else if ((size >= 1, 11 && size < 1.16)) {
        unit_price = 11;
      } else if (size >= 1.16 && size < 1.21) {
        unit_price = 11.5;
      } else if (size >= 1.21 && size < 1.26) {
        unit_price = 12;
      } else if (size >= 1.26 && size < 1.3) {
        unit_price = 12.5;
      } else if (size >= 1.3 && size < 1.35) {
        unit_price = 13;
      } else if (size >= 1.35 && size < 1.4) {
        unit_price = 13.5;
      } else if (size >= 1.4 && size < 1.45) {
        unit_price = 14;
      } else if (size >= 1.45 && size < 1.5) {
        unit_price = 14.5;
      } else if (size >= 1.5 && size <= 1.55) {
        unit_price = 15;
      }
      return unit_price;
    },
    totalALlProducts() {
      this.quote.total = this.products.length
        ? this.products
            .map((item) => Number(item.total_price))
            .reduce((prev, next) => prev + next)
        : 0;

      if (this.quote.status === "Paid") {
        this.quote.due_amount = this.quote.total;
      }
    },
    onChangeStatus(status) {
      if (status === "Paid") {
        this.quote.due_amount = this.quote.total;
      } else {
        this.quote.due_amount = 0;
      }
    },
    createNewQuote(isPrint) {
      const quote = this.quote;
      quote.quote_number = quote.quote_number.replace(/^0+/, "");
      if (this.employees) {
        const employee_data = this.employees.map((empId) => {
          const emp = this.employeesList.find((emp) => emp.id === empId);
          return {
            employee_id: emp.id,
            employee_name: emp.name,
          };
        });
        quote.employee_data = employee_data;
      }
      quote.product_data = this.products;
      if (this.quote) {
        QuoteService.postQuote(this.quote).then(
          (result) => {
            this.$router.push("/quotes");
            if (isPrint) {
              let resolvedRoute = this.$router.resolve({
                name: "preview-quote",
                params: { quoteId: result.data.id },
              });
              window.open(resolvedRoute.href, "_blank");
            }
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
<style>
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

table thead {
  background-color: #1a4567;
  color: #fff;
}

.date-control {
  border-radius: 0 0.375rem 0.375rem 0 !important;
}
</style>
