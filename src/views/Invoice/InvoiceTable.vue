<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col d-flex">
          <h3 class="mb-0">Invoice List</h3>
        </div>
        <div class="col text-right">
          <router-link :to="{ name: 'new-invoice' }">
            <small>Create New</small>
          </router-link>
        </div>
      </div>
    </div>

    <div class="table-responsive" id="printMe">
      <base-table thead-classes="thead-light" :data="tableData">
        <template v-slot:columns>
          <th>Invoice No</th>
          <th>Customer</th>
          <th>Type</th>
          <th>Status</th>
          <th>Create Date</th>
          <th>Updated Date</th>
          <th>Action</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            <a href="#!">{{ row.item.invoiceNo }}</a>
          </th>
          <td>
            {{ row.item.customer }}
          </td>
          <td>
            {{ row.item.type }}
          </td>
          <td>
            <span class="badge badge-pill badge-md badge-success">{{
              row.item.status
            }}</span>
          </td>
          <td>
            {{ row.item.createdAt }}
          </td>
          <td>
            {{ row.item.updatedAt }}
          </td>
          <td>
            <base-button type="default" size="sm">
              <i class="fas fa-pencil-alt"></i>
            </base-button>
            <base-button type="default" size="sm">
              <router-link to="/invoice/preview" target="_blank">
                <i class="fas fa-eye"></i>
              </router-link>
            </base-button>
            <base-button type="default" size="sm">
              <i @click="printWindow()" class="fas fa-print"></i>
            </base-button>
            <base-button type="danger" size="sm">
              <i class="fas fa-trash"></i>
            </base-button>
          </td>
        </template>
      </base-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "invoice-table",
  data() {
    return {
      tableData: [
        {
          invoiceNo: "INV-00034",
          customer: "Ratana",
          createdAt: "01/03/2022",
          updatedAt: "01/03/2022",
          type: "invoice",
          status: "paid",
        },
      ],
    };
  },
  methods: {
    printWindow() {
      window.print();
    },
  },
};
</script>
<style>
@media print {
}
</style>
