<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <div class="card mb-3" v-if="!isLoading">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col d-flex">
          <h4 class="mb-0">
            All Business : <span class="text-muted">{{ items.length }}</span>
          </h4>
        </div>
        <div class="col text-right">
          <router-link
            class="btn btn-sm btn-default"
            :to="{ name: 'new-business' }"
          >
            Create New
          </router-link>
        </div>
      </div>
    </div>

    <div class="table-responsive table-sm">
      <base-table thead-classes="thead-light" :data="items">
        <template v-slot:columns>
          <th class="col-1">ID</th>
          <th>Name</th>
          <th class="col-1">Logo</th>
          <th class="col-2">Created Date</th>
          <th class="col-2">Updated Date</th>
          <th class="col-1">Action</th>
        </template>

        <template v-slot:default="row">
          <th scope="row" class="align-middle">
            <router-link
              :to="{ name: 'edit-business', params: { Bid: row.item.id } }"
              ><span class="font-weight-700">
                {{ row.item.id }}
              </span></router-link
            >
          </th>
          <td>
            {{ row.item.name }}
          </td>
          <td>LOGO</td>
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
              @click="onEditBusiness(row.item.id)"
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
    <div v-if="items.length == 0" class="text-center p-5">Empty Data</div>
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
      <h4 class="heading mt-4">Are you sure, To delete this Business?</h4>
      <p>Click OK to delete</p>
    </div>

    <template v-slot:footer>
      <base-button @click="deleteBusiness" type="white">Ok, Got it</base-button>
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
import BusinessService from "../../services/business.service";
import moment from "moment";
export default {
  name: "business-table",
  components: {},
  data() {
    return {
      isLoading: true,
      deleteAlert: false,
    };
  },
  created: function () {
    this.moment = moment;
  },
  mounted() {
    this.getAllBusinesses();
  },
  methods: {
    getAllBusinesses(options) {
      this.isLoading = true;
      BusinessService.getBusinesses(options).then(
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
    onDeleteClick(businessId) {
      this.deleteAlert = true;
      this.isDeletingId = businessId;
    },
    deleteBusiness() {
      BusinessService.deleteBusiness(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllBusinesses();
      });
    },
    onEditBusiness(businessId) {
      this.$router.push({ name: "edit-business", params: { Bid: businessId } });
    },
  },
};
</script>
<style></style>
