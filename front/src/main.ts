import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "@fontsource/barlow-condensed/latin-800.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@/assets/main.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import { router } from "@/router";
import { i18n } from "@/i18n";
import { setUnauthorizedHandler } from "@/api/http";
import { useAuthStore } from "@/features/auth/auth.store";
import { ROUTE_NAMES } from "@/router/routes.constants";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia).use(router).use(i18n);

setUnauthorizedHandler(() => {
  const auth = useAuthStore();
  if (!auth.user) return;
  auth.clear();
  router.push({ name: ROUTE_NAMES.login, query: { redirect: router.currentRoute.value.fullPath } });
});

app.mount("#app");
