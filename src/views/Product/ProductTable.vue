<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <div class="card" v-if="!isLoading">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col d-flex">
          <h3 class="mb-0">
            All Products :
            <span class="text-muted">{{ items.length }} items</span>
          </h3>
        </div>
        <div class="col text-right">
          <router-link
            class="btn btn-sm btn-primary"
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
          <th>ID</th>
          <th>Name</th>
          <th>Business</th>
          <th>Created Date</th>
          <th>Updated Date</th>
          <th>Action</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            <router-link
              :to="{ name: 'edit-product', params: { Pid: row.item.id } }"
              >{{ row.item.id }}</router-link
            >
          </th>
          <td>
            {{ row.item.name }}
          </td>
          <td>
            {{ businesses["value"] }}
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
            <base-button
              @click="onEditProduct(row.item.id)"
              type="default"
              size="sm"
              ><i class="fas fa-pencil-alt"></i
            ></base-button>
            <base-button
              @click="onDeleteClick(row.item.id)"
              type="danger"
              size="sm"
              ><i class="fas fa-trash"></i
            ></base-button>
          </td>
        </template>
      </base-table>
    </div>
    <div v-if="items.length == 0" class="text-center p-5">Empty Data</div>
    <div v-if="isPagination">
      <base-pagination
        :total="pagination.total"
        :perPage="pagination.per_page"
        :value="pagination.current_page"
        @input="onPaginationClicked"
        align="center"
        size="sm"
      ></base-pagination>
    </div>
  </div>

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

export default {
  name: "product-table",
  components: {},
  data() {
    return {
      isLoading: true,
      deleteAlert: false,
      isPagination: true,
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
    });
  },
  methods: {
    onPaginationClicked(value) {
      console.log(value);
      this.getAllProducts({ page: value });
    },
    getAllProducts(options) {
      this.isLoading = true;
      ProductService.getProducts(options).then(
        (res) => {
          this.items = res.data.data;
          this.pagination = res.data.meta.pagination;
          this.isLoading = false;
          if (this.pagination.total_pages === 1) {
            this.isPagination = false;
          }
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
  },
};
</script>
<style></style>
