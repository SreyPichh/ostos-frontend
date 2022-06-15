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
          <h4 class="mb-0">Payment Report</h4>
        </div>
      </div>
    </div>

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
                name: 'payment-list',
                params: {
                  paymentId: row.item.id,
                  customer_name: row.item.customer_name,
                  business_id: row.item.business_id,
                  status: row.item.status,
                },
              }"
              ><span class="font-weight-700">
                {{ row.item.id }}
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
    <div v-if="items.length == 0" class="text-center p-5">Empty Data</div>
  </div>
  <div class="float-right">
    <span class="h3">Total : </span>
    <span class="bg-gradient-neutral px-4 py-2">${{ totalAmount }}</span>
  </div>
</template>
<script>
import InvoiceService from "../../services/invoice.service";
import BusinessService from "../../services/business.service";

export default {
  name: "payment-report-table",
  mounted() {
    this.getAllInvoices();
    BusinessService.getBusinesses().then((items) => {
      this.businesses = items.data.data.map((item) => {
        return { label: item.name, value: item.id };
      });
      this.businesses.unshift({ label: "ALL", value: "" });
    });
  },
  data() {
    return {
      isLoading: true,
      deleteAlert: false,
      totalAmount: 0,
      paymentReport: {},
      businesses: [],
    };
  },
  methods: {
    getAllInvoices(options) {
      this.isLoading = true;
      InvoiceService.getInvoices(options).then(
        (res) => {
          this.pagination = res.data.meta.pagination;
          this.isLoading = false;
          let index = 1;
          this.items = this.groupByInvoice(res.data.data, function (item) {
            return [item.customer_name, item.business_id, item.status];
          }).filter((item) => {
            if (item.status !== "Paid") {
              item.id = index++;
              return item;
            }
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
    totalCalculate(items) {
      this.totalAmount = items
        .map((item) => Number(item.total))
        .reduce((prev, next) => prev + next);
      console.log(this.totalAmount);
    },
    groupByInvoice(array, f) {
      var groups = {};
      array.forEach(function (o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
      });
      return Object.keys(groups).map((group) => {
        const invoice = groups[group][0];
        const total = groups[group]
          .map((item) => Number(item.total))
          .reduce((prev, next) => prev + next);
        return {
          customer_name: invoice.customer_name,
          business_id: invoice.business_id,
          total: total,
          status: invoice.status,
          items: groups[group],
        };
      });
    },
  },
};
</script>
<style></style>
