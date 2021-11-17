<template>
  <div class="form">
    <div class="formGroup" v-if="user">
      <p class="text-center">
        We have sent a confirmation email to <strong>{{ user.email }}</strong
        >.
      </p>
      <p class="text-center">
        Please check your email and click on the link to verfiy your email
        address.
      </p>
    </div>

    <div class="form__submit form__submit--center">
      <button
        class="btn btn--red"
        type="button"
        @click="authService.SendVerificationMail()"
      >
        Resend Verification Email
      </button>
    </div>

    <div class="form__description form__description--center">
      Go back to? <router-link to="/auth/sign-in">Sign in</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AuthService from "@/servises/auth";

export default defineComponent({
  setup() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const authService = AuthService;

    return {
      user,
      authService,
    };
  },
});
</script>
