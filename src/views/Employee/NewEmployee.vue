<template>
  <div class="row mb-3">
    <div class="col-xl-12 pl-0 order-xl-1">
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
            <div class="col-lg-3">
              <base-input
                label="UserName"
                addonLeftIcon="fa fa-user"
                input-classes="form-control-alternative"
                label-classes="form-control-range"
                v-model="employee.name"
              />
            </div>
            <div class="col-lg-2">
              <label class="form-control-label">Gender</label>
              <Multiselect
                v-model="employee.gender"
                :options="['Male', 'Female', 'Other']"
              />
            </div>
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
                        class="px-2 border date-control form-search-control form-control bg-white"
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
                v-model="employee.phone_number"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3">
              <base-input
                label="Notional ID"
                addonLeftIcon="fa fa-address-card"
                input-classes="form-control-alternative"
                label-classes="form-control-range"
                v-model="employee.national_id"
              />
            </div>
            <div class="col-lg-3">
              <base-input
                label="Profile"
                disabled="true"
                placeholder="will fix soon..."
                input-classes="form-control-alternative"
                label-classes="form-control-range"
                v-model="employee.profile_img"
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
        </form>
      </card>
    </div>
  </div>
  <div class="float-right">
    <button
      @click.prevent="createEmployee()"
      type="button"
      class="btn btn-default"
    >
      Create
    </button>
  </div>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import EmployeeService from "../../services/employee.service";
import moment from "moment";

export default {
  components: { Multiselect },
  name: "new-employee",
  data() {
    return {
      employee: {
        gender: "Male",
        birth: moment(new Date()).format("YYYY-MM-DD"),
      },
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "WWWW, DD-MM-YYYY",
      },
    };
  },
  mounted() {},
  methods: {
    createEmployee() {
      EmployeeService.createEmployee(this.employee).then(
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
