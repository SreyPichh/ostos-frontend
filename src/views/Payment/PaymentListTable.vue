<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>

  <div v-if="!isLoading" class="container-fluid mt--5 mb-5">
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
                <th>No</th>
                <th>Customer</th>
                <th>Business</th>
                <th>Total</th>
                <th>Status</th>
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
                  {{ row.item.customer_name }}
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
  </div>
</template>
<script>
import InvoiceService from "../../services/invoice.service";
import BusinessService from "../../services/business.service";

export default {
  name: "payment-list-table",
  data() {
    return {
      isLoading: true,
      totalAmount: 0,
      items: [],
      params: {},
      businesses: [],
    };
  },
  mounted() {
    this.params = this.$route.params;
    if (
      !(
        this.params.customer_name &&
        this.params.business_id &&
        this.params.status
      )
    ) {
      this.$router.push("/payments");
    }

    this.getAllReceipts();
    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
      this.businesses.unshift({ label: "ALL", value: "" });
    });
  },
  methods: {
    getAllReceipts() {
      this.isLoading = true;
      InvoiceService.getInvoices().then(
        (res) => {
          this.pagination = res.data.meta.pagination;
          this.items = this.groupByInvoice(res.data.data, function (item) {
            return [item.customer_name, item.business_id, item.status];
          });
          this.totalCalculate(this.items);
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
    getBusinessesLabel(bId) {
      if (this.businesses) {
        const business = this.businesses.find((b) => b.value === bId);
        return business.label;
      }
    },
    groupByInvoice(items, f) {
      const groups = {};
      const params = [
        this.params.customer_name,
        Number(this.params.business_id),
        this.params.status,
      ];
      items.forEach((item) => {
        const group = JSON.stringify(f(item));
        groups[group] = groups[group] || [];
        groups[group].push(item);
      });
      return groups[JSON.stringify(params)];
    },
    totalCalculate(items) {
      this.totalAmount = items
        .map((item) => Number(item.total))
        .reduce((prev, next) => prev + next);
      this.isLoading = false;
    },
  },
};
</script>
<style></style>
