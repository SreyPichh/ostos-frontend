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
@font-face {
  font-family: "kh-content";
  src: local("kh-content"), url(./fonts/kh-content.ttf) format("truetype");
}

@font-face {
  font-family: "trebuc";
  src: local("trebuc"), url(./fonts/trebuc.ttf) format("truetype");
  unicode-range: U+0B02-CD;
}

body {
  font-family: "kh-content", sans-serif !important;
  font-size: 16px !important;
}

.delete-icon:hover {
  color: red;
  cursor: pointer;
}

.my-favourite:hover {
  cursor: pointer;
  transform: translateY(-1px);
}
</style>
