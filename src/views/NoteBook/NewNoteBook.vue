<template>
  <base-header
    class="header pt-5 pt-lg-8 d-flex align-items-center"
  ></base-header>
  <div class="container-fluid mt--5 mb-5">
    <div class="row mb-3">
      <div class="col-xl-12 pl-0 order-xl-1">
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
        @click.prevent="createNotebook()"
        type="button"
        class="btn btn-default"
      >
        Create
      </button>
    </div>
  </div>
</template>

<script>
import NoteBookService from "../../services/notebook.service";

export default {
  components: {},
  name: "new-notebook",
  data() {
    return {
      notebook: {
        title: "",
        description: "",
      },
    };
  },
  mounted() {},
  methods: {
    createNotebook() {
      NoteBookService.createNoteBook(this.notebook).then(
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
