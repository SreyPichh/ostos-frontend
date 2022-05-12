<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <div class="card my-3" v-if="!isLoading && businesses.length">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col-lg-2 d-flex">
          <h4 class="mb-0">Invoice List</h4>
        </div>
        <div class="col-lg-3 d-flex align-items-center">
          <div class="d-flex items-center">
            <input
              class="px-2 border form-control form-search-control bg-white"
              v-model="inputSearch"
            />
            <button
              class="px-3 border bg-red rounded-right"
              @click="getAllInvoices({ search: inputSearch })"
            >
              <i class="fa fa-search text-white"></i>
            </button>
          </div>
        </div>

        <div class="col text-right">
          <router-link
            class="btn btn-sm btn-default"
            :to="{ name: 'new-invoice' }"
          >
            Create New
          </router-link>
        </div>
      </div>
    </div>

    <div class="table-responsive" id="printMe">
      <base-table thead-classes="thead-light" :data="items">
        <template v-slot:columns>
          <th>Invoice No</th>
          <th>Customer</th>
          <th>Business</th>
          <th>Total</th>
          <th>Status</th>
          <th>Create Date</th>
          <th>Updated Date</th>
          <th>Action</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            <router-link
              :to="{
                name: 'edit-invoice',
                params: { invoiceId: row.item.id },
              }"
              ><span class="font-weight-700">
                {{ `INV-` + String(row.item.invoice_number).padStart(6, "0") }}
              </span></router-link
            >
          </th>
          <td>
            {{ row.item.customer_name ? row.item.customer_name : "-----" }}
          </td>
          <td>
            {{ getBusinessesLabel(row.item.business_id) }}
          </td>
          <td>${{ row.item.total }}.00</td>
          <td>
            <span
              class="badge badge-pill badge-md"
              :class="`badge-${
                row.item.status === 'paid'
                  ? 'success'
                  : row.item.status === 'partial-billed'
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
            <base-button type="default" size="sm">
              <router-link
                :to="{
                  name: 'preview-invoice',
                  params: { invoiceId: row.item.id },
                }"
                target="_blank"
              >
                <i style="color: #fff" class="fas fa-print"></i>
              </router-link>
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
import InvoiceService from "../../services/invoice.service";
import BusinessService from "../../services/business.service";
import moment from "moment";

export default {
  name: "invoice-table",
  components: {},
  data() {
    return {
      isLoading: true,
      deleteAlert: false,
      inputSearch: "",
      businesses: [],
    };
  },
  mounted() {
    this.getAllInvoices();
    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
    });
  },
  methods: {
    getAllInvoices(options) {
      this.isLoading = true;
      InvoiceService.getInvoices(options).then(
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
    onDeleteClick(invoiceId) {
      this.deleteAlert = true;
      this.isDeletingId = invoiceId;
    },
    deleteInvoice() {
      InvoiceService.deleteInvoice(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllInvoices();
      });
    },
    onEditInvoice(invoiceId) {
      this.$router.push({
        name: "edit-invoice",
        params: { invoiceId: invoiceId },
      });
    },
    getBusinessesLabel(bId) {
      if (this.businesses) {
        const business = this.businesses.find((b) => b.value === bId);
        return business.label;
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
  height: 2rem !important;
  border-radius: 0.375rem 0 0 0.375rem !important;
}
</style>
