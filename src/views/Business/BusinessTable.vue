<template>
  <div class="card" v-if="responseAvailable">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col d-flex">
          <h3 class="mb-0">
            All Business : <span class="text-muted">{{ items.length }}</span>
          </h3>
        </div>
        <div class="col text-right">
          <router-link
            class="btn btn-sm btn-primary"
            :to="{ name: 'new-business' }"
          >
            Create New
          </router-link>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <base-table thead-classes="thead-light" :data="items">
        <template v-slot:columns>
          <th>ID</th>
          <th>Name</th>
          <th>Logo</th>
          <th>Phone Number</th>
          <th>Created Date</th>
          <th>Updated Date</th>
          <th>Action</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            <a href="#!">{{ row.item.id }}</a>
          </th>
          <td>
            {{ row.item.name }}
          </td>
          <td>LOGO</td>
          <td>
            {{ row.item.phone_number }}
          </td>
          <td>
            {{ row.item.createdAt }}
          </td>
          <td>
            {{ row.item.updatedAt }}
          </td>
          <td>
            <base-button type="default" size="sm"
              ><i class="fas fa-pencil-alt"></i
            ></base-button>
            <base-button type="danger" size="sm"
              ><i class="fas fa-trash"></i
            ></base-button>
          </td>
        </template>
      </base-table>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
import BusinessService from "../../services/business.service";
export default {
  name: "business-table",
  data() {
    return {
      responseAvailable: false,
    };
  },
  mounted() {
    BusinessService.getBusiness().then(
      (res) => {
        this.items = res.data.data;
        this.responseAvailable = true;
      },
      (error) => {
        alert("error to get data", error);
      }
    );
  },
  // async created() {
  //   try {
  //     await axios
  //       .get("https://ostos-backend.herokuapp.com/api/v1/businesses")
  //       .then((res) => {
  //         this.items = res.data.data;
  //         this.responseAvailable = true;
  //       });
  //   } catch (error) {
  //     alert("error to get data");
  //   }
  // },
  methods: {},
};
</script>
<style></style>
