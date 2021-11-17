<template>
  <Form
    class="form"
    @submit="submit"
    :validation-schema="schema"
    v-slot="{ errors }"
  >
    <div class="card">
      <div class="card__header">
        <div class="card__title">Change Password</div>
      </div>
      <div class="card__body">
        <div class="form__group form__group--required">
          <label class="form__label" for="passwordOld"> Old Password </label>
          <Field
            type="password"
            name="passwordOld"
            id="passwordOld"
            class="form__element"
            :class="{ 'is-invalid': errors.passwordOld }"
          />
        </div>

        <div class="form__group form__group--required">
          <label class="form__label" for="password">New Password</label>
          <Field
            type="password"
            name="password"
            id="password"
            class="form__element"
            :class="{ 'is-invalid': errors.password }"
          />
        </div>

        <div class="form__group form__group--required">
          <label class="form__label" for="passwordConfirm">
            Confirm New Password
          </label>
          <Field
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            class="form__element"
            :class="{ 'is-invalid': errors.passwordConfirm }"
          />
        </div>
      </div>

      <div class="card__footer">
        <button :disabled="isSubmited" class="btn btn--blue" type="submit">
          Update
        </button>
      </div>
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import AuthService from "@/servises/auth";

interface IForm {
  passwordOld: string;
  password: string;
  passwordConfirm: string;
}

export default defineComponent({
  components: {
    Form,
    Field,
  },
  setup() {
    const store = useStore();

    const schema = Yup.object().shape({
      passwordOld: Yup.string().required("Field is required"),
      password: Yup.string().required("Field is required"),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    });

    const isSubmited = ref(false);

    return {
      schema,
      isSubmited,
      user: computed(() => store.state.authModule.user),
    };
  },
  methods: {
    submit(form: IForm) {
      this.isSubmited = true;
      AuthService.ChangePassword(
        form.passwordOld,
        this.user.email,
        form.password
      )
        .then(() => {
          this.isSubmited = false;
        })
        .catch(() => {
          this.isSubmited = false;
        });
    },
  },
});
</script>
