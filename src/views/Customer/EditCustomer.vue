<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>

  <div class="row mb-3" v-if="!isLoading">
    <div class="col-xl-12 pl-0 order-xl-1">
      <card shadow type="secondary" bodyClasses="pb-0">
        <template v-slot:header>
          <div class="bg-white border-0">
            <div class="row justify-content-between">
              <div class="col">
                <h3 class="mb-0">Customer Info</h3>
              </div>
            </div>
          </div>
        </template>
        <form>
          <div class="row">
            <div class="col-lg-3">
              <base-input
                label="Name"
                addonLeftIcon="fa fa-user"
                input-classes="form-control-alternative"
                label-classes="form-control-range"
                v-model="customer.customer_name"
              />
            </div>
            <div class="col-lg-3">
              <base-input
                label="Email"
                addonLeftIcon="fa fa-envelope"
                input-classes="form-control-alternative"
                label-classes="form-control-range"
                v-model="customer.customer_email"
              />
            </div>
            <div class="col-lg-2">
              <label class="form-control-label">Gender</label>
              <Multiselect
                v-model="customer.gender"
                :options="['Male', 'Female', 'Other']"
              />
            </div>
            <div class="col-lg-3">
              <base-input
                label="Phone Number"
                addonLeftIcon="fa fa-phone"
                input-classes="form-control-alternative"
                label-classes="form-control-range"
                v-model="customer.customer_phone_number"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3">
              <base-input
                label="Customer Company"
                addonLeftIcon="fa fa-building"
                input-classes="form-control-alternative"
                label-classes="form-control-range"
                v-model="customer.customer_company"
              />
            </div>
            <div class="col-lg-3">
              <base-input label="PO" v-model="customer.po" />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 form-group">
              <label class="form-control-label">Address</label>
              <textarea
                class="form-control form-control-alternative"
                rows="5"
                v-model="customer.customer_address1"
              ></textarea>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
  <div class="float-right">
    <button
      @click.prevent="updateCustomer()"
      type="button"
      class="btn btn-default"
    >
      Update
    </button>
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import CustomerService from "../../services/customer.service";

export default {
  components: { Multiselect },
  name: "edit-customer",
  mounted() {
    this.isLoading = true;
    this.customerId = this.$route.params.customerId;
    CustomerService.getCustomerById(this.customerId).then((item) => {
      this.customer = item.data.data;
      this.isLoading = false;
    });
  },
  data() {
    return {
      isLoading: true,
      customer: {},
    };
  },
  methods: {
    updateCustomer() {
      CustomerService.updateCustomer(this.customerId, this.customer).then(
        () => {
          this.$router.push("/customers");
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
