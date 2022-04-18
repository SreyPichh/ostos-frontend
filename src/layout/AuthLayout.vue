<template>
  <div class="main-content bg-default">
    <div class="text-center">
      <img
        src="img/brand/ori_logo.svg"
        width="250"
        height="250"
        alt="ostos-sticker"
      />
    </div>
    <!-- Page content -->
    <div class="container mt--5 pb-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "auth-layout",
  data() {
    return {
      year: new Date().getFullYear(),
      showMenu: false,
    };
  },
};
</script>
<style></style>
