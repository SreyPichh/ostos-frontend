<template>
  <base-nav
    class="navbar-top navbar-dark"
    id="navbar-main"
    :show-toggle-button="false"
    expand
  >
    <ul
      v-if="currentUser"
      class="navbar-nav align-items-center d-none d-md-flex justify-content-end"
    >
      <li class="nav-item dropdown">
        <base-dropdown class="nav-link pr-0">
          <template v-slot:title>
            <div class="media profile-toggle align-items-center">
              <span class="avatar avatar-sm rounded-circle">
                <img
                  alt="Image placeholder"
                  src="img/theme/team-4-800x800.jpg"
                />
              </span>
              <div class="media-body ml-2 d-none d-lg-block">
                <span class="mb-0 text-sm font-weight-bold">
                  {{ currentUser.name }}
                </span>
              </div>
            </div>
          </template>
          <div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">Welcome!</h6>
          </div>
          <router-link to="/profile" class="dropdown-item">
            <i class="ni ni-single-02"></i>
            <span>My profile</span>
          </router-link>
          <router-link to="/profile" class="dropdown-item">
            <i class="ni ni-calendar-grid-58"></i>
            <span>Activity</span>
          </router-link>
          <div class="dropdown-divider"></div>
          <router-link to="#" @click.prevent="logOut" class="dropdown-item">
            <i class="ni ni-user-run"></i>
            <span>Logout</span>
          </router-link>
        </base-dropdown>
      </li>
    </ul>
  </base-nav>
</template>
<script>
import UserProfileService from "../services/userProfile.service";

export default {
  data() {
    return {
      activeNotifications: false,
      currentUser: null,
      showMenu: false,
      searchQuery: "",
    };
  },
  computed: {
    // showAdminBoard() {
    //   if (this.currentUser && this.currentUser["roles"]) {
    //     return this.currentUser["roles"].includes("ROLE_ADMIN");
    //   }
    //   return false;
    // },
  },
  mounted() {
    UserProfileService.getUserProfile().then((user) => {
      this.currentUser = user.data.data;
    });
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.profile-toggle:hover {
  cursor: pointer;
}
</style>
