<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <div class="card my-3" v-if="!isLoading">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col d-flex">
          <h4 class="mb-0">Purchase List</h4>
        </div>
        <div class="col text-right">
          <router-link
            class="btn btn-sm btn-default"
            :to="{ name: 'new-purchase' }"
          >
            Create New
          </router-link>
        </div>
      </div>
    </div>

    <div class="table-responsive" id="printMe">
      <base-table thead-classes="thead-light" :data="items">
        <template v-slot:columns>
          <th>No</th>
          <th>Suplier</th>
          <th>Description</th>
          <th>Total</th>
          <th>Status</th>
          <th>Create Date</th>
          <th>Action</th>
        </template>

        <template v-slot:default="row">
          <th scope="row" class="align-middle">
            <router-link
              :to="{
                name: 'edit-purchase',
                params: { purchaseId: row.item.id },
              }"
              ><span class="font-weight-700">
                {{ row.item.purchase_number }}
              </span></router-link
            >
          </th>
          <td>
            {{ row.item.customer }}
          </td>
          <td>${{ row.item.total }}.00</td>
          <td>
            {{
              moment(row.item.created_at).format("DD/MM/YYYY [&nbsp;] HH:mm")
            }}
          </td>
          <td>
            <base-button
              @click="onEditPurchase(row.item.id)"
              type="default"
              size="sm"
            >
              <i class="fas fa-pencil-alt"></i>
            </base-button>
            <base-button
              @click.prevent="onDeleteClick(row.item.id)"
              type="danger"
              size="sm"
            >
              <i class="fas fa-trash"></i>
            </base-button>
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
      <h4 class="heading mt-4">Are you sure, To delete this Purchase?</h4>
      <p>Click OK to delete</p>
    </div>

    <template v-slot:footer>
      <base-button @click="deletePurchase" type="white">Ok, Got it</base-button>
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
import PurchaseService from "../../services/purchase.service";
import moment from "moment";

export default {
  name: "purchase-table",
  data() {
    return {
      isLoading: true,
      deleteAlert: false,
    };
  },
  methods: {
    getAllPurchases(options) {
      this.isLoading = true;
      PurchaseService.getPurchases(options).then(
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
    onDeleteClick(purchaseId) {
      this.deleteAlert = true;
      this.isDeletingId = purchaseId;
    },
    deletePurchase() {
      PurchaseService.deletePurchase(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllPurchases();
      });
    },
    onEditPurchase(purchaseId) {
      this.$router.push({
        name: "edit-purchase",
        params: { purchaseId: purchaseId },
      });
    },
  },
  created() {
    this.moment = moment;
  },
  mounted() {
    this.getAllPurchases();
  },
};
</script>
<style></style>
