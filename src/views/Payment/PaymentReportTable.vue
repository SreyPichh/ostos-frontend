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
            <base-button type="default" @click.prevent="onFilterPayment"
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
            <h3 class="mb-0">Payment Report</h3>
          </div>
          <div class="col-lg-5 align-items-center">
            <div class="d-flex items-center">
              <input
                class="px-2 border form-control form-search-control bg-white"
                v-model="inputSearch"
                v-on:keyup.enter="getAllInvoices({ search: inputSearch })"
              />
              <button
                class="px-3 border bg-default rounded-right"
                @click="getAllInvoices({ search: inputSearch })"
              >
                <i class="fa fa-search text-white"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="table-responsive" v-if="businesses.length">
        <base-table thead-classes="thead-light" :data="items">
          <template v-slot:columns>
            <th>No.</th>
            <th>Customer</th>
            <th>Phone Number</th>
            <th>Invoices</th>
            <th>Business</th>
            <th>Total</th>
            <th>Status</th>
          </template>

          <template v-slot:default="row">
            <th scope="row" class="align-middle">
              <span class="font-weight-700">
                {{ row.item.index }}
              </span>
            </th>
            <td>
              <router-link
                :to="{
                  name: 'payment-list',
                  params: {
                    customer_id: row.item.customer_id,
                    business_id: row.item.business_id,
                    status: row.item.status,
                  },
                }"
                ><span class="font-weight-700">
                  {{ row.item.customer_name }}
                </span></router-link
              >
            </td>
            <td>
              {{
                row.item.customer_phone_number
                  ? row.item.customer_phone_number
                  : "-----"
              }}
            </td>
            <td>
              {{ row.item.invoice_count }}
            </td>
            <td>
              {{ getBusinessesLabel(row.item.business_id) }}
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
          </template>
        </base-table>
      </div>
      <div v-if="items.length == 0" class="text-center p-5">Empty Data</div>
    </div>
  </template>
  <div class="float-right">
    <span class="h3">Total : </span>
    <span class="bg-gradient-neutral px-4 py-2"
      >${{ items.length != 0 ? totalAmount.toFixed(2) : 0 }}</span
    >
  </div>
</template>
<script>
import InvoiceService from "../../services/invoice.service";
import BusinessService from "../../services/business.service";
import Multiselect from "@vueform/multiselect";

export default {
  name: "payment-report-table",
  components: { Multiselect },
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
      totalAmount: 0,
      items: [],
      filterItems: [],
      businesses: [],
      searchParams: {},
      isSearching: false,
      inputSearch: "",
    };
  },
  methods: {
    getAllInvoices(options) {
      const req = Object.assign(
        {
          orderBy: "status",
          sortedBy: "DESC",
        },
        options
      );
      this.isLoading = true;
      InvoiceService.getInvoices(req).then(
        (invoices) => {
          const payments = this.groupByInvoice(
            invoices.data.data,
            function (item) {
              return [item.customer_id, item.business_id, item.status];
            }
          );
          this.items = payments.map((item, index) => {
            item.index = index + 1;
            return item;
          });
          this.totalCalculate(this.items);
          this.totalCount = this.items.length;
          this.isLoading = false;
        },
        (error) => {
          alert("error to get data", error);
        }
      );
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
      if (items.length) {
        this.totalAmount = items
          .map((item) => Number(item.total))
          .reduce((prev, next) => prev + next);
      }
    },
    groupByInvoice(items, f) {
      var groups = {};
      items.forEach((item) => {
        let group = "";
        if (f(item)[0] === null) {
          group = JSON.stringify([null]);
        } else {
          group = JSON.stringify(f(item));
        }
        groups[group] = groups[group] || [];
        groups[group].push(item);
      });
      return Object.keys(groups).map((group) => {
        const invoice = groups[group][0];
        const total = groups[group]
          .map((item) => Number(item.total))
          .reduce((prev, next) => prev + next);

        if (invoice.customer_id === null) {
          return {
            customer_id: null,
            customer_name: "General Customer",
            total: total,
            invoice_count: groups[group].length,
          };
        } else {
          return {
            customer_id: invoice.customer_id,
            customer_name: invoice.customer_info.customer_name,
            customer_phone_number: invoice.customer_info.customer_phone_number,
            business_id: invoice.business_id,
            total: total,
            invoice_count: groups[group].length,
            status: invoice.status,
          };
        }
      });
    },
    onFilterPayment() {
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
        InvoiceService.getInvoicesBySearch(searchParams).then((invoices) => {
          const payments = this.groupByInvoice(
            invoices.data.data,
            function (item) {
              return [item.customer_id, item.business_id, item.status];
            }
          );
          this.items = payments.map((item, index) => {
            item.index = index + 1;
            return item;
          });
          this.totalCalculate(this.items);
          this.isSearching = false;
          this.totalCount = this.items.length;
        });
      }
    },
  },
};
</script>
<style></style>
