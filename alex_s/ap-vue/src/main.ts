import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
import "./assets/scss/styles.scss";

const firebaseConfig = {
  apiKey: "AIzaSyDxyoI6Usn4MQ0wU-YlajjY39spm8OXc1o",
  authDomain: "ng-admin-panel.firebaseapp.com",
  databaseURL: "https://ng-admin-panel.firebaseio.com",
  projectId: "ng-admin-panel",
  storageBucket: "ng-admin-panel.appspot.com",
  messagingSenderId: "62974686332",
  appId: "1:62974686332:web:754ab5b8ff3b46607385f9",
};

const clickOutside = {
  beforeMount: (el: any, binding: any) => {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: (el: any) => {
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};

firebase.initializeApp(firebaseConfig);

createApp(App)
  .directive("click-outside", clickOutside)
  .use(store)
  .use(router)
  .mount("#app");
