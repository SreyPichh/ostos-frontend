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
            <base-button type="default" @click.prevent="onFilterQuote"
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
              Quotes :
              <span class="text-muted">{{ totalCount }} items</span>
            </h3>
          </div>
          <div class="col-lg-5 align-items-center">
            <div class="d-flex items-center">
              <input
                class="px-2 border form-control form-search-control bg-white"
                v-model="inputSearch"
                v-on:keyup.enter="getAllQuotes({ search: inputSearch })"
              />
              <button
                class="px-3 border bg-default rounded-right"
                @click="getAllQuotes({ search: inputSearch })"
              >
                <i class="fa fa-search text-white"></i>
              </button>
            </div>
          </div>
          <div class="col text-right">
            <router-link
              class="btn btn-sm btn-default"
              :to="{ name: 'new-quote' }"
            >
              Create New
            </router-link>
          </div>
        </div>
      </div>

      <div class="table-responsive" id="printMe" v-if="businesses.length">
        <base-table thead-classes="thead-light" :data="items">
          <template v-slot:columns>
            <th>Quote No</th>
            <th>Customer</th>
            <!-- <th>Business</th> -->
            <th>Total</th>
            <th>Status</th>
            <th>Create Date</th>
            <th>Updated Date</th>
            <th>Action</th>
          </template>

          <template v-slot:default="row" v-if="!isSearcing">
            <th scope="row" class="align-middle">
              <router-link
                :to="{
                  name: 'edit-invoice',
                  params: { invoiceId: row.item.id },
                }"
                ><span class="font-weight-700">
                  {{
                    `INV-` + String(row.item.invoice_number).padStart(6, "0")
                  }}
                </span></router-link
              >
            </th>
            <td>
              {{ row.item.customer_name ? row.item.customer_name : "-----" }}
            </td>
            <!-- <td>
              {{ getBusinessesLabel(row.item.business_id) }}
            </td> -->
            <td>${{ row.item.total }}</td>
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
                @click="onEditInvoice(row.item.id)"
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
      <div v-if="isSearcing" class="d-flex justify-content-center p-5">
        <scaling-squares-spinner
          :animation-duration="1250"
          :size="45"
          :color="'#ff1d5e'"
        />
      </div>
      <div v-if="items.length == 0 && !isSearcing" class="text-center p-5">
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
      <h4 class="heading mt-4">Are you sure, To delete this Invoice?</h4>
      <p>Click OK to delete</p>
    </div>

    <template v-slot:footer>
      <base-button @click.prevent="deleteInvoice" type="white"
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
import QuoteService from "../../services/quote.service";
import BusinessService from "../../services/business.service";
import moment from "moment";
import Multiselect from "@vueform/multiselect";

export default {
  name: "invoice-table",
  components: { Multiselect },
  data() {
    return {
      items: [],
      isLoading: true,
      deleteAlert: false,
      inputSearch: "",
      businesses: [],
      searchParams: {},
      totalCount: 0,
      isSearcing: false,
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
    this.getAllQuotes();
    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
      this.businesses.unshift({ label: "ALL", value: "" });
    });
  },
  methods: {
    openPreview(quoteId) {
      const routeData = this.$router.resolve({
        name: "preview-quote",
        params: { quoteId: quoteId },
      });
      window.open(routeData.href, "_blank");
    },
    onPaginationClicked(value) {
      this.getAllQuotes({ page: value });
    },
    getAllQuotes(options) {
      this.isLoading = true;
      QuoteService.getQuotes(options).then(
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
    onDeleteClick(invoiceId) {
      this.deleteAlert = true;
      this.isDeletingId = invoiceId;
    },
    deleteInvoice() {
      QuoteService.deleteQuote(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllQuotes();
      });
    },
    onEditInvoice(invoiceId) {
      this.$router.push({
        name: "edit-invoice",
        params: { invoiceId: invoiceId },
      });
    },
    getBusinessesLabel(bId) {
      if (this.businesses && bId) {
        const business = this.businesses.find((b) => b.value === bId);
        return business.label;
      } else {
        return "-----";
      }
    },
    onFilterQuote() {
      if (this.searchParams) {
        this.isSearcing = true;
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
        QuoteService.getQuotesBySearch(searchParams).then((invoices) => {
          this.isSearcing = false;
          this.items = invoices.data.data;
          this.pagination = invoices.data.meta.pagination;
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
