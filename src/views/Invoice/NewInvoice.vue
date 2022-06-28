<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <template v-if="!isLoading">
    <div class="row mb-3">
      <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary" bodyClasses="pb-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center justify-content-between">
                <h3 class="mb-0">Customer Information</h3>
                <div class="col-lg-9 d-flex align-items-end">
                  <div class="col d-flex align-items-end">
                    <label class="col-3 form-control-label"
                      >Exist Customer</label
                    >
                    <Multiselect
                      v-model="invoice.customer_id"
                      :disabled="isGeneralCustomer"
                      :class="'col-11'"
                      @change="onChangeCustomer"
                      :searchable="true"
                      :options="customerOptions"
                    />
                  </div>
                  <div class="col-4 d-flex px-0 justify-content-end">
                    <label class="text-green mr-2">General Customer</label>
                    <base-switch
                      v-model="isGeneralCustomer"
                      @change="onChangeCustomer('general')"
                    ></base-switch>
                  </div>
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
                :disabled="disableCustomer"
                v-model="customerInfo.customer_name"
              />
            </div>
            <div class="col-lg-3">
              <base-input
                label="Email"
                addonLeftIcon="fa fa-envelope"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                :disabled="disableCustomer"
                v-model="customerInfo.customer_email"
              />
            </div>
            <div class="col-lg-2">
              <label class="form-control-label">Gender</label>
              <Multiselect
                :disabled="disableCustomer"
                v-model="customerInfo.gender"
                :options="['Male', 'Female', 'Other']"
              />
            </div>
            <div class="col-lg-3">
              <base-input
                label="Phone Number"
                addonLeftIcon="fa fa-phone"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                :disabled="disableCustomer"
                v-model="customerInfo.customer_phone_number"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3">
              <base-input
                label="Customer Company"
                addonLeftIcon="fa fa-building"
                label-classes="form-control-range"
                input-classes="form-control-alternative"
                :disabled="disableCustomer"
                v-model="customerInfo.customer_company"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 form-group">
              <label class="form-control-label">Address</label>
              <textarea
                class="form-control form-control-alternative"
                rows="2"
                :disabled="disableCustomer"
                v-model="customerInfo.customer_address1"
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
                label="Invoice No"
                @keypress="isNumber($event)"
                label-classes="form-control-range"
                input-classes="form-control-alternative px-2"
                v-model="invoice.invoice_number"
              />
            </div>
            <div class="col-lg-2">
              <base-input
                label="PO"
                label-classes="form-control-range"
                input-classes="form-control-alternative px-2"
                v-model="invoice.po"
              />
            </div>
            <div class="col-lg-2">
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
                v-model="invoice.business_id"
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
                  v-model="invoice.status"
                  :options="['Paid', 'Unpaid', 'Partial Billed']"
                  @change="onChangeStatus($event)"
                />
              </div>
            </div>
            <div class="col-lg-2" v-if="invoice.status === 'Partial Billed'">
              <base-input
                addonLeftText="$"
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

    <div class="row my-3">
      <div class="col-xl-12 order-xl-2">
        <card shadow type="secondary" bodyClasses="p-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center justify-content-between">
                <div class="col">
                  <h3 class="mb-0">Invoices Items</h3>
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

          <div class="table-responsive pb-7" v-if="invoice.business_id">
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
                  <th>width (CM)</th>
                  <th>length (CM)</th>
                  <th v-if="selectedBusiness == 'printing'">M&sup2;</th>
                  <th>quantity</th>
                </template>
                <th>Unit Price ($)</th>
                <th>Total</th>
                <th></th>
              </thead>

              <tbody v-for="(product, index) in products" :key="index">
                <td>
                  <Multiselect
                    v-model="product.product_id"
                    :searchable="true"
                    :create-option="true"
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
                      :disabled="product.coverAll"
                      @keypress="isNumber($event)"
                      @change="onProductCalculate(index)"
                      input-classes="form-control-alternative"
                      v-model="product.width"
                    />
                  </td>
                  <td>
                    <base-input
                      :disabled="product.coverAll"
                      @keypress="isNumber($event)"
                      @change="onProductCalculate(index)"
                      input-classes="form-control-alternative"
                      v-model="product.length"
                    />
                  </td>
                  <td v-if="selectedBusiness == 'printing'">
                    <span>
                      =
                      {{
                        ((product.width * product.length) / 10000).toFixed(2)
                      }}</span
                    >
                    m&sup2;
                  </td>
                  <td>
                    <base-input
                      @keypress="isNumber($event)"
                      @change="onProductCalculate(index, 'quantity')"
                      :name="`products[${index}][quantity]`"
                      input-classes="form-control-alternative"
                      v-model="product.quantity"
                    />
                  </td>
                </template>
                <td>
                  <base-input
                    @keypress="isNumber($event)"
                    @change="onProductCalculate(index, 'unitPrice')"
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
                :disabled="products.length === 13"
                type="button"
                class="btn btn-warning btn-sm ml-2"
              >
                Add Product
              </button>
              <div class="text-left">
                <h4>
                  សរុប/Total :
                  <span class="px-3 py-1">${{ invoice.total }}</span>
                </h4>
                <h4>
                  ប្រាក់កក់/Deposite :
                  <span class="px-3 py-1">${{ invoice.due_amount }}</span>
                </h4>
                <h4>
                  នៅខ្វះ/Balance :
                  <span
                    class="bg-pink px-3 py-1 text-red"
                    v-if="invoice.due_amount - invoice.total < 0"
                    >${{ (invoice.due_amount - invoice.total) * -1 }}</span
                  >
                </h4>
              </div>
            </div>
          </div>

          <div v-if="!invoice.business_id" class="text-center pt-3 pb-5">
            Please select business type
          </div>
        </card>
      </div>
    </div>
    <div class="row justify-content-between mb-3">
      <div class="col-lg-6 form-group">
        <label class="form-control-label">Invoice Note.</label>
        <textarea
          class="form-control form-control-alternative"
          rows="4"
          v-model="invoice.invoice_note"
        ></textarea>
      </div>
      <div class="col-lg-1 form-group">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="invoice.signature"
            id="signature"
          />
          <label class="form-check-label" for="signature">Signature</label>
        </div>
      </div>
      <div class="col-lg-5 text-right">
        <button
          @click.prevent="prepareNewInvoice(true)"
          :disabled="invalid"
          type="button"
          class="btn btn-default"
        >
          Create & Print
        </button>
        <button
          @click.prevent="prepareNewInvoice()"
          :disabled="invalid"
          type="button"
          class="btn btn-default"
        >
          Create
        </button>
      </div>
    </div>
  </template>

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
import EmployeeService from "../../services/employee.service";
import CustomerService from "../../services/customer.service";
import InvoiceService from "../../services/invoice.service";
import Multiselect from "@vueform/multiselect";
import moment from "moment";

export default {
  components: {
    Multiselect,
  },
  name: "new-invoice",
  data() {
    return {
      isLoading: true,
      invoice: {
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
      customerOptions: [],
      customers: [],
      customerInfo: {
        gender: "Male",
      },
      employeeOptions: [],
      productList: [],
      allProductLists: [],
      products: [],
      warningAlert: false,
      disableCustomer: false,
      isGeneralCustomer: false,
    };
  },
  mounted() {
    this.isLoading = true;
    CustomerService.getCustomers().then((customers) => {
      this.customers = customers.data.data;
      this.customerOptions = customers.data.data.map((item) => {
        const name = item.customer_name;
        const phoneNumber = item.customer_phone_number;
        const company = item.customer_company;
        return {
          label: `${name ? name : ""} ${
            phoneNumber || company
              ? `${phoneNumber ? `[Tel: ${phoneNumber}]` : ""}${
                  company ? ` [Company: ${company}]` : ""
                }`
              : ""
          }`,
          value: item.id,
        };
      });
    });
    InvoiceService.getLastInvoiceId().then((item) => {
      const invoiceId = item.data.data.length !== 0 ? item.data.data.id : 0;
      this.invoice.invoice_number = String(invoiceId + 1).padStart(6, "0");
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
  computed: {
    invalid() {
      const invoice = this.invoice;
      return (
        this.products.length === 0 ||
        !invoice ||
        !invoice.status ||
        !invoice.business_id ||
        !invoice.invoice_number ||
        !this.customerInfo.customer_name
      );
    },
  },
  methods: {
    onChangeCustomer(customerId) {
      if (customerId === "general" && this.isGeneralCustomer) {
        this.disableCustomer = false;
        this.invoice.customer_id = null;
        this.customerInfo = {
          customer_name: "General Customer",
          gender: "Male",
        };
      } else {
        const customer = this.customers.find((item) => item.id === customerId);
        console.log(customer);
        if (customer) {
          this.disableCustomer = true;
          this.customerInfo = {
            customer_name: customer.customer_name,
            customer_email: customer.customer_email,
            gender: customer.gender,
            customer_phone_number: customer.customer_phone_number,
            customer_company: customer.customer_company,
            customer_address1: customer.customer_address1,
          };
        } else {
          this.disableCustomer = false;
          this.customerInfo = {
            gender: "Male",
          };
        }
      }
    },
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
        this.invoice.status = "Paid";
      } else {
        this.invoice.status = "Unpaid";
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
      this.invoice.due_amount = 0;
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
      this.onProductCalculate(index);
    },
    onProductCalculate(index, target) {
      const product = this.products[index];
      const isCoverAll = product.coverAll;
      const unit_price = product.unit_price;
      const qty = product.quantity;
      const width = product.width;
      const length = product.length;
      // Set Total Price
      if (this.selectedBusiness === "car") {
        product.total_price = unit_price;
      } else if (this.selectedBusiness === "printing") {
        if (!isCoverAll) {
          const m2 = (width * length) / 10000;
          product.total_price = (m2 * unit_price * qty).toFixed(2);
        } else {
          product.total_price = (unit_price * qty).toFixed(2);
        }
      } else if (this.selectedBusiness === "ktv") {
        if (target !== "unitPrice" && target !== "quantity") {
          product.unit_price = this.ktvPriceM2((width * length) / 10000);
        }
        product.total_price = product.unit_price * qty;
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
      } else if (size >= 1.11 && size < 1.16) {
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
      this.invoice.total = this.products.length
        ? this.products
            .map((item) => Number(item.total_price))
            .reduce((prev, next) => prev + next)
        : 0;

      if (this.invoice.status === "Paid") {
        this.invoice.due_amount = this.invoice.total;
      }
    },
    onChangeStatus(status) {
      if (status === "Paid") {
        this.invoice.due_amount = this.invoice.total;
      } else {
        this.invoice.due_amount = 0;
      }
    },
    prepareNewInvoice(isPrint) {
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
      invoice.customer_info = this.customerInfo;
      if (invoice.customer_id || this.isGeneralCustomer) {
        this.postInvoice(invoice, isPrint);
      } else {
        CustomerService.createCustomer(this.customerInfo).then((item) => {
          invoice.customer_id = item.data.id;
          this.postInvoice(invoice, isPrint);
        });
      }
    },
    postInvoice(invoice, isPrint) {
      InvoiceService.postInvoice(invoice).then(
        (result) => {
          this.$router.push("/invoices");
          if (isPrint) {
            let resolvedRoute = this.$router.resolve({
              name: "preview-invoice",
              params: { invoiceId: result.data.id },
            });
            window.open(resolvedRoute.href, "_blank");
          }
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
