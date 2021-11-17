<template>
  <div class="content__title">Reset Password</div>

  <Form
    class="form"
    @submit="sendPasswordResetEmail"
    :validation-schema="schema"
    v-slot="{ errors }"
  >
    <div class="form__description">
      Please enter your email address to request a password reset.
    </div>

    <div class="form__group form__group--required">
      <Field
        type="text"
        name="email"
        id="email"
        class="form__element"
        :class="{ 'is-invalid': errors.email }"
      />
    </div>

    <div class="form__submit form__submit--center">
      <button :disabled="isSubmited" class="btn btn--red" type="submit">
        Reset Password
      </button>
    </div>

    <div class="form__description">
      Go back to? <router-link to="/auth/sign-in">Sign In</router-link>
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import AuthService from "@/servises/auth";
import router from "@/router";

import { Form, Field } from "vee-validate";
import * as Yup from "yup";

interface IForm {
  email: string;
}

export default defineComponent({
  components: {
    Form,
    Field,
  },
  setup() {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
    });
    const isSubmited = ref(false);

    return {
      schema,
      isSubmited,
    };
  },
  methods: {
    sendPasswordResetEmail(form: IForm) {
      this.isSubmited = true;

      AuthService.ForgotPassword(form.email)
        .then(() => {
          this.isSubmited = false;
          router.push("/auth/sign-in");
        })
        .catch(() => {
          this.isSubmited = false;
        });
    },
  },
});
</script>
