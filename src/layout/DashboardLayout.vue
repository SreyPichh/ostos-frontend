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
            icon: 'ni ni-tv-2 text-white',
            path: '/dashboard',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Businesses',
            icon: 'ni ni-planet text-white',
            path: '/businesses',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Invoice',
            icon: 'fa fa-file-invoice-dollar text-white',
            path: '/invoices',
          }"
        />
        <sidebar-item
          :isDisabled="true"
          :link="{
            name: 'Quote',
            icon: 'fa fa-file-invoice text-white',
            path: '/quotes',
          }"
        />
        <sidebar-item
          :isDisabled="true"
          :link="{
            name: 'Reciept',
            icon: 'fa fa-file-alt text-white',
            path: '/receipts',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Product',
            icon: 'ni ni-archive-2 text-white',
            path: '/products',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Customer',
            icon: 'fa fa-user-secret text-white',
            path: '/customers',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Employee',
            icon: 'fa fa-restroom text-white',
            path: '/employees',
          }"
        />
        <sidebar-item
          :isDisabled="true"
          :link="{
            name: 'Payment',
            icon: 'fa fa-cash-register text-white',
            path: '/payments',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Purchase',
            icon: 'fa fa-money-check-alt text-white',
            path: '/purchases',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Note Book',
            icon: 'fa fa-clipboard text-white',
            path: '/notebooks',
          }"
        />
        <sidebar-item
          :isDisabled="true"
          :link="{
            name: 'User',
            icon: 'fa fa-users text-white',
            path: '/users',
          }"
        />
        <sidebar-item
          :link="{
            name: 'Profile',
            icon: 'ni ni-single-02 text-white',
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
