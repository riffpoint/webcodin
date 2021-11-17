import { RouteRecordRaw } from "vue-router";

import Authorization from "./index.vue";
import SignIn from "./sign-in/index.vue";
import SignUp from "./sign-up/index.vue";
import VerifyEmail from "./verify-email/index.vue";
import ForgotPasswrod from "./forgot-password/index.vue";

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: "/auth",
    component: Authorization,
    children: [
      {
        path: "sign-in",
        name: "sing-in",
        component: SignIn,
      },
      {
        path: "sign-up",
        name: "sing-up",
        component: SignUp,
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: ForgotPasswrod,
      },
      {
        path: "verify-email-address",
        name: "verify-email-address",
        component: VerifyEmail,
      },
      {
        path: "",
        redirect: { name: "sing-in" },
      },
    ],
  },
];

export default authRoutes;
