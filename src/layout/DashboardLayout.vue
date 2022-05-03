<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar
      :background-color="sidebarBackground"
      short-title="Argon"
      title="Argon"
    >
      <template v-slot:links>
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'ni ni-tv-2 text-red',
            path: '/dashboard',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Businesses',
            icon: 'ni ni-planet text-red',
            path: '/businesses',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Invoice',
            icon: 'fa fa-file-invoice-dollar text-red',
            path: '/invoices',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Quote',
            icon: 'fa fa-file-invoice text-red',
            path: '/quotes',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Reciept',
            icon: 'fa fa-file-alt text-red',
            path: '/receipts',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Product',
            icon: 'ni ni-archive-2 text-red',
            path: '/products',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Employee',
            icon: 'fa fa-users text-red',
            path: '/employees',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Profile',
            icon: 'ni ni-single-02 text-red',
            path: '/profile',
          }"
        />
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <div @click="toggleSidebar">
        <!-- your content here -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
import DashboardNavbar from "./DashboardNavbar.vue";

export default {
  components: {
    DashboardNavbar,
  },
  data() {
    return {
      sidebarBackground: "red", //vue|blue|orange|green|red|primary
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
<style lang="scss"></style>
