<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <div class="card my-3" v-if="!isLoading">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col d-flex">
          <h4 class="mb-0">Quote List</h4>
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

    <div class="table-responsive" id="printMe">
      <base-table thead-classes="thead-light" :data="items">
        <template v-slot:columns>
          <th>Quote No</th>
          <th>Customer</th>
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
                name: 'edit-quote',
                params: { quoteId: row.item.id },
              }"
              ><span class="font-weight-700">
                {{ row.item.quote_number }}
              </span></router-link
            >
          </th>
          <td>
            {{ row.item.customer }}
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
              @click="onEditQuote(row.item.id)"
              type="default"
              size="sm"
            >
              <i class="fas fa-pencil-alt"></i>
            </base-button>
            <base-button type="default" size="sm">
              <router-link to="/quotes/preview" target="_blank">
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
      <h4 class="heading mt-4">Are you sure, To delete this Quote?</h4>
      <p>Click OK to delete</p>
    </div>

    <template v-slot:footer>
      <base-button @click="deleteQuote" type="white">Ok, Got it</base-button>
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
import moment from "moment";

export default {
  name: "quote-table",
  data() {
    return {
      isLoading: true,
      deleteAlert: false,
    };
  },
  methods: {
    getAllQuotes(options) {
      this.isLoading = true;
      QuoteService.getQuotes(options).then(
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
    onDeleteClick(quoteId) {
      this.deleteAlert = true;
      this.isDeletingId = quoteId;
    },
    deleteQuote() {
      QuoteService.deleteQuote(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllQuotes();
      });
    },
    onEditQuote(quoteId) {
      this.$router.push({
        name: "edit-quote",
        params: { quoteId: quoteId },
      });
    },
  },
  created() {
    this.moment = moment;
  },
  mounted() {
    this.getAllQuotes();
  },
};
</script>
<style></style>
