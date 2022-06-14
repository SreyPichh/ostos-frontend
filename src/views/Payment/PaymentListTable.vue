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
                  {{ row.item.id }}
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
      <h4 class="heading mt-4">Are you sure, To delete this Receipt?</h4>
      <p>Click OK to delete</p>
    </div>

    <template v-slot:footer>
      <base-button @click="deleteReceipt" type="white">Ok, Got it</base-button>
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

export default {
  name: "payment-list-table",
  mounted() {
    this.status = this.$route.params;
    console.log(this.status);

    this.getAllReceipts();
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
      paymentReport: {},
      businesses: [],
    };
  },
  methods: {
    getAllReceipts(options) {
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
