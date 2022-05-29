<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>
  <div class="container-fluid mt--5">
    <div class="row mb-3">
      <div class="col-xl-12 pl-0 order-xl-1">
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
              <!-- <base-input
                placeholder="Logo"
                input-classes="form-control-alternative"
                v-model="business.logo"
              /> -->
              <label class="uploadImg">
                <input
                  type="file"
                  @change="onFileSelected($event, 'logo')"
                  accept="image/*"
                  class="upload-logo"
                />
                Choose Image
              </label>
              <img :src="logoUrl" height="100" />
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
      <div class="col-xl-6 pl-0 order-xl-2">
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
                  <!-- <base-input
                    placeholder="ABA QR"
                    input-classes="form-control-alternative"
                    v-model="business.qr_code"
                  /> -->

                  <h4>ABA QR</h4>
                  <label class="uploadImg">
                    <input
                      type="file"
                      @change="onFileSelected($event, 'abaQR')"
                      accept="image/*"
                      class="upload-logo"
                    />
                    Choose Image
                  </label>
                  <img :src="qrimageUrl" height="100" />
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
      <div class="col-xl-12 pl-0 order-xl-1">
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
            <div class="col-lg-12 form-group">
              <label class="form-control-label">Invoice note text</label>
              <textarea
                class="form-control form-control-alternative"
                rows="5"
                v-model="business.invoice_note"
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <!-- <base-input
                alternative=""
                placeholder="Invoice signature"
                input-classes="form-control-alternative"
                v-model="business.digital_sign"
              /> -->
              <h4>Invoice signature</h4>
              <label class="uploadImg">
                <input
                  type="file"
                  @change="onFileSelected($event, 'signature')"
                  accept="image/*"
                  class="upload-logo"
                />
                Choose Image
              </label>
              <img :src="signatureUrl" height="100" />
            </div>
          </div>
        </card>
      </div>
    </div>
    <div class="float-right mb-3">
      <button
        @click="createNewBusiness()"
        type="button"
        class="btn btn-default"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script>
import BusinessService from "../../services/business.service";
import axios from "axios";

export default {
  components: {},
  name: "new-business",
  data() {
    return {
      value: null,
      business: {},
      selectedFile: null,
      logoUrl: "",
      qrimageUrl: "",
      signatureUrl: "",
      image: null,
    };
  },
  methods: {
    onupload() {
      const fd = new FormData();
      fd.append("image", this.selectedFile, this.selectedFile.name);
      axios
        .post(
          "https://us-central1-ostos-sticker-2022.cloudfunctions.net/uploadFile",
          fd
        )
        .then((img) => console.log(img));
    },
    createNewBusiness() {
      this.business.logo = this.selectedFile;
      BusinessService.postBusiness(this.business).then(
        () => {
          if (this.selectedFile) {
            this.onupload();
          }
          this.$router.push("/products");
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
    onFileSelected(event, target) {
      // this.selectedFile = event.target.files[0];
      const file = event.target.files;
      let fileName = file[0].name;
      console.log(fileName);
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("invalid file format");
      }
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file[0]);
      fileReader.addEventListener("load", () => {
        if (target === "logo") {
          this.logoUrl = fileReader.result;
        } else if (target === "abaQR") {
          this.qrimageUrl = fileReader.result;
        } else if (target === "signature") {
          this.signatureUrl = fileReader.result;
        }
      });
    },
  },
};
</script>
<!-- <style src="@vueform/multiselect/themes/default.css"></style> -->
<style scoped>
.uploadImg {
  border: 1px solid;
  border-radius: 5px;
  background-color: rgba(255, 129, 129, 0.303);
  padding: 7px;
  margin-right: 20px;
}
.upload-logo {
  display: none;
}
</style>