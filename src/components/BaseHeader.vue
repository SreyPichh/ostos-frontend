<template>
  <div class="header" :class="{ [`bg-${type}`]: type }">
    <div class="container-fluid test">
      <div class="header-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "base-header",
  props: {
    type: {
      type: String,
      default: "header-color",
      description: "Header background type",
    },
  },
};
</script>
<style>
.bg-header-color {
  background-color: #e54e49;
}
</style>
