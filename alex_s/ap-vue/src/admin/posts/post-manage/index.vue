<template>
  <div class="post-manage">
    <h2 class="page-title">Posts</h2>

    <Form
      class="form"
      @submit="submit"
      :validation-schema="schema"
      :initial-values="{
        title: post?.title,
        excerpt: post?.excerpt,
        description: post?.description,
      }"
      v-slot="{ errors }"
    >
      <div class="card">
        <div class="card__header">
          <div class="card__title">{{ title }}</div>
        </div>

        <div class="card__body">
          <div class="row">
            <div class="col-lg post-manage__image-wrap">
              <div class="form__upload">
                <div class="form__upload__image">
                  <div
                    class="form__upload__image__img"
                    :style="{
                      backgroundImage: `url(${
                        postImagePreview ? postImagePreview : postImage
                      })`,
                    }"
                  ></div>
                  <button
                    v-if="postImage || postImagePreview"
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
                    id="image"
                    accept=".png,.jpg"
                    @change="uploadPreview"
                  />
                  <label type="button" for="image" class="btn btn--gray">
                    Upload Image
                  </label>
                </div>
                <div
                  class="form__upload__description"
                  :class="{
                    'form__upload__description--danger': postImageOverSize,
                  }"
                >
                  Maximum upload image size: <span>1MB</span>
                </div>
              </div>
            </div>
            <div class="col-lg">
              <div class="form__group form__group--required">
                <label class="form__label" for="title">Title</label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  class="form__element"
                  :class="{ 'is-invalid': errors.title }"
                />
              </div>

              <div class="form__group">
                <label class="form__label" for="excerpt">Excerpt</label>
                <Field
                  type="text"
                  name="excerpt"
                  id="excerpt"
                  class="form__element"
                  :class="{ 'is-invalid': errors.excerpt }"
                />
              </div>
            </div>
          </div>
          <br />
          <div class="form__group form__group--required">
            <label class="form__label" for="description">Description</label>
            <Field name="description" v-slot="{ field }">
              <textarea
                v-bind="field"
                id="description"
                class="form__element"
                :class="{ 'is-invalid': errors.description }"
              ></textarea>
            </Field>
          </div>
        </div>

        <div class="card__footer">
          <div class="btn-group">
            <button :disabled="isSubmited" class="btn btn--blue" type="submit">
              {{ submitBtnTitle }}
            </button>
            <router-link to="/admin/posts" custom v-slot="{ href, navigate }">
              <a
                v-if="!isSubmited"
                :href="href"
                class="btn btn--cancel"
                @click="navigate"
              >
                Cancel
              </a>
              <button
                v-if="isSubmited"
                type="button"
                class="btn btn--cancel btn--disabled"
              >
                Cancel
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onUpdated, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore, mapActions } from "vuex";
import GlobalService from "@/servises/global";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

interface IForm {
  title: string;
  excerpt: string;
  description: string;
}

export default defineComponent({
  components: {
    Form,
    Field,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const schema = Yup.object().shape({
      title: Yup.string().required("Name is required"),
      excerpt: Yup.string().required("Surname is required"),
      description: Yup.string().required("Occupation is required"),
    });

    const title = ref("");
    const submitBtnTitle = ref("");

    const noImage = computed(() =>
      require("@/assets/images/site/no-image-post-white.svg")
    );
    const postImagePreview = ref();
    const postImage = ref();
    const postImageFile = ref();
    const postImageDelete = ref(false);
    const postImageOverSize = ref(false);
    const post = ref({
      uid: "",
      title: "",
      excerpt: "",
      description: "",
      photoURL: "",
      owner: "",
      createdAt: "",
    });

    const isSubmited = ref(false);

    const computedRouteName = () => {
      if (router.currentRoute.value.name === "post-add") {
        title.value = "Add New Post";
        submitBtnTitle.value = "Create";
        postImage.value = noImage.value;
      } else if (router.currentRoute.value.name === "post-edit") {
        title.value = "Edit Post";
        submitBtnTitle.value = "Update";
      }
    };

    onMounted(() => {
      computedRouteName();

      if (router.currentRoute.value.name === "post-edit") {
        const id = router.currentRoute.value.params.id;

        post.value = store.getters["postsModule/getPost"](id);

        postImage.value = post.value?.photoURL
          ? post.value.photoURL
          : noImage.value;
      }
    });
    onUpdated(computedRouteName);

    return {
      title,
      submitBtnTitle,
      noImage,
      postImagePreview,
      postImage,
      postImageFile,
      postImageDelete,
      postImageOverSize,
      isSubmited,
      schema,
      post,
      router,
    };
  },
  methods: {
    ...mapActions({
      addPost: "postsModule/AddPost",
    }),
    uploadPreview(e: Event) {
      const target = e.target as HTMLInputElement;
      this.postImageFile = target.files ? target.files[0] : null;
      this.postImageOverSize = false;
      const size = GlobalService.FormatBytes(this.postImageFile.size);

      if ((size.type === "Bytes" || size.type === "KB") && size.number < 1024) {
        const reader: FileReader = new FileReader();

        reader.onloadend = () => {
          this.postImagePreview = reader.result;
        };

        reader.readAsDataURL(this.postImageFile);
      } else {
        this.postImageOverSize = true;
        this.postImageFile = null;
        this.postImagePreview = this.noImage;
      }
    },
    clearImage() {
      if (this.post.photoURL) {
        this.postImageDelete = true;
      }

      this.postImageFile = null;
      this.postImagePreview = this.noImage;
    },
    submit(form: IForm) {
      this.isSubmited = true;

      this.post.title = form.title;
      this.post.excerpt = form.excerpt;
      this.post.description = form.description;

      const callback = () => {
        this.isSubmited = false;
        this.router.push("/admin/posts");
      };

      if (this.postImageFile) {
        this.addPost({
          post: this.post,
          file: this.postImageFile,
          type: "upload",
        }).then(callback);
      } else if (this.postImageDelete) {
        this.addPost({
          post: this.post,
          type: "delete",
        }).then(() => {
          this.postImageDelete = false;
          callback();
        });
      } else {
        this.addPost({
          post: this.post,
        }).then(callback);
      }
    },
  },
});
</script>
