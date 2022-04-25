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
      <div class="col-xl-12 pl-0 order-xl-1">
        <card shadow type="secondary">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row justify-content-between form-inline">
                <div class="col d-flex form-inline">
                  <h3 class="mb-0 mr-2">Product Info</h3>
                  <i
                    class="my-favourite"
                    :class="
                      isFavourite
                        ? 'fa fa-star text-danger'
                        : 'far fa-star text-danger'
                    "
                    @click.prevent="onSetAsFavourite"
                  ></i>
                </div>
                <div class="col-2 d-flex justify-content-end">
                  <lable class="text-green mr-2">Active</lable>
                  <base-switch
                    :value="this.product.isActive ? true : false"
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
                  addonRightText=".00"
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
    <div class="float-right">
      <button @click="updateProduct()" type="button" class="btn btn-default">
        Update
      </button>
    </div>
  </div>
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
      isFavourite: false,
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
      this.product.isActive = this.product.isActive ? 1 : 0;
      ProductService.updateProduct(this.productId, this.product).then(
        () => {
          this.$router.push("/products");
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
    onSetAsFavourite() {
      this.isFavourite = !this.isFavourite;
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
