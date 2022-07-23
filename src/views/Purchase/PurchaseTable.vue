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
      <div class="col-xl-12">
        <card shadow type="secondary">
          <div class="row align-items-end">
            <div class="col-lg-3">
              <label class="form-control-label">Status</label>
              <Multiselect
                v-model="searchParams.status"
                :options="['Paid', 'Unpaid', 'Partial Billed']"
              />
            </div>
            <div class="col-lg-3">
              <label class="form-control-label">Date</label>
              <v-date-picker
                class="inline-block h-full"
                v-model="searchParams.date"
                :masks="masks"
                :model-config="modelConfig"
                mode="date"
                color="red"
              >
                <template v-slot="{ inputValue, inputEvents, togglePopover }">
                  <div class="d-flex items-center">
                    <button
                      class="px-2 border bg-default rounded-left"
                      @click="togglePopover()"
                    >
                      <i class="fa fa-calendar-alt fa-md text-white"></i>
                    </button>
                    <input
                      :value="inputValue"
                      v-on="inputEvents"
                      class="px-2 border date-control form-search-control form-control bg-white"
                    />
                  </div>
                </template>
              </v-date-picker>
            </div>
            <base-button type="default" @click.prevent="onFilterPurchase"
              >Filter</base-button
            >
          </div>
        </card>
      </div>
    </div>
    <div class="card my-3">
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col-lg-3 d-flex">
            <h3 class="mb-0">
              Purchases List :
              <span class="text-muted">{{ totalCount }} items</span>
            </h3>
          </div>
          <div class="col-lg-5 align-items-center">
            <div class="d-flex items-center">
              <input
                class="px-2 border form-control form-search-control bg-white"
                v-model="inputSearch"
                v-on:keyup.enter="getAllPurchases({ search: inputSearch })"
              />
              <button
                class="px-3 border bg-default rounded-right"
                @click="getAllPurchases({ search: inputSearch })"
              >
                <i class="fa fa-search text-white"></i>
              </button>
            </div>
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

      <div class="table-responsive table-sm" id="printMe">
        <base-table
          thead-classes="thead-light"
          :data="items"
          @row-click="onItemSelected"
        >
          <template v-slot:columns>
            <th class="col-1">No.</th>
            <th>Suplier</th>
            <th class="col-1">Total</th>
            <th class="col-1">Status</th>
            <th class="col-2">Create Date</th>
            <th class="col-2">Updated Date</th>
            <th class="col-1">Action</th>
          </template>

          <template v-slot:default="row" v-if="!isSearching">
            <th scope="row" class="align-middle">
              <router-link
                :to="{
                  name: 'edit-purchase',
                  params: { purchaseId: row.item.id },
                }"
                ><span class="font-weight-700">
                  {{ row.item.index }}
                </span></router-link
              >
            </th>
            <td
              data-toggle="tooltip"
              data-placement="left"
              :title="row.item.note"
            >
              {{ row.item.supplier }}
            </td>
            <td>${{ row.item.total.toFixed(2) }}</td>
            <td>
              <span
                class="badge"
                :class="`badge-${
                  row.item.status === 'Paid'
                    ? 'default'
                    : row.item.status === 'Partial Billed'
                    ? 'info'
                    : 'danger'
                }`"
                >{{ row.item.status }}</span
              >
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
      <div v-if="isSearching" class="d-flex justify-content-center p-5">
        <scaling-squares-spinner
          :animation-duration="1250"
          :size="45"
          :color="'#ff1d5e'"
        />
      </div>
      <div v-if="items.length == 0 && !isSearching" class="text-center p-5">
        Empty Data
      </div>
    </div>
    <div v-if="!items.length !== 0 && this.pagination.total_pages !== 1">
      <base-pagination
        :total="pagination.total"
        :perPage="pagination.per_page"
        :value="pagination.current_page"
        @input="onPaginationClicked"
        align="center"
        size="sm"
      ></base-pagination>
    </div>
    <div class="float-right">
      <span class="h3">Total : </span>
      <span class="bg-gradient-neutral px-4 py-2"
        >${{ items.length != 0 ? totalAmount : 0 }}</span
      >
    </div>
    <div class="row mt-auto">
      <div class="col-lg-6 pl-0 form-group">
        <label class="form-control-label"
          >Purchase Note Of : <span>{{ itemSelected.id }}</span></label
        >
        <textarea
          class="form-control form-control-alternative"
          rows="5"
          readonly="true"
          v-model="itemSelected.note"
        ></textarea>
      </div>
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
import Multiselect from "@vueform/multiselect";

export default {
  name: "purchase-table",
  components: { Multiselect },
  data() {
    return {
      items: [],
      isLoading: true,
      deleteAlert: false,
      searchParams: {},
      itemSelected: "",
      totalCount: 0,
      totalAmount: 0,
      isSearching: false,
      inputSearch: "",
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "DD-MM-YYYY",
      },
    };
  },
  methods: {
    onItemSelected(value) {
      this.itemSelected = value;
    },
    onPaginationClicked(value) {
      this.getAllPurchases({ page: value });
    },
    getAllPurchases(options) {
      this.isLoading = true;
      PurchaseService.getPurchases(options).then(
        (res) => {
          this.searchParams = {};
          this.pagination = res.data.meta.pagination;
          this.totalCount = this.pagination.total;

          const purchases = res.data.data;
          this.items = purchases.map((item, index) => {
            item.index = index + 1 + (this.pagination.current_page - 1) * 20;
            return item;
          });
          this.totalCalculate(this.items);
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
    onFilterPurchase() {
      if (this.searchParams) {
        this.isSearching = true;
        this.inputSearch = "";
        const searchParams =
          "?search=" +
          Object.entries(this.searchParams)
            // eslint-disable-next-line no-unused-vars
            .filter(([key, value]) => !!value)
            .map(([key, value]) => {
              if (value) {
                return `${key}:${encodeURIComponent(value)}`;
              }
            })
            .join(";") +
          "&searchJoin=and";
        PurchaseService.getPurchasesBySearch(searchParams).then((invoices) => {
          this.pagination = invoices.data.meta.pagination;
          this.totalCount = invoices.data.data.length;

          const purchases = invoices.data.data;
          this.items = purchases.map((item, index) => {
            item.index = index + 1;
            return item;
          });
          this.totalCalculate(this.items);
        });
      }
    },
    totalCalculate(items) {
      this.isSearching = false;
      if (items.length) {
        this.totalAmount = items
          .map((item) => Number(item.total))
          .reduce((prev, next) => prev + next);
      }
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
