<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>

  <template v-if="!isLoading">
    <div class="card">
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col d-flex">
            <h4 class="mb-0">
              All Customers :
              <span class="text-muted">{{ items.length }}</span>
            </h4>
          </div>
          <div class="col text-right">
            <router-link
              class="btn btn-sm btn-default"
              :to="{ name: 'new-customer' }"
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
            <th class="col-2">Phone Number</th>
            <th class="col-1">Gender</th>
            <th class="col-2">Created Date</th>
            <th class="col-2">Updated Date</th>
            <th class="col-1">Action</th>
          </template>

          <template v-slot:default="row">
            <th scope="row" class="align-middle">
              <router-link
                :to="{
                  name: 'edit-customer',
                  params: { customerId: row.item.id },
                }"
                ><span class="font-weight-700">
                  {{ row.item.id }}
                </span></router-link
              >
            </th>
            <td>
              {{ row.item.customer_name }}
            </td>
            <td>
              {{ row.item.customer_phone_number }}
            </td>
            <td>
              {{ row.item.gender }}
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
                @click="onEditCustomer(row.item.id)"
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
    </div>
    <div v-if="this.pagination.total_pages !== 1">
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
      <h4 class="heading mt-4">Are you sure, To delete this Customer?</h4>
    </div>

    <template v-slot:footer>
      <base-button @click="deleteCustomer()" type="white">Delete</base-button>
      <base-button
        type="link"
        text-color="white"
        class="ml-auto"
        @click="deleteAlert = false"
      >
        Close
      </base-button>
    </template>
  </modal>
</template>

<script>
import CustomerService from "../../services/customer.service";
import moment from "moment";

export default {
  name: "customer-table",
  components: {},
  data() {
    return {
      items: [],
      isLoading: true,
      isPagination: true,
      deleteAlert: false,
    };
  },
  created: function () {
    this.moment = moment;
  },
  mounted() {
    this.getAllCustomers();
  },
  methods: {
    onPaginationClicked(value) {
      this.getAllCustomers({ page: value });
    },
    getAllCustomers(options) {
      this.isLoading = true;
      CustomerService.getCustomers(options).then(
        (res) => {
          this.items = res.data.data;
          this.pagination = res.data.meta.pagination;
          this.isLoading = false;
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
    onDeleteClick(customerId) {
      this.deleteAlert = true;
      this.isDeletingId = customerId;
    },
    deleteCustomer() {
      CustomerService.deleteCustomer(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllCustomers();
      });
    },
    onEditCustomer(customerId) {
      this.$router.push({
        name: "edit-customer",
        params: { customerId: customerId },
      });
    },
  },
};
</script>
<style></style>
