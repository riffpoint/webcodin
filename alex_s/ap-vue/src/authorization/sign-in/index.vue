<template>
  <div class="content__title">Sign In To Admin</div>

  <Form
    class="form"
    @submit="signIn"
    :validation-schema="schema"
    v-slot="{ errors }"
  >
    <div class="form__group form__group--required">
      <label class="form__label" for="email">Email</label>
      <Field
        type="text"
        name="email"
        id="email"
        class="form__element"
        :class="{ 'is-invalid': errors.email }"
      />
    </div>

    <div class="form__group form__group--required">
      <label class="form__label" for="password">Password</label>
      <Field
        type="password"
        name="password"
        id="password"
        class="form__element"
        :class="{ 'is-invalid': errors.password }"
      />
    </div>

    <div class="form__description form__description--right">
      <router-link to="/auth/forgot-password">Forgot Password</router-link>
    </div>

    <div class="form__submit form__submit--center">
      <button :disabled="isSubmited" class="btn btn--red" type="submit">
        Sign In
      </button>
    </div>

    <div class="form__description form__description--center">
      Don't have an account yet?
      <router-link to="/auth/sign-up">Sign Up</router-link>
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { mapActions } from "vuex";
import router from "@/router";

import { Form, Field } from "vee-validate";
import * as Yup from "yup";

interface IForm {
  email: string;
  password: string;
}

export default defineComponent({
  components: {
    Form,
    Field,
  },
  setup() {
    const schema = Yup.object().shape({
      email: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
    });
    const isSubmited = ref(false);

    return {
      schema,
      isSubmited,
    };
  },
  methods: {
    ...mapActions(["authModule/SignIn"]),
    signIn(form: IForm) {
      this.isSubmited = true;

      this["authModule/SignIn"]({
        email: form.email,
        password: form.password,
      })
        .then(() => {
          this.isSubmited = false;
          router.push("/admin");
        })
        .catch(() => {
          this.isSubmited = false;
        });
    },
  },
});
</script>
