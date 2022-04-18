<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>
  <div class="container-fluid mt--5 mb-5">
    <div class="row mb-3">
      <div class="col-xl-12 pl-0 order-xl-1">
        <card shadow type="secondary">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Basic Info</h3>
                </div>
              </div>
            </div>
          </template>

          <form>
            <div class="row">
              <div class="col-lg-6">
                <base-input
                  alternative=""
                  placeholder="Name"
                  input-classes="form-control-alternative"
                  v-model="model.username"
                />
              </div>
              <div class="col-lg-6">
                <base-input
                  placeholder="Logo"
                  input-classes="form-control-alternative"
                  v-model="model.logo"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <base-input
                  alternative=""
                  placeholder="Address 1"
                  input-classes="form-control-alternative"
                  v-model="model.address1"
                />
              </div>
            </div>
          </form>
        </card>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-xl-6 pl-0 order-xl-2">
        <card height="100%" shadow type="secondary">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Business Contact</h3>
                </div>
              </div>
            </div>
          </template>

          <form>
            <div class="row">
              <div class="col-lg-12">
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="Phone Number 1"
                      addonLeftIcon="fa fa-phone"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="Phone Number 2"
                      addonLeftIcon="fa fa-phone"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="Phone Number 3"
                      addonLeftIcon="fa fa-phone"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="Telegram"
                      addonLeftIcon="fa fa-paper-plane"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="Email"
                      addonLeftIcon="fa fa-envelope"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </card>
      </div>

      <div class="col-xl-6 pl-0 order-xl-3">
        <card height="100%" shadow type="secondary" class="mb-3">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Payment Info</h3>
                </div>
              </div>
            </div>
          </template>

          <form>
            <div class="row">
              <div class="col-lg-12">
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="ABA Name"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="ABA Number"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="ABA QR"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </card>

        <card height="100%" shadow type="secondary">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Socials</h3>
                </div>
              </div>
            </div>
          </template>
          <form>
            <div class="row">
              <div class="col-lg-12">
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="Facebook page"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-12">
                    <base-input
                      placeholder="Instagram page"
                      input-classes="form-control-alternative"
                      v-model="model.logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </card>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-xl-12 pl-0 order-xl-1">
        <card shadow type="secondary">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row align-items-center">
                <div class="col-7">
                  <h3 class="mb-0">Invoice Content</h3>
                </div>
              </div>
            </div>
          </template>

          <form>
            <div class="row">
              <div class="col-lg-12">
                <base-input
                  alternative=""
                  placeholder=""
                  label="Invoice top text"
                  input-classes="form-control-alternative"
                  v-model="model.username"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <base-input
                  placeholder=""
                  label="Invoice note text"
                  input-classes="form-control-alternative"
                  v-model="model.logo"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <base-input
                  alternative=""
                  placeholder="Invoice signature"
                  input-classes="form-control-alternative"
                  v-model="model.address1"
                />
              </div>
            </div>
          </form>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  components: {},
  name: "new-business",
  data() {
    return {
      value: null,
      employees: [
        { value: "rey", label: "Rey" },
        { value: "pheap", label: "Pheap" },
        { value: "pruoun", label: "Pruoun" },
        { value: "tem", label: "Tem" },
        { value: "lapa", label: "Lapa" },
        { value: "mey", label: "Mey" },
      ],
      model: {
        username: "",
        email: "",
        address1: "",
        address2: "",
      },
      productList: [
        "បិតហ្វីមឡានកំរិត3ឆ្នាំ",
        "ស្ទីកគ័រ សាក់ជញ្ជាំងកញ្ចក់",
        "ព្រីនស្ទីកគ័របាតខ្មៅ",
      ],
      products: [{ name: "", size_cm: "", price: "", quantity: "" }],
    };
  },
  methods: {
    addProduct() {
      this.products.push({
        name: "",
        price: "",
        quantity: "",
        size_cm: "",
      });
    },

    remove(index) {
      this.products.splice(index, 1);
    },

    submit() {
      const data = {
        products: this.products,
      };
      alert(JSON.stringify(data, null, 2));
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
