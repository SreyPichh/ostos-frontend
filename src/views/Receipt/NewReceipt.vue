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
                      v-model="receipt.customer_id"
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
                :disabled="disableCustomer"
                v-model="customerInfo.customer_name"
              />
            </div>
            <div class="col-lg-3">
              <base-input
                label="Email"
                addonLeftIcon="fa fa-envelope"
                label-classes="form-control-range"
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
                :disabled="disableCustomer"
                v-model="customerInfo.customer_company"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 form-group">
              <label class="form-control-label">Address</label>
              <textarea
                class="form-control"
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
                label="Receipt No"
                @keypress="isNumber($event)"
                label-classes="form-control-range"
                input-classes="px-2"
                v-model="receipt.receipt_number"
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
                  v-model="receipt.date"
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
                v-model="receipt.business_id"
                :searchable="true"
                :options="businesses"
              />
            </div>
            <div class="col-lg-2">
              <div class="form-group">
                <label class="form-control-label">Status</label>
                <Multiselect
                  v-model="receipt.status"
                  :options="['Paid', 'Unpaid', 'Partial Billed']"
                />
              </div>
            </div>
            <div class="col-lg-2">
              <base-input
                addonLeftText="$"
                @keypress="isNumber($event)"
                label="Amounts"
                label-classes="form-control-range"
                v-model="receipt.amount"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-5 form-group">
              <label class="form-control-label">For Payment Of</label>
              <textarea
                class="form-control"
                rows="2"
                v-model="receipt.paymentOf"
              ></textarea>
            </div>
            <div class="col-lg-3 form-group">
              <label class="form-control-label">Transfer By</label>
              <div class="d-flex mt-2">
                <base-checkbox
                  @input="checkTransferType('cash', $event)"
                  :disabled="isUseCheque || isUseEBanking"
                  :checked="isUseCash"
                  :inline="true"
                >
                  <span class="text-muted ml--4">Cash |</span>
                </base-checkbox>
                <base-checkbox
                  @input="checkTransferType('eBanking', $event)"
                  :disabled="isUseCheque || isUseCash"
                  :checked="isUseEBanking"
                  :inline="true"
                >
                  <span class="text-muted ml--4">E-Banking |</span>
                </base-checkbox>
                <base-checkbox
                  @input="checkTransferType('cheque', $event)"
                  :disabled="isUseCash || isUseEBanking"
                  :checked="isUseCheque"
                >
                  <span class="text-muted ml--4">Cheque</span>
                </base-checkbox>
              </div>
            </div>
            <div class="col-lg-2" v-if="isUseCheque">
              <base-input
                @keypress="isNumber($event)"
                label="No."
                label-classes="form-control-range"
                v-model="receipt.no"
              />
            </div>
          </div>
        </card>
      </div>
    </div>
    <div class="row justify-content-between mb-3">
      <div class="col-lg-6 form-group">
        <label class="form-control-label">Receipt Note.</label>
        <textarea
          class="form-control"
          rows="4"
          v-model="receipt.receipt_note"
        ></textarea>
      </div>
      <div class="col-lg-1 form-group">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="receipt.signature"
            id="signature"
          />
          <label class="form-check-label" for="signature">Signature</label>
        </div>
      </div>
      <div class="col-lg-5 text-right">
        <button
          @click.prevent="prepareNewReceipt(true)"
          :disabled="invalid"
          type="button"
          class="btn btn-default"
        >
          Create & Print
        </button>
        <button
          @click.prevent="prepareNewReceipt()"
          :disabled="invalid"
          type="button"
          class="btn btn-default"
        >
          Create
        </button>
      </div>
    </div>
  </template>
</template>

<script>
import BusinessService from "../../services/business.service";
import CustomerService from "../../services/customer.service";
import ReceiptService from "../../services/receipt.service";
import Multiselect from "@vueform/multiselect";
import moment from "moment";

export default {
  components: {
    Multiselect,
  },
  name: "new-receipt",
  data() {
    return {
      isLoading: true,
      receipt: {
        date: moment(new Date()).format("YYYY-MM-DD"),
      },
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "DD-MM-YYYY",
      },
      businesses: [],
      customerOptions: [],
      customers: [],
      customerInfo: {
        gender: "Male",
      },
      disableCustomer: false,
      isGeneralCustomer: false,
      isUseCash: false,
      isUseCheque: false,
      isUseEBanking: false,
    };
  },
  mounted() {
    this.isLoading = true;
    CustomerService.getCustomers({ limit: 0 }).then((customers) => {
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
    ReceiptService.getLastReceiptId().then((item) => {
      const receiptId = item.data.data.length !== 0 ? item.data.data.id : 0;
      this.receipt.receipt_number = String(receiptId + 1).padStart(6, "0");
    });
    BusinessService.getBusinesses().then((items) => {
      this.isLoading = false;
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
    });
  },
  computed: {
    invalid() {
      const receipt = this.receipt;
      return !receipt || !receipt.business_id || !receipt.receipt_number;
    },
  },
  methods: {
    checkTransferType(type, isChecked) {
      if (type === "cash" && typeof isChecked === "boolean") {
        this.isUseCash = isChecked;
      } else if (type === "eBanking" && typeof isChecked === "boolean") {
        this.isUseEBanking = isChecked;
      } else if (type === "cheque" && typeof isChecked === "boolean") {
        this.isUseCheque = isChecked;
      }
    },
    onChangeCustomer(customerId) {
      if (customerId === "general" && this.isGeneralCustomer) {
        this.disableCustomer = false;
        this.receipt.customer_id = null;
        this.customerInfo = {
          customer_name: "General Customer",
          gender: "Male",
        };
      } else {
        const customer = this.customers.find((item) => item.id === customerId);
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
    prepareNewReceipt(isPrint) {
      const receipt = this.receipt;
      receipt.receipt_number = receipt.receipt_number.replace(/^0+/, "");
      receipt.customer_info = this.customerInfo;
      receipt.type = this.isUseCash
        ? "cash"
        : this.isUseEBanking
        ? "eBanking"
        : "cheque";
      if (receipt.type !== "cheque") {
        receipt.no = "";
      }
      if (receipt.customer_id || this.isGeneralCustomer) {
        this.postReceipt(receipt, isPrint);
      } else {
        this.customerInfo.status = "Active";
        CustomerService.createCustomer(this.customerInfo).then((item) => {
          receipt.customer_id = item.data.id;
          this.postReceipt(receipt, isPrint);
        });
      }
    },
    postReceipt(receipt, isPrint) {
      ReceiptService.postReceipt(receipt).then(
        (result) => {
          this.$router.push("/receipts");
          if (isPrint) {
            let resolvedRoute = this.$router.resolve({
              name: "preview-receipt",
              params: { receiptId: result.data.id },
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
<style scoped>
.table td {
  padding: 0.5rem !important;
  vertical-align: unset;
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

.align-middle {
  vertical-align: middle !important;
}
</style>
