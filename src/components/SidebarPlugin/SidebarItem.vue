<template>
  <li class="nav-item">
    <span v-if="isDisabled" class="nav-link"
      ><i :class="link.icon"></i>
      <span class="text-white">{{ link.name }} (Fixing...)</span>
    </span>
    <router-link
      v-if="!isDisabled"
      :to="link.path"
      @click="linkClick"
      class="nav-link"
      :target="link.target"
      :href="'#' + link.path"
    >
      <i :class="link.icon"></i>
      <span class="nav-link-text text-white">{{ link.name }}</span>
    </router-link>
  </li>
</template>
<script>
export default {
  name: "sidebar-item",
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    link: {
      type: Object,
      default: () => {
        return {
          name: "",
          path: "",
          children: [],
        };
      },
      description:
        "Sidebar link. Can contain name, path, icon and other attributes. See examples for more info",
    },
  },
  inject: {
    autoClose: {
      default: true,
    },
  },
  data() {
    return {
      children: [],
      collapsed: true,
    };
  },
  methods: {
    linkClick() {
      if (
        this.autoClose &&
        this.$sidebar &&
        this.$sidebar.showSidebar === true
      ) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
};
</script>
<style scoped></style>
