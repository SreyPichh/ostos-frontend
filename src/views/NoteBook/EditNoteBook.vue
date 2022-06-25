<template>
  <div v-if="isLoading" class="d-flex justify-content-center mt-9">
    <scaling-squares-spinner
      :animation-duration="1250"
      :size="65"
      :color="'#ff1d5e'"
    />
  </div>
  <div class="row mb-3" v-if="!isLoading">
    <div class="col-xl-12 order-xl-1">
      <card shadow type="secondary" bodyClasses="pb-0">
        <template v-slot:header>
          <div class="bg-white border-0">
            <div class="row justify-content-between">
              <div class="col">
                <h3 class="mb-0">NoteBook Info</h3>
              </div>
            </div>
          </div>
        </template>

        <form>
          <div class="row">
            <div class="col-lg-6">
              <base-input
                label="Title"
                input-classes="form-control-alternative"
                v-model="notebook.title"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12 form-group">
              <label class="form-control-label">Description</label>
              <textarea
                class="form-control form-control-alternative"
                rows="5"
                v-model="notebook.description"
              ></textarea>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
  <div class="float-right">
    <button
      @click.prevent="updateNoteBook()"
      type="button"
      class="btn btn-default"
    >
      Update
    </button>
  </div>
</template>

<script>
import NoteBookService from "../../services/notebook.service";

export default {
  components: {},
  name: "edit-notebook",
  mounted() {
    this.isLoading = true;
    this.notebookId = this.$route.params.notebookId;
    NoteBookService.getNoteBookById(this.notebookId).then((item) => {
      this.notebook = item.data.data;
      this.isLoading = false;
    });
  },
  data() {
    return {
      isLoading: true,
      notebook: {},
    };
  },
  methods: {
    updateNoteBook() {
      NoteBookService.updateNoteBook(this.notebookId, this.notebook).then(
        () => {
          this.$router.push("/notebooks");
        },
        (error) => {
          alert("error to get data", error);
        }
      );
    },
  },
};
</script>
