<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>

  <template v-if="!isLoading">
    <div class="card my-3" v-if="businesses.length == 0">
      <div class="text-center p-5">
        There is no Business, Please create business at least 1
      </div>
    </div>
    <div class="card my-3" v-if="businesses.length">
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col-lg-2 d-flex">
            <h3 class="mb-0">
              All Products :
              <span class="text-muted">{{ totalCount }}</span>
            </h3>
          </div>
          <div class="col-lg-3 d-flex align-items-center">
            <label class="form-control-label mr-2 mb-0">Business</label>
            <Multiselect
              v-model="searchParams.business"
              :options="businesses"
              @clear="getAllProducts()"
            />
          </div>
          <base-button type="default btn-sm" @click.prevent="onFilterProduct"
            >Filter</base-button
          >
          <div class="col text-right">
            <router-link
              class="btn btn-sm btn-default"
              :to="{ name: 'new-product' }"
            >
              Create New
            </router-link>
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <base-table class="table-sm" thead-classes="thead-light" :data="items">
          <template v-slot:columns>
            <th class="col-1">ID</th>
            <th>Name</th>
            <th class="col-1">Business</th>
            <th class="col-2">Created Date</th>
            <th class="col-2">Updated Date</th>
            <th class="col-1">Action</th>
          </template>

          <template v-slot:default="row" v-if="!isSearcing">
            <th scope="row" class="align-middle">
              <router-link
                :to="{ name: 'edit-product', params: { Pid: row.item.id } }"
              >
                <span class="font-weight-700">
                  {{ row.item.id }}
                </span>
              </router-link>
            </th>
            <td>
              {{ row.item.name }}
            </td>
            <td>
              {{ getBusinessesLabel(row.item.business_id) }}
            </td>
            <td>
              {{
                moment(row.item.created_at).format("DD/MM/YYYY [&nbsp;] HH:mm")
              }}
            </td>
            <td>
              {{
                moment(row.item.updated_at).format("DD/MM/YYYY [&nbsp;] HH:mm")
              }}
            </td>
            <td>
              <!-- <base-button
              @click="onSetFavorite(row.item.id, row.item.isFavorite)"
              type="secondary"
              size="sm"
              ><i
                :class="
                  row.item.isFavorite
                    ? 'fa fa-star text-danger'
                    : 'far fa-star text-danger'
                "
              ></i
            ></base-button> -->
              <base-button
                @click.prevent="onEditProduct(row.item.id)"
                type="default"
                size="sm"
                ><i class="fas fa-pencil-alt"></i
              ></base-button>
              <base-button
                @click.prevent="onDeleteClick(row.item.id)"
                type="danger"
                size="sm"
                ><i class="fas fa-trash"></i
              ></base-button>
            </td>
          </template>
        </base-table>
      </div>
      <div v-if="isSearcing" class="d-flex justify-content-center p-5">
        <scaling-squares-spinner
          :animation-duration="1250"
          :size="45"
          :color="'#ff1d5e'"
        />
      </div>
      <div v-if="items.length === 0 && !isSearcing" class="text-center p-5">
        Empty Data
      </div>
    </div>
    <div
      v-if="
        isPagination && !items.length !== 0 && this.pagination.total_pages !== 1
      "
    >
      <base-pagination
        :total="pagination.total"
        :perPage="pagination.per_page"
        :value="pagination.current_page"
        @input="onPaginationClicked"
        align="center"
        size="sm"
      ></base-pagination>
    </div>
  </template>

  <modal
    v-model:show="deleteAlert"
    gradient="danger"
    modal-classes="modal-danger modal-dialog-centered"
  >
    <template v-slot:header>
      <h4 class="modal-title" id="modal-title-notification">Warning</h4>
    </template>
    <div class="py-3 text-center">
      <i class="fas fa-trash fa-3x"></i>
      <h4 class="heading mt-4">Are you sure, To delete this Product?</h4>
    </div>

    <template v-slot:footer>
      <base-button @click.prevent="deleteProduct()" type="white"
        >Delete</base-button
      >
      <base-button
        type="link"
        text-color="white"
        class="ml-auto"
        @click.prevent="deleteAlert = false"
      >
        Close
      </base-button>
    </template>
  </modal>
</template>

<script>
import ProductService from "../../services/product.service";
import moment from "moment";
import BusinessService from "../../services/business.service";
import Multiselect from "@vueform/multiselect";

export default {
  name: "product-table",
  components: { Multiselect },
  data() {
    return {
      isLoading: true,
      isSearcing: false,
      deleteAlert: false,
      isPagination: true,
      totalCount: 0,
      searchParams: {
        business: "all",
      },
      businesses: [],
    };
  },
  created: function () {
    this.moment = moment;
  },
  mounted() {
    this.getAllProducts();
    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
      this.businesses.unshift({ label: "ALL", value: "all" });
    });
  },
  methods: {
    getBusinessesLabel(bId) {
      if (this.businesses) {
        const business = this.businesses.find((b) => b.value === bId);
        return business.label;
      }
    },
    onSetFavorite(productId, isFavorite) {
      ProductService.updateProduct(productId, { isFavorite: !isFavorite }).then(
        () => {
          this.getAllProducts();
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
    onPaginationClicked(value) {
      this.getAllProducts({ page: value });
    },
    getAllProducts(options) {
      this.isLoading = true;
      ProductService.getProducts(options).then(
        (res) => {
          this.items = res.data.data;
          this.pagination = res.data.meta.pagination;
          this.totalCount = this.pagination.total;
          this.isLoading = false;
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
    onDeleteClick(productId) {
      this.deleteAlert = true;
      this.isDeletingId = productId;
    },
    deleteProduct() {
      ProductService.deleteProduct(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllProducts();
      });
    },
    onEditProduct(proId) {
      this.$router.push({ name: "edit-product", params: { Pid: proId } });
    },
    onFilterProduct() {
      if (this.searchParams.business && this.searchParams.business === "all") {
        this.getAllProducts();
      } else if (
        this.searchParams.business &&
        this.searchParams.business.length !== 0
      ) {
        this.isSearcing = true;
        BusinessService.getBusinessById(this.searchParams.business, {
          include: "product",
        }).then((b) => {
          this.isSearcing = false;
          this.items = b.data.data.product.data;
          this.totalCount = this.items.length;
        });
      }
    },
  },
};
</script>
<style></style>
