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
                    v-model="userProfile.f_name"
                  />
                </div>
                <div class="col-lg-3">
                  <base-input
                    alternative=""
                    label="Last name"
                    placeholder="Last name"
                    input-classes="form-control-alternative"
                    v-model="userProfile.l_name"
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
                <div class="col-md-12 form-group">
                  <label class="form-control-label">Address</label>
                  <textarea
                    class="form-control form-control-alternative"
                    rows="5"
                    v-model="userProfile.first_address"
                  ></textarea>
                </div>
              </div>
            </div>
          </form>
        </card>
      </div>
    </div>
    <div class="float-right my-3">
      <button
        @click.prevent="updateProfile()"
        type="button"
        class="btn btn-default"
      >
        Update
      </button>
    </div>
  </div>
</template>
<script>
import User from "../services/user.service";
import Multiselect from "@vueform/multiselect";

export default {
  components: { Multiselect },
  name: "user-profile",
  data() {
    return {
      userProfile: {},
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
    User.getUserProfile().then((item) => {
      this.userProfile = item.data.data;
      console.log(this.userProfile);
      this.isLoading = false;
    });
  },
  methods: {
    updateProfile() {
      User.updateProfile(this.userProfile.id, this.userProfile).then(
        () => {
          this.$router.push("/profile");
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
  },
};
</script>
<style></style>
