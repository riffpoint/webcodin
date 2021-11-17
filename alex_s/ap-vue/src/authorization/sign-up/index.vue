<template>
  <div class="content__title">Sign Up</div>

  <Form
    class="form"
    @submit="signUp"
    :validation-schema="schema"
    v-slot="{ errors }"
  >
    <div class="form__group form__group--required">
      <label class="form__label" for="email">Email</label>

      <Field
        type="text"
        name="email"
        id="email"
        autocomplete="off"
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
        autocomplete="off"
        class="form__element"
        :class="{ 'is-invalid': errors.password }"
      />
    </div>

    <div class="form__group form__group--required">
      <label class="form__label" for="confirmPassword">Confirm Password</label>
      <Field
        type="password"
        name="confirmPassword"
        id="confirmPassword"
        autocomplete="off"
        class="form__element"
        :class="{ 'is-invalid': errors.confirmPassword }"
      />
    </div>

    <div class="form__submit form__submit--center">
      <div class="btn-group">
        <button :disabled="isSubmited" class="btn btn--red" type="submit">
          Sign Up
        </button>

        <router-link class="btn btn--cancel" to="/auth/sign-in">
          Cancel
        </router-link>
      </div>
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
  confirmPassword: string;
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
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    });
    const isSubmited = ref(false);

    return {
      schema,
      isSubmited,
    };
  },
  methods: {
    ...mapActions(["authModule/SignUp"]),
    signUp(form: IForm) {
      this.isSubmited = true;

      this["authModule/SignUp"]({
        email: form.email,
        password: form.password,
      })
        .then(() => {
          this.isSubmited = false;
          router.push("/auth/verify-email-address");
        })
        .catch(() => {
          this.isSubmited = false;
        });
    },
  },
});
</script>
