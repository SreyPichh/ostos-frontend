<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>
  <div class="container-fluid mt--5 mb-5">
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
              <div class="col-lg-4">
                <base-input
                  label="Name"
                  placeholder="Name"
                  input-classes="form-control-alternative"
                  v-model="employee.name"
                />
              </div>
              <div class="col-lg-4">
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
              <div class="col-lg-2">
                <base-input
                  label="Birth Of Date"
                  v-model="employee.birth"
                  class="form-control"
                  inputType="date"
                >
                </base-input>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-4">
                <base-input
                  label="Password"
                  inputType="password"
                  label-classes="form-control-range"
                  input-classes="form-control-alternative"
                  addon-left-icon="ni ni-lock-circle-open"
                  v-model="employee.password"
                >
                </base-input>
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
      employee: {
        birth: "2021-08-12",
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
