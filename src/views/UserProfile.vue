<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>

  <div class="container-fluid mt--5">
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
                <div class="col-lg-6">
                  <base-input
                    alternative=""
                    label="Username"
                    placeholder="Username"
                    input-classes="form-control-alternative"
                    v-model="userProfile.name"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    alternative=""
                    label="Email address"
                    placeholder="jesse@example.com"
                    input-classes="form-control-alternative"
                    v-model="userProfile.email"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-6">
                  <base-input
                    alternative=""
                    label="First name"
                    placeholder="First name"
                    input-classes="form-control-alternative"
                    v-model="userProfile.firstName"
                  />
                </div>
                <div class="col-lg-6">
                  <base-input
                    alternative=""
                    label="Last name"
                    placeholder="Last name"
                    input-classes="form-control-alternative"
                    v-model="userProfile.lastName"
                  />
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
export default {
  name: "user-profile",
  data() {
    return {
      userProfile: {},
      isLoading: true,
    };
  },
  mounted() {
    this.isLoading = true;
    this.userId = this.$route.params.UserId;
    userProfile.getUserProfile().then((item) => {
      this.userProfile = item.data.data;
      this.isLoading = false;
    });
  },
};
</script>
<style></style>
