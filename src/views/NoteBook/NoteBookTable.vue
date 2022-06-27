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
          <h4 class="mb-0">NoteBook List</h4>
        </div>
        <div class="col text-right">
          <router-link
            class="btn btn-sm btn-default"
            :to="{ name: 'new-notebook' }"
          >
            Create New
          </router-link>
        </div>
      </div>
    </div>

    <div class="table-responsive table-sm" id="printMe">
      <base-table
        thead-classes="thead-light"
        :data="items"
        @row-click="onSelectNote"
      >
        <template v-slot:columns>
          <th class="col-1">No</th>
          <th>Title</th>
          <th class="col-2">Create Date</th>
          <th class="col-2">Updated Date</th>
          <th class="col-1">Action</th>
        </template>

        <template v-slot:default="row">
          <th scope="row" class="align-middle col-1">
            <router-link
              :to="{
                name: 'edit-notebook',
                params: { notebookId: row.item.id },
              }"
              ><span class="font-weight-700">
                {{ row.item.id }}
              </span></router-link
            >
          </th>
          <td
            class="truncate"
            data-toggle="tooltip"
            data-placement="left"
            :title="row.item.description"
          >
            {{ row.item.title }}
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
              @click="onEditNotebook(row.item.id)"
              type="default"
              size="sm"
            >
              <i class="fas fa-pencil-alt"></i>
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
  <div class="row mt-auto">
    <div class="col-lg-6 form-group">
      <label class="form-control-label"
        >Description Of Note: <span>{{ selectedNoteBook.id }}</span></label
      >
      <textarea
        class="form-control form-control-alternative"
        rows="5"
        readonly="true"
        v-model="selectedNoteBook.description"
      ></textarea>
    </div>
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
      <h4 class="heading mt-4">Are you sure, To delete this Note Book?</h4>
      <p>Click OK to delete</p>
    </div>

    <template v-slot:footer>
      <base-button @click="deleteNotebook" type="white">Ok, Got it</base-button>
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
import NoteBookService from "../../services/notebook.service";
import moment from "moment";

export default {
  name: "note-book-table",
  data() {
    return {
      items: [],
      isLoading: true,
      deleteAlert: false,
      selectedNoteBook: "",
    };
  },
  methods: {
    onSelectNote(value) {
      this.selectedNoteBook = value;
    },
    getAllNotebooks(options) {
      this.isLoading = true;
      NoteBookService.getNoteBooks(options).then(
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
    onDeleteClick(notebookId) {
      this.deleteAlert = true;
      this.isDeletingId = notebookId;
    },
    deleteNotebook() {
      NoteBookService.deleteNoteBook(this.isDeletingId).then(() => {
        this.deleteAlert = false;
        this.getAllNotebooks();
      });
    },
    onEditNotebook(notebookId) {
      this.$router.push({
        name: "edit-notebook",
        params: { notebookId: notebookId },
      });
    },
  },
  created() {
    this.moment = moment;
  },
  mounted() {
    this.getAllNotebooks();
  },
};
</script>
<style scoped>
.truncate {
  max-width: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
