<template>
  <Form
    class="form"
    @submit="submit"
    :validation-schema="schema"
    :initial-values="{
      name: user?.name,
      surname: user?.surname,
      email: user?.email,
      occupation: user?.occupation,
    }"
    v-slot="{ errors }"
  >
    <div class="card">
      <div class="card__header">
        <div class="card__title">General Information</div>
      </div>
      <div class="card__body">
        <div class="row">
          <div class="col profile__content__left">
            <div class="form__group">
              <div class="form__upload">
                <div class="form__upload__avatar">
                  <div
                    class="form__upload__avatar__img"
                    :style="{
                      backgroundImage: `url(${
                        userImagePreview ? userImagePreview : userImage
                      })`,
                    }"
                  ></div>
                  <button
                    v-if="userImage || userImagePreview"
                    type="button"
                    class="form__upload__image__clear"
                    @click="clearImage"
                  >
                    <i class="las la-times"></i>
                  </button>
                </div>
                <div class="form__upload__btn">
                  <input
                    type="file"
                    id="avatar"
                    :disabled="isSubmited"
                    accept=".png,.jpg"
                    @change="uploadPreview"
                  />
                  <label
                    type="button"
                    for="avatar"
                    class="btn btn--gray"
                    :class="{
                      'btn--disabled': isSubmited,
                    }"
                  >
                    Upload Avatar
                  </label>
                </div>
                <div class="form__upload__description">
                  Maximum upload image size: <span>1MB</span>
                </div>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="form__group form__group--required">
              <label class="form__label" for="name">Name</label>
              <Field
                type="text"
                name="name"
                id="name"
                class="form__element"
                :class="{ 'is-invalid': errors.name }"
              />
            </div>

            <div class="form__group form__group--required">
              <label class="form__label" for="surname">Surname</label>
              <Field
                type="text"
                name="surname"
                id="surname"
                class="form__element"
                :class="{ 'is-invalid': errors.surname }"
              />
            </div>

            <div class="form__group form__group--required">
              <label class="form__label" for="email">Email</label>
              <Field
                type="text"
                name="email"
                id="email"
                class="form__element"
                :class="{ 'is-invalid': errors.email }"
                :readonly="true"
              />
            </div>

            <div class="form__group form__group--required">
              <label class="form__label" for="occupation">Occupation</label>
              <Field
                type="text"
                name="occupation"
                id="occupation"
                class="form__element"
                :class="{ 'is-invalid': errors.occupation }"
              />
            </div>
          </div>
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
import { defineComponent, computed, ref } from "vue";
import { useStore, mapActions } from "vuex";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

import GlobalService from "@/servises/global";

interface IForm {
  email: string;
  name: string;
  surname: string;
  occupation: string;
}

export default defineComponent({
  components: {
    Form,
    Field,
  },
  setup() {
    const store = useStore();

    const noImage = computed(() =>
      require("@/assets/images/site/no-image-white.svg")
    );

    const schema = Yup.object().shape({
      email: Yup.string().required("Email is required"),
      name: Yup.string().required("Name is required"),
      surname: Yup.string().required("Surname is required"),
      occupation: Yup.string().required("Occupation is required"),
    });

    const user = computed(() => store.state.authModule.user);
    const userImagePreview = ref();
    const userImage = computed(() => {
      return user.value?.photoURL ? user.value.photoURL : noImage.value;
    });
    const userImageFile = ref();
    const userImageDelete = ref(false);
    const userImageOverSize = ref(false);
    const isSubmited = ref(false);

    return {
      schema,
      noImage,
      user,
      userImagePreview,
      userImage,
      userImageFile,
      userImageDelete,
      userImageOverSize,
      isSubmited,
    };
  },
  methods: {
    ...mapActions({
      getCurrentUser: "authModule/GetCurrentUser",
      editUser: "usersModule/EditUser",
    }),
    submit(form: IForm) {
      this.isSubmited = true;

      this.user.name = form.name;
      this.user.surname = form.surname;
      this.user.occupation = form.occupation;

      const callback = () => {
        this.getCurrentUser(this.user.uid)
          .then(() => {
            this.isSubmited = false;
          })
          .catch(() => {
            this.isSubmited = false;
          });
      };

      if (this.userImageFile) {
        this.editUser({
          user: this.user,
          file: this.userImageFile,
          type: "upload",
        }).then(callback);
      } else if (this.userImageDelete) {
        this.editUser({
          user: this.user,
          type: "delete",
        }).then(() => {
          this.userImageDelete = false;
          callback();
        });
      } else {
        this.editUser({
          user: this.user,
        }).then(callback);
      }
    },
    clearImage() {
      if (this.user.photoURL) {
        this.userImageDelete = true;
      }

      this.userImageFile = null;
      this.userImagePreview = this.noImage;
    },
    uploadPreview(e: Event) {
      const target = e.target as HTMLInputElement;
      this.userImageFile = target.files ? target.files[0] : null;
      this.userImageOverSize = false;
      const size = GlobalService.FormatBytes(this.userImageFile.size);

      if ((size.type === "Bytes" || size.type === "KB") && size.number < 1024) {
        const reader: FileReader = new FileReader();

        reader.onloadend = () => {
          this.userImagePreview = reader.result;
        };

        reader.readAsDataURL(this.userImageFile);
      } else {
        this.userImageOverSize = true;
        this.userImageFile = null;
        this.userImagePreview = this.noImage;
      }
    },
  },
});
</script>
