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
          <!-- <div class="col text-right">
            <router-link
              class="btn btn-sm btn-default"
              :to="{ name: 'new-customer' }"
            >
              Create New
            </router-link>
          </div> -->
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
              {{ row.item.name }}
            </td>
            <td>
              {{ row.item.phone_number }}
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
</template>

<script>
import UserService from "../../services/user.service";
import moment from "moment";

export default {
  name: "user-table",
  components: {},
  data() {
    return {
      items: [],
      isLoading: true,
      isPagination: true,
      deleteAlert: false,
      currentUser: "",
    };
  },
  created: function () {
    this.moment = moment;
  },
  mounted() {
    UserService.getUserProfile().then((user) => {
      this.currentUser = user.data.data;
      this.getAllCustomers();
    });
  },
  methods: {
    onPaginationClicked(value) {
      this.getAllCustomers({ page: value });
    },
    getAllCustomers(options) {
      this.isLoading = true;
      UserService.getUsers(options).then(
        (res) => {
          const users = res.data.data;
          this.items = users.filter((user) => user.id !== this.currentUser.id);
          this.pagination = res.data.meta.pagination;
          this.isLoading = false;
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
