<template>
  <div class="profile">
    <h2 class="page-title">My Profile</h2>

    <div class="row">
      <div class="col profile__sidebar">
        <div class="profile__card">
          <div class="profile__card__header">
            <div class="profile__card__header__inner">
              <div class="profile__card__user-avatar">
                <div
                  class="profile__card__user-avatar__img"
                  :style="{
                    backgroundImage: `url(${
                      user?.photoURL ? user.photoURL : noImage
                    })`,
                  }"
                ></div>
              </div>
              <div class="profile__card__user-name">
                <span v-if="user && user.name">{{ user.name }}&nbsp;</span>
                <span v-if="user && user.surname">{{ user.surname }}</span>
              </div>
              <div
                v-if="user && user.occupation"
                class="profile__card__user-occupation"
              >
                {{ user.occupation }}
              </div>
            </div>
          </div>

          <nav class="profile__card__nav">
            <ul>
              <li>
                <a
                  @click="switchTab($event, 'GeneralInformation')"
                  class="profile__card__nav__item"
                  href="#"
                  :class="{
                    'profile__card__nav__item--active':
                      tabState === 'GeneralInformation',
                  }"
                >
                  <i class="fa fa-user-circle" aria-hidden="true"></i>
                  General Information
                </a>
              </li>
              <li>
                <a
                  @click="switchTab($event, 'ChangePassword')"
                  class="profile__card__nav__item"
                  href="#"
                  :class="{
                    'profile__card__nav__item--active':
                      tabState === 'ChangePassword',
                  }"
                >
                  <i class="fa fa-user-secret" aria-hidden="true"></i>
                  Change Password
                </a>
              </li>
              <li>
                <router-link
                  class="profile__card__nav__item"
                  :to="`/admin/posts/${user?.uid}`"
                >
                  <i class="fa fa-file-o" aria-hidden="true"></i>
                  My Posts
                </router-link>
              </li>
            </ul>
          </nav>

          <div class="profile__card__footer">
            <button class="btn btn--red" type="button" @click="signOut">
              Logout
            </button>
          </div>
        </div>
      </div>
      <div class="col-md profile__content">
        <UserForm v-show="tabState === 'GeneralInformation'" />

        <PasswordForm v-show="tabState === 'ChangePassword'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore, mapActions } from "vuex";

import UserForm from "./user-form/index.vue";
import PasswordForm from "./password-form/index.vue";

export default defineComponent({
  components: {
    UserForm,
    PasswordForm,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const tabState = ref("GeneralInformation");

    return {
      tabState,
      router,
      user: computed(() => store.state.authModule.user),
      noImage: computed(() =>
        require("@/assets/images/site/no-image-white.svg")
      ),
    };
  },
  methods: {
    ...mapActions(["authModule/SignOut"]),
    signOut() {
      this["authModule/SignOut"]().then(() => {
        this.router.push("/auth/sign-in");
      });
    },
    switchTab(e: Event, tabName: string) {
      e.preventDefault();

      this.tabState = tabName;
    },
  },
});
</script>
