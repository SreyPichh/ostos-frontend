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
          <h4 class="mb-0">Activity List</h4>
        </div>
      </div>
    </div>

    <div class="table-responsive" id="printMe">
      <base-table thead-classes="thead-light" :data="items">
        <template v-slot:columns>
          <th>No</th>
          <th>Action Label</th>
          <th>Action ID</th>
          <th>Action Type</th>
          <th>Create Date</th>
        </template>

        <template v-slot:default="row">
          <th scope="row" class="align-middle">
            {{ row.item.id }}
          </th>
          <td>
            {{ row.item.action_label }}
          </td>
          <td>{{ row.item.action_id }}</td>
          <td>
            <span
              class="badge badge-pill badge-md"
              :class="`badge-${
                row.item.type_action === 'Post'
                  ? 'default'
                  : row.item.type_action === 'Update'
                  ? 'info'
                  : 'danger'
              }`"
              >{{ row.item.type_action }}</span
            >
          </td>
          <td>
            {{
              moment(row.item.created_at).format("DD/MM/YYYY [&nbsp;] HH:mm")
            }}
          </td>
        </template>
      </base-table>
    </div>
    <div v-if="items.length == 0" class="text-center p-5">Empty Data</div>
  </div>
</template>
<script>
import ActivityService from "../../services/activity.service";
import moment from "moment";

export default {
  name: "activity-table",
  data() {
    return {
      isLoading: true,
    };
  },
  methods: {},
  created() {
    this.moment = moment;
  },
  mounted() {
    this.isLoading = true;
    ActivityService.getActivities().then(
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
};
</script>
<style></style>
