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
  <div class="container-fluid mt--5" v-if="!isLoading">
    <div class="row">
      <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary" bodyClasses="pb-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-8">
                  <h3 class="mb-0">My account</h3>
                </div>
              </div>
            </div>
          </template>

          <form>
            <h6 class="heading-small text-muted mb-4">User information</h6>
            <div class="pl-lg-4">
              <div class="row">
                <div class="col-lg-3">
                  <base-input
                    alternative=""
                    label="First name"
                    placeholder="First name"
                    input-classes="form-control-alternative"
                    v-model="userProfile.firstName"
                  />
                </div>
                <div class="col-lg-3">
                  <base-input
                    alternative=""
                    label="Last name"
                    placeholder="Last name"
                    input-classes="form-control-alternative"
                    v-model="userProfile.lastName"
                  />
                </div>
                <div class="col-lg-3">
                  <base-input
                    label="Username"
                    addonLeftIcon="fa fa-user"
                    label-classes="form-control-range"
                    input-classes="form-control-alternative"
                    v-model="userProfile.name"
                  />
                </div>
                <div class="col-lg-3">
                  <base-input
                    alternative=""
                    label="Email address"
                    addonLeftIcon="fa fa-envelope"
                    label-classes="form-control-range"
                    input-classes="form-control-alternative"
                    v-model="userProfile.email"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-3">
                  <label class="form-control-label">Gender</label>
                  <Multiselect
                    v-model="userProfile.gender"
                    :options="['Male', 'Female']"
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
                      v-model="userProfile.birth"
                    >
                      <template
                        v-slot="{ inputValue, inputEvents, togglePopover }"
                      >
                        <div class="d-flex items-center">
                          <button
                            class="px-2 border bg-default rounded-left"
                            @click="togglePopover()"
                          >
                            <i class="fa fa-calendar-alt fa-lg text-white"></i>
                          </button>
                          <input
                            :value="inputValue"
                            v-on="inputEvents"
                            class="px-2 border date-control form-search-control form-control bg-white"
                            readonly
                          />
                        </div>
                      </template>
                    </v-date-picker>
                  </div>
                </div>
              </div>
            </div>
            <hr class="my-4" />
            <!-- Address -->
            <h6 class="heading-small text-muted mb-4">Contact information</h6>
            <div class="pl-lg-4">
              <div class="row">
                <div class="col-md-12">
                  <base-input
                    alternative=""
                    label="Address"
                    placeholder="Home Address"
                    input-classes="form-control-alternative"
                    v-model="userProfile.address"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-4">
                  <base-input
                    alternative=""
                    label="City"
                    placeholder="City"
                    input-classes="form-control-alternative"
                    v-model="userProfile.city"
                  />
                </div>
                <div class="col-lg-4">
                  <base-input
                    alternative=""
                    label="Country"
                    placeholder="Country"
                    input-classes="form-control-alternative"
                    v-model="userProfile.country"
                  />
                </div>
                <div class="col-lg-4">
                  <base-input
                    alternative=""
                    label="Postal code"
                    placeholder="Postal code"
                    input-classes="form-control-alternative"
                    v-model="userProfile.zipCode"
                  />
                </div>
              </div>
            </div>
            <hr class="my-4" />
            <!-- Description -->
            <h6 class="heading-small text-muted mb-4">About me</h6>
            <div class="pl-lg-4">
              <div class="form-group">
                <base-input alternative="" label="About Me">
                  <textarea
                    rows="4"
                    class="form-control form-control-alternative"
                    placeholder="A few words about you ..."
                  ></textarea>
                </base-input>
              </div>
            </div>
          </form>
        </card>
      </div>
    </div>
    <div class="float-right my-3">
      <button
        @click.prevent="createEmployee()"
        type="button"
        class="btn btn-default"
      >
        Update
      </button>
    </div>
  </div>
</template>
<script>
import userProfile from "../services/userProfile.service";
import Multiselect from "@vueform/multiselect";
import moment from "moment";

export default {
  components: { Multiselect },
  name: "user-profile",
  data() {
    return {
      userProfile: {
        gender: "Male",
        birth: moment(new Date()).format("YYYY-MM-DD"),
      },
      isLoading: true,
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "WWWW, DD-MM-YYYY",
      },
    };
  },
  mounted() {
    this.isLoading = true;
    userProfile.getUserProfile().then((item) => {
      this.userProfile = item.data.data;
      this.isLoading = false;
    });
  },
};
</script>
<style></style>
