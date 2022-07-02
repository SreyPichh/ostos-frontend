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
      <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary" bodyClasses="p-0">
          <template v-slot:header>
            <div class="bg-white border-0">
              <div class="row justify-content-between">
                <div class="col">
                  <h3 class="mb-0">Payment Lists</h3>
                </div>
              </div>
            </div>
          </template>

          <div class="table-responsive" v-if="businesses.length">
            <base-table thead-classes="thead-light" :data="items">
              <template v-slot:columns>
                <th>No.</th>
                <th>Customer</th>
                <th>Business</th>
                <th>Total</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Updated Date</th>
                <th>Action</th>
              </template>

              <template v-slot:default="row">
                <th scope="row" class="align-middle">
                  <router-link
                    :to="{
                      name: 'edit-invoice',
                      params: { invoiceId: row.item.id },
                    }"
                    ><span class="font-weight-700">
                      {{
                        `INV-` +
                        String(row.item.invoice_number).padStart(6, "0")
                      }}
                    </span></router-link
                  >
                </th>
                <td>
                  {{ row.item.customer_info.customer_name }}
                </td>
                <td>
                  {{ getBusinessesLabel(row.item.business_id) }}
                </td>
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
                    moment(row.item.created_at).format(
                      "DD/MM/YYYY [&nbsp;] HH:mm"
                    )
                  }}
                </td>
                <td>
                  {{
                    moment(row.item.updated_at).format(
                      "DD/MM/YYYY [&nbsp;] HH:mm"
                    )
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
        </card>
      </div>
    </div>
    <div v-if="items.length == 0" class="text-center p-5">Empty Data</div>
    <div class="float-right">
      <span class="h3">Total : </span>
      <span class="bg-gradient-neutral px-4 py-2"
        >${{ items.length != 0 ? totalAmount : 0 }}</span
      >
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
import InvoiceService from "../../services/invoice.service";
import BusinessService from "../../services/business.service";
import moment from "moment";

export default {
  name: "payment-list-table",
  created() {
    this.moment = moment;
  },
  data() {
    return {
      isLoading: true,
      totalAmount: 0,
      items: [],
      params: {},
      businesses: [],
      deleteAlert: false,
    };
  },
  mounted() {
    this.params = this.$route.params;
    if (
      !(
        this.params.customer_id &&
        this.params.business_id &&
        this.params.status
      )
    ) {
      this.$router.push("/payments");
    }

    this.getPaymentList();
    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
      this.businesses.unshift({ label: "ALL", value: "" });
    });
  },
  methods: {
    getPaymentList() {
      this.isLoading = true;
      const searchParams =
        "?search=" +
        Object.entries(this.params)
          // eslint-disable-next-line no-unused-vars
          .filter(([key, value]) => !!value)
          .map(([key, value]) => {
            if (value) {
              return `${key}:${encodeURIComponent(value)}`;
            }
          })
          .join(";") +
        "&searchJoin=and";
      InvoiceService.getInvoicesBySearch(searchParams).then((invoices) => {
        this.isLoading = false;
        this.items = invoices.data.data;
        this.totalCalculate(this.items);
        this.totalCount = this.items.length;
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
    totalCalculate(items) {
      this.isLoading = false;
      if (items.length) {
        this.totalAmount = items
          .map((item) => Number(item.total))
          .reduce((prev, next) => prev + next);
      }
    },
    onEditInvoice(invoiceId) {
      this.$router.push({
        name: "edit-invoice",
        params: { invoiceId: invoiceId },
      });
    },
    openPreview(invoiceId) {
      const routeData = this.$router.resolve({
        name: "preview-invoice",
        params: { invoiceId: invoiceId },
      });
      window.open(routeData.href, "_blank");
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
  },
};
</script>
<style></style>
