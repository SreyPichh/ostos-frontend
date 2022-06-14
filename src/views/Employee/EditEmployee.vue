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

  <div v-if="!isLoading" class="container-fluid mt--5 mb-5">
    <div class="row mb-3">
      <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary" bodyClasses="pb-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row justify-content-between">
                <div class="col">
                  <h3 class="mb-0">Employee Info</h3>
                </div>
              </div>
            </div>
          </template>

          <form>
            <div class="row">
              <div class="col-lg-2">
                <base-input
                  label="First Name"
                  placeholder="Men"
                  input-classes="form-control-alternative"
                  v-model="employee.f_name"
                />
              </div>
              <div class="col-lg-2">
                <base-input
                  label="Last Name"
                  placeholder="Ratana"
                  input-classes="form-control-alternative"
                  v-model="employee.l_name"
                />
              </div>
              <div class="col-lg-3">
                <base-input
                  label="UserName"
                  placeholder="Ratana24"
                  input-classes="form-control-alternative"
                  v-model="employee.name"
                />
              </div>
              <div class="col-lg-3">
                <base-input
                  label="Email"
                  addonLeftIcon="fa fa-envelope"
                  placeholder="jesse@example.com"
                  input-classes="form-control-alternative"
                  label-classes="form-control-range"
                  v-model="employee.email"
                />
              </div>
              <div class="col-lg-2">
                <label class="form-control-label">Gender</label>
                <Multiselect
                  v-model="employee.gender"
                  :options="['Male', 'Female']"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-3">
                <div class="form-group">
                  <label class="form-control-label">Birth Of Date</label>
                  <v-date-picker
                    class="inline-block h-full"
                    :masks="masks"
                    :model-config="modelConfig"
                    is-required
                    mode="date"
                    color="red"
                    v-model="employee.birth"
                  >
                    <template v-slot="{ inputValue, togglePopover }">
                      <div class="d-flex items-center">
                        <button
                          class="px-3 border bg-default rounded-left"
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
              <div class="col-lg-3">
                <base-input
                  label="Phone Number"
                  addonLeftIcon="fa fa-phone"
                  input-classes="form-control-alternative"
                  label-classes="form-control-range"
                  v-model="employee.phone"
                />
              </div>
              <div class="col-lg-3">
                <base-input
                  label="Notional ID"
                  addonLeftIcon="fa fa-address-card"
                  input-classes="form-control-alternative"
                  label-classes="form-control-range"
                  v-model="employee.phone"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 form-group">
                <label class="form-control-label">Address</label>
                <textarea
                  class="form-control form-control-alternative"
                  rows="5"
                  v-model="employee.first_address"
                ></textarea>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 form-group">
                <a href="#">Request Change Password</a>
              </div>
            </div>
          </form>
        </card>
      </div>
    </div>
    <div class="float-right">
      <button
        @click.prevent="updateEmployee()"
        type="button"
        class="btn btn-default"
      >
        Update
      </button>
    </div>
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import UserService from "../../services/user.service";
// import moment from "moment";

export default {
  components: { Multiselect },
  name: "edit-employee",
  mounted() {
    this.isLoading = true;
    this.userId = this.$route.params.UserId;
    UserService.getUserById(this.userId).then((item) => {
      this.employee = item.data.data;
      this.isLoading = false;
    });
  },
  data() {
    return {
      isLoading: true,
      employee: {},
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "WWWW, DD-MM-YYYY",
      },
    };
  },
  methods: {
    updateEmployee() {
      UserService.updateUser(this.userId, this.employee).then(
        () => {
          this.$router.push("/employees");
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
