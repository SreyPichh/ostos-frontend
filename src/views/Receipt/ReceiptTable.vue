<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>

  <template v-if="!isLoading && businesses.length">
    <div class="row mb-3">
      <div class="col-xl-12">
        <card shadow type="secondary">
          <div class="row align-items-end">
            <div class="col-lg-3">
              <label class="form-control-label">Business</label>
              <Multiselect
                :options="businesses"
                v-model="searchParams.business_id"
              />
            </div>
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
            <base-button type="default" @click.prevent="onFilterReceipt"
              >Filter</base-button
            >
          </div>
        </card>
      </div>
    </div>
    <div class="card my-3">
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col-lg-2 d-flex">
            <h3 class="mb-0">
              Receipts :
              <span class="text-muted">{{ totalCount }} items</span>
            </h3>
          </div>
          <div class="col-lg-5 align-items-center">
            <div class="d-flex items-center">
              <input
                class="px-2 border form-control form-search-control bg-white"
                v-model="inputSearch"
                v-on:keyup.enter="getAllReceipts({ search: inputSearch })"
              />
              <button
                class="px-3 border bg-default rounded-right"
                @click="getAllReceipts({ search: inputSearch })"
              >
                <i class="fa fa-search text-white"></i>
              </button>
            </div>
          </div>
          <div class="col text-right">
            <router-link
              class="btn btn-sm btn-default"
              :to="{ name: 'new-receipt' }"
            >
              Create New
            </router-link>
          </div>
        </div>
      </div>

      <div
        class="table-responsive table-sm"
        id="printMe"
        v-if="businesses.length"
      >
        <base-table
          thead-classes="thead-light"
          :data="items"
          @row-click="onItemSelected"
        >
          <template v-slot:columns>
            <th class="col-1">Receipt No</th>
            <th>Customer</th>
            <th class="col-1">Business</th>
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
                  name: 'edit-receipt',
                  params: { receiptId: row.item.id },
                }"
                ><span class="font-weight-700">
                  {{
                    `REC-` + String(row.item.receipt_number).padStart(6, "0")
                  }}
                </span></router-link
              >
            </th>
            <td
              data-toggle="tooltip"
              data-placement="left"
              :title="row.item.receipt_note"
            >
              {{
                row.item.customer_info.customer_name
                  ? row.item.customer_info.customer_name
                  : "-----"
              }}
            </td>
            <td>
              {{ getBusinessesLabel(row.item.business_id) }}
            </td>
            <td>${{ row.item.amount.toFixed(2) }}</td>
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
                @click="onEditReceipt(row.item.id)"
                type="default"
                size="sm"
              >
                <i class="fas fa-pencil-alt"></i>
              </base-button>
              <base-button
                type="info"
                size="sm"
                @click="openPreview(row.item.id)"
              >
                <i style="color: #fff" class="fas fa-print"></i>
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
    <div class="row mt-auto">
      <div class="col-lg-6 form-group">
        <label class="form-control-label"
          >Receipt Note Of :
          {{
            itemSelected
              ? `INV-` + String(itemSelected.receipt_number).padStart(6, "0")
              : ""
          }}</label
        >
        <textarea
          class="form-control form-control-alternative"
          rows="5"
          readonly="true"
          v-model="itemSelected.receipt_note"
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
      <h4 class="heading mt-4">Are you sure, To delete this Receipt?</h4>
      <p>Click OK to delete</p>
    </div>

    <template v-slot:footer>
      <base-button @click.prevent="deleteReceipt" type="white"
        >Ok, Got it</base-button
      >
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
import ReceiptService from "../../services/receipt.service";
import BusinessService from "../../services/business.service";
import moment from "moment";
import Multiselect from "@vueform/multiselect";

export default {
  name: "receipt-table",
  components: { Multiselect },
  data() {
    return {
      items: [],
      isLoading: true,
      deleteAlert: false,
      inputSearch: "",
      businesses: [],
      searchParams: {},
      itemSelected: "",
      totalCount: 0,
      isSearching: false,
      isPagination: true,
      modelConfig: {
        type: "string",
        mask: "YYYY-MM-DD",
      },
      masks: {
        input: "DD-MM-YYYY",
      },
    };
  },
  mounted() {
    this.getAllReceipts();
    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
      this.businesses.unshift({ label: "ALL", value: "" });
    });
  },
  methods: {
    onItemSelected(value) {
      this.itemSelected = value;
    },
    openPreview(receiptId) {
      const routeData = this.$router.resolve({
        name: "preview-receipt",
        params: { receiptId: receiptId },
      });
      window.open(routeData.href, "_blank");
    },
    onPaginationClicked(value) {
      this.getAllReceipts({ page: value });
    },
    getAllReceipts(options) {
      const req = Object.assign(
        {
          orderBy: "updated_at",
          sortedBy: "DESC",
        },
        options
      );
      this.isLoading = true;
      ReceiptService.getReceipts(req).then(
        (res) => {
          this.items = res.data.data;
          this.pagination = res.data.meta.pagination;
          this.searchParams = {};
          this.totalCount = this.pagination.total;
          this.isLoading = false;
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
    onDeleteClick(receiptId) {
      this.deleteAlert = true;
      this.isDeletingId = receiptId;
    },
    deleteReceipt() {
      ReceiptService.deleteReceipt(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllReceipts();
      });
    },
    onEditReceipt(receiptId) {
      this.$router.push({
        name: "edit-receipt",
        params: { receiptId: receiptId },
      });
    },
    getBusinessesLabel(bId) {
      if (this.businesses.length && bId) {
        const business = this.businesses.find((b) => b.value === bId);
        return business.label;
      } else {
        return "-----";
      }
    },
    onFilterReceipt() {
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
        ReceiptService.getReceiptsBySearch(searchParams).then((receipts) => {
          this.isSearching = false;
          this.items = receipts.data.data;
          this.pagination = receipts.data.meta.pagination;
          this.totalCount = this.items.length;
        });
      }
    },
  },
  created() {
    this.moment = moment;
  },
};
</script>
<style>
.form-search-control {
  height: 2.5rem !important;
  border-radius: 0.375rem 0 0 0.375rem !important;
}
</style>
