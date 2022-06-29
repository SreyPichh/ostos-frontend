<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>

  <template v-if="!isLoading">
    <div class="card mb-3">
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
              class="btn btn-sm btn-default"
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
            <th class="col-1">No.</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th class="col-1">Gender</th>
            <th class="col-2">Created Date</th>
            <th class="col-2">Updated Date</th>
            <th class="col-1">Action</th>
          </template>

          <template v-slot:default="row">
            <th scope="row" class="align-middle">
              <router-link
                :to="{
                  name: 'edit-employee',
                  params: { employeeId: row.item.id },
                }"
                ><span class="font-weight-700">
                  {{ row.item.index }}
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
    </div>
    <div v-if="pagination.total_pages !== 1">
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
import EmployeeService from "../../services/employee.service";
import moment from "moment";

export default {
  name: "employee-table",
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
    this.getAllUsers();
  },
  methods: {
    onPaginationClicked(value) {
      this.getAllUsers({ page: value });
    },
    getAllUsers(options) {
      this.isLoading = true;
      EmployeeService.getEmployees(options).then(
        (res) => {
          this.pagination = res.data.meta.pagination;
          const employees = res.data.data;
          this.items = employees.map((item, index) => {
            item.index = index + 1 + (this.pagination.current_page - 1) * 20;
            return item;
          });
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
      EmployeeService.deleteEmployee(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllUsers();
      });
    },
    onEditEmployee(employeeId) {
      this.$router.push({
        name: "edit-employee",
        params: { employeeId: employeeId },
      });
    },
  },
};
</script>
<style></style>
