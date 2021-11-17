<template>
  <Alert />
  <div v-if="!loading">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import firebase from "firebase/app";
import "firebase/auth";
import Alert from "@/components/alert/index.vue";

export default defineComponent({
  components: {
    Alert,
  },
  setup() {
    const store = useStore();
    const loading = ref(true);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));

        if (user.emailVerified) {
          store.dispatch("authModule/GetCurrentUser", user.uid).then(() => {
            loading.value = false;
          });
        } else {
          loading.value = false;
        }
      } else {
        loading.value = false;
        localStorage.setItem("user", "null");
        router.push("/auth/sign-in");
      }
    });

    return {
      loading,
    };
  },
});
</script>
