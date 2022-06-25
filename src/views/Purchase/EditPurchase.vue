<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <div class="row mb-3" v-if="!isLoading">
    <div class="col-xl-12 order-xl-1">
      <card shadow type="secondary" bodyClasses="pb-0">
        <template v-slot:header>
          <div class="bg-white border-0">
            <div class="row align-items-center">
              <div class="col-7">
                <h3 class="mb-0">Supplier Information</h3>
              </div>
            </div>
          </div>
        </template>

        <div class="row">
          <div class="col-lg-3">
            <base-input
              label="Supplier"
              addonLeftIcon="fa fa-user"
              label-classes="form-control-range"
              input-classes="form-control-alternative"
              v-model="purchase.supplier"
            />
          </div>
          <div class="col-lg-3">
            <base-input
              label="Phone Number"
              addonLeftIcon="fa fa-phone"
              label-classes="form-control-range"
              input-classes="form-control-alternative"
              v-model="purchase.phone_number"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12 form-group">
            <label class="form-control-label">Address</label>
            <textarea
              class="form-control form-control-alternative"
              rows="2"
              v-model="purchase.address"
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
              addonLeftText="#SINV-"
              label="Supplier Invoice No"
              @keypress="isNumber($event)"
              label-classes="form-control-range"
              input-classes="form-control-alternative px-2"
              v-model="purchase.supplier_invoice_number"
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
                v-model="purchase.date"
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
          <div class="col-lg-2">
            <div class="form-group">
              <label class="form-control-label">Status</label>
              <Multiselect
                v-model="purchase.status"
                :options="['Paid', 'Unpaid', 'Partial Billed']"
                @change="onChangeStatus($event)"
              />
            </div>
          </div>
          <div class="col-lg-2" v-if="purchase.status === 'Partial Billed'">
            <base-input
              addonLeftText="$"
              @keypress="isNumber($event)"
              label="Due Amount"
              label-classes="form-control-range"
              input-classes="form-control-alternative"
              v-model="purchase.due_amount"
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
                <h3 class="mb-0">Purchase Items</h3>
              </div>
            </div>
          </div>
        </template>

        <div class="table-responsive pb-7">
          <table class="table">
            <thead>
              <th class="col-sm-8">Product Name</th>
              <th>Price</th>
              <th></th>
            </thead>

            <tbody v-for="(product, index) in products" :key="index">
              <td>
                <base-input
                  label-classes="form-control-range"
                  input-classes="form-control-alternative"
                  v-model="product.item"
                />
              </td>
              <td>
                <base-input
                  addonLeftText="$"
                  @keypress="isNumber($event)"
                  @change="totalALlProducts()"
                  placeholder="Price"
                  input-classes="form-control-alternative"
                  v-model="product.price"
                />
              </td>
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
                  >${{ purchase.total
                  }}{{ purchase.total >= 1 ? ".00" : "" }}</span
                >
              </h4>
              <h4>
                ប្រាក់កក់/Deposite :
                <span class="px-3 py-1"
                  >${{ purchase.due_amount
                  }}{{ purchase.total >= 1 ? ".00" : "" }}</span
                >
              </h4>
              <h4>
                នៅខ្វះ/Balance :
                <span
                  class="bg-pink px-3 py-1 text-red"
                  v-if="purchase.due_amount - purchase.total < 0"
                  >${{ (purchase.due_amount - purchase.total) * -1
                  }}{{ purchase.total >= 1 ? ".00" : "" }}</span
                >
              </h4>
            </div>
          </div>
        </div>
      </card>
    </div>
  </div>
  <div class="row justify-content-between mb-3">
    <div class="col-lg-6 form-group">
      <label class="form-control-label">Purchase Note.</label>
      <textarea
        class="form-control form-control-alternative"
        rows="4"
        v-model="purchase.note"
      ></textarea>
    </div>
    <div class="col-lg-5 text-right">
      <button
        @click.prevent="updatePurchase()"
        :disabled="invalid"
        type="button"
        class="btn btn-default"
      >
        Update
      </button>
    </div>
  </div>
</template>

<script>
import PurchaseService from "../../services/purchase.service";
import Multiselect from "@vueform/multiselect";

export default {
  components: {
    Multiselect,
  },
  name: "edit-purchase",
  data() {
    return {
      isLoading: true,
      purchase: {},
      products: [],
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "DD-MM-YYYY",
      },
    };
  },
  mounted() {
    this.isLoading = true;
    this.purchaseId = this.$route.params.purchaseId;
    PurchaseService.getPurchaseById(this.purchaseId).then((item) => {
      const purchase = item.data.data;
      purchase.supplier_invoice_number = String(
        purchase.supplier_invoice_number
      ).padStart(6, "0");
      this.products = purchase.supplier_product_data;
      this.purchase = purchase;
      this.isLoading = false;
    });
  },
  invalid() {
    return (
      this.products.length === 0 ||
      !this.purchase.status ||
      !this.purchase.supplier_invoice_number
    );
  },
  methods: {
    // Products
    addProduct() {
      this.products.push({
        item: "",
        price: "",
      });
    },
    remove(index) {
      // Not allow to delete product if length equal 1
      if (this.products.length !== 1) {
        this.products.splice(index, 1);
        this.totalALlProducts();
      }
    },
    totalALlProducts() {
      this.purchase.total = this.products.length
        ? this.products
            .map((item) => Number(item.price))
            .reduce((prev, next) => prev + next)
        : 0;

      if (this.purchase.status === "Paid") {
        this.purchase.due_amount = this.purchase.total;
      }
    },
    onChangeStatus(status) {
      if (status === "Paid") {
        this.purchase.due_amount = this.purchase.total;
      } else {
        this.purchase.due_amount = 0;
      }
    },
    updatePurchase() {
      const purchase = this.purchase;
      purchase.supplier_invoice_number = purchase.supplier_invoice_number.replace(
        /^0+/,
        ""
      );
      purchase.supplier_product_data = this.products;
      if (this.purchase) {
        PurchaseService.updatePurchase(this.purchaseId, this.purchase).then(
          () => {
            this.$router.push("/purchases");
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
