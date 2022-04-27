<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import EventBus from "./common/EventBus";
export default {
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
  mounted() {
    EventBus.on("logout", () => {
      this.logOut();
    });
  },
  beforeUnmount() {
    EventBus.remove("logout");
  },
};
</script>
<style>
.delete-icon:hover {
  color: red;
  cursor: pointer;
}

.my-favourite:hover {
  cursor: pointer;
  transform: translateY(-1px);
}
</style>
