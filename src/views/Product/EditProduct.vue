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
              <div class="row justify-content-between form-inline">
                <div class="col-6 d-flex form-inline">
                  <h3 class="mb-0 mr-2">Product Info</h3>
                  <i
                    class="my-favourite"
                    :class="
                      product.isFavorite
                        ? 'fa fa-star text-danger'
                        : 'far fa-star text-danger'
                    "
                    @click.prevent="product.isFavorite = !product.isFavorite"
                  ></i>
                </div>
                <div class="col d-flex justify-content-end">
                  <lable class="text-green mr-2">Active</lable>
                  <base-switch
                    :value="product.isActive ? true : false"
                    v-model="product.isActive"
                  ></base-switch>
                </div>
              </div>
            </div>
          </template>

          <form>
            <div class="row">
              <div class="col-lg-6">
                <base-input
                  label="Name"
                  alternative=""
                  input-classes="form-control-alternative"
                  v-model="product.name"
                />
              </div>
              <div class="col-lg-2">
                <base-input
                  addonLeftText="$"
                  @keypress="isNumber($event)"
                  label="Price"
                  label-classes="form-control-range"
                  input-classes="form-control-alternative"
                  v-model="product.price"
                />
              </div>
              <div class="col-lg-2">
                <label class="form-control-label">Business</label>
                <Multiselect
                  v-model="product.business_id"
                  :options="businesses"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12 form-group">
                <label class="form-control-label">Desciption</label>
                <textarea
                  class="form-control form-control-alternative"
                  rows="5"
                  v-model="product.description"
                ></textarea>
              </div>
            </div>
          </form>
        </card>
      </div>
    </div>
    <div class="float-right mb-3">
      <button @click="updateProduct()" type="button" class="btn btn-default">
        Update
      </button>
    </div>
  </template>
</template>

<script>
import Multiselect from "@vueform/multiselect";
import ProductService from "../../services/product.service";
import BusinessService from "../../services/business.service";

export default {
  components: { Multiselect },
  name: "edit-product",
  data() {
    return {
      isLoading: true,
      product: {},
      businesses: [],
    };
  },
  mounted() {
    this.isLoading = true;
    this.productId = this.$route.params.Pid;
    ProductService.getProductById(this.productId).then((item) => {
      this.product = item.data.data;
      this.isLoading = false;
    });

    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
    });
  },
  methods: {
    updateProduct() {
      ProductService.updateProduct(this.productId, this.product).then(
        () => {
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
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
