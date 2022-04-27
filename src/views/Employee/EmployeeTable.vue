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
          <h4 class="mb-0">
            All Employees :
            <span class="text-muted">{{ items.length }}</span>
          </h4>
        </div>
        <div class="col text-right">
          <router-link
            class="btn btn-sm btn-primary"
            :to="{ name: 'new-employee' }"
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
          <th>Created Date</th>
          <th>Updated Date</th>
          <th>Action</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            <router-link
              :to="{ name: 'edit-employee', params: { UserId: row.item.id } }"
              ><span class="font-weight-700">
                {{ row.item.id }}
              </span></router-link
            >
          </th>
          <td>
            {{ row.item.name }}
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
              @click="onEditEmployee(row.item.id)"
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
    <div v-if="isNopagination">
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
      <h4 class="heading mt-4">Are you sure, To delete this Employee?</h4>
    </div>

    <template v-slot:footer>
      <base-button @click="deleteProduct()" type="white">Delete</base-button>
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
import UserService from "../../services/user.service";
import moment from "moment";

export default {
  name: "employee-table",
  components: {},
  data() {
    return {
      isLoading: true,
      isPagination: true,
      deleteAlert: false,
    };
  },
  created: function () {
    this.moment = moment;
  },
  mounted() {
    this.getAllUsers();
  },
  methods: {
    onPaginationClicked(value) {
      console.log(value);
      this.getAllUsers({ page: value });
    },
    getAllUsers(options) {
      this.isLoading = true;
      UserService.getUsers(options).then(
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
      UserService.deleteUser(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllUsers();
      });
    },
    onEditEmployee(userId) {
      this.$router.push({ name: "edit-employee", params: { UserId: userId } });
    },
  },
};
</script>
<style></style>
