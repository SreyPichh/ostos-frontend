import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ArgonDashboard from "./plugins/argon-dashboard";
import "element-plus/lib/theme-chalk/index.css";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "./store";
import Vuex from "vuex";
import setupInterceptors from "./services/setupInterceptors";
import VCalendar from "v-calendar";
import "v-calendar/dist/style.css";

const appInstance = createApp(App);
appInstance.use(router);
appInstance.use(store);
appInstance.use(ArgonDashboard);
appInstance.use(VueAxios, axios);
appInstance.use(Vuex);
appInstance.use(VCalendar);
setupInterceptors(store);

appInstance.mount("#app");
