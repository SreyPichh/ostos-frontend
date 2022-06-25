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
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Basic Info</h3>
                </div>
              </div>
            </div>
          </template>

          <div class="row">
            <div class="col-lg-6">
              <base-input
                alternative=""
                placeholder="Name"
                input-classes="form-control-alternative"
                v-model="business.name"
              />
            </div>
            <div class="col-lg-6">
              <base-input
                placeholder="Logo"
                input-classes="form-control-alternative"
                v-model="business.logo"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <base-input
                alternative=""
                placeholder="Address"
                input-classes="form-control-alternative"
                v-model="business.address"
              />
            </div>
          </div>
        </card>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-xl-6 order-xl-2">
        <card height="100%" shadow type="secondary" bodyClasses="pb-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Business Contact</h3>
                </div>
              </div>
            </div>
          </template>

          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="Phone Number 1"
                    addonLeftIcon="fa fa-phone"
                    input-classes="form-control-alternative"
                    v-model="business.phone_number1"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="Phone Number 2"
                    addonLeftIcon="fa fa-phone"
                    input-classes="form-control-alternative"
                    v-model="business.phone_number2"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="Phone Number 3"
                    addonLeftIcon="fa fa-phone"
                    input-classes="form-control-alternative"
                    v-model="business.phone_number3"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="Telegram"
                    addonLeftIcon="fa fa-paper-plane"
                    input-classes="form-control-alternative"
                    v-model="business.telegram"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="Email"
                    addonLeftIcon="fa fa-envelope"
                    input-classes="form-control-alternative"
                    v-model="business.email"
                  />
                </div>
              </div>
            </div>
          </div>
        </card>
      </div>

      <div class="col-xl-6 pl-0 order-xl-3">
        <card
          height="100%"
          shadow
          type="secondary"
          class="mb-3"
          bodyClasses="pb-0"
        >
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Payment Info</h3>
                </div>
              </div>
            </div>
          </template>

          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="ABA Name"
                    input-classes="form-control-alternative"
                    v-model="business.aba_name"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="ABA Number"
                    input-classes="form-control-alternative"
                    v-model="business.acc_number"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="ABA QR"
                    input-classes="form-control-alternative"
                    v-model="business.qr_code"
                  />
                </div>
              </div>
            </div>
          </div>
        </card>

        <card height="100%" shadow type="secondary" bodyClasses="pb-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Socials</h3>
                </div>
              </div>
            </div>
          </template>
          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="Facebook page"
                    input-classes="form-control-alternative"
                    v-model="business.facebook_link"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-lg-12">
                  <base-input
                    placeholder="Instagram page"
                    input-classes="form-control-alternative"
                    v-model="business.instagram_link"
                  />
                </div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary" bodyClasses="pb-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Invoice Content</h3>
                </div>
              </div>
            </div>
          </template>

          <div class="row">
            <div class="col-lg-12 form-group">
              <label class="form-control-label">Invoice top text</label>
              <textarea
                class="form-control form-control-alternative"
                rows="5"
                v-model="business.invoice_toptext"
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-6 form-group">
              <label class="form-control-label"
                >Invoice note text (Khmer)</label
              >
              <textarea
                class="form-control form-control-alternative"
                rows="2"
                v-model="invoice_note_kh"
              ></textarea>
            </div>
            <div class="col-lg-6 form-group">
              <label class="form-control-label"
                >Invoice note text (English)</label
              >
              <textarea
                class="form-control form-control-alternative"
                rows="2"
                v-model="invoice_note_en"
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <base-input
                alternative=""
                placeholder="Invoice signature"
                input-classes="form-control-alternative"
                v-model="business.digital_sign"
              />
            </div>
          </div>
        </card>
      </div>
    </div>
    <div class="float-right mb-3">
      <button
        @click.prevent="updateBusiness"
        type="button"
        class="btn btn-default"
      >
        Update
      </button>
    </div>
  </template>
</template>

<script>
import BusinessService from "../../services/business.service";
export default {
  components: {},
  name: "edit-business",
  data() {
    return {
      business: {},
      isLoading: true,
    };
  },
  mounted() {
    this.isLoading = true;
    this.businessId = this.$route.params.Bid;
    BusinessService.getBusinessById(this.businessId).then((item) => {
      this.business = item.data.data;
      if (this.business.invoice_note) {
        this.invoice_note_kh = this.business.invoice_note.split("\n")[0];
        this.invoice_note_en = this.business.invoice_note.split("\n")[1];
      }
      this.isLoading = false;
    });
  },
  methods: {
    updateBusiness() {
      this.business.invoice_note = `${this.invoice_note_kh}\n${this.invoice_note_en}`;
      BusinessService.updateBusiness(this.businessId, this.business).then(
        () => {
          this.$router.push("/businesses");
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
