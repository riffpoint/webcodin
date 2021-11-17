<template>
  <div class="admin" :class="{ 'admin--sidebar-hidden': sidebarIsHidden }">
    <aside
      class="sidebar"
      :class="{
        'sidebar--hidden': sidebarIsHidden,
        'sidebar--mobile-hidden': sidebarMobileIsHidden,
      }"
    >
      <div class="sidebar__header">
        <a class="sidebar__header__logo" href="#" routerLink="/admin/dashboard">
          <img
            src="@/assets/images/site/logo-sidebar.png"
            alt="RiffPoint"
            title="RiffPoint"
          />
        </a>

        <button
          @click="toggleSidebar"
          type="button"
          class="sidebar__header__btn"
        >
          <i class="las la-bars"></i>
        </button>

        <button
          @click="toggleMobileSidebar"
          type="button"
          class="sidebar__header__btn sidebar__header__btn--mobile"
        >
          <i class="las la-bars"></i>
        </button>
      </div>
      <nav class="sidebar__nav">
        <ul>
          <li>
            <router-link
              to="/admin"
              exact-active-class="sidebar__nav__item--active"
              class="sidebar__nav__item"
            >
              <span>
                <i
                  class="
                    las
                    la-desktop
                    sidebar__nav__item__icon sidebar__nav__item__icon--left
                  "
                ></i>
                Dashboard
              </span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/users" custom v-slot="{ isActive }">
              <a
                href="#"
                class="sidebar__nav__item"
                :class="{ 'sidebar__nav__item--active': isActive }"
                @click="toggleSubMenu($event)"
              >
                <span>
                  <i
                    class="
                      las
                      la-user-friends
                      sidebar__nav__item__icon sidebar__nav__item__icon--left
                    "
                  ></i>
                  <i
                    class="
                      las
                      la-angle-right
                      sidebar__nav__item__icon sidebar__nav__item__icon--right
                    "
                  ></i>
                  Users
                </span>
              </a>
            </router-link>

            <div class="sidebar__nav__submenu">
              <ul>
                <li>
                  <router-link
                    to="/admin/users"
                    exact-active-class="sidebar__nav__submenu__item--active"
                    class="sidebar__nav__submenu__item"
                  >
                    <span>All Users</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <router-link to="/admin/posts/" custom v-slot="{ isActive }">
              <a
                href="#"
                class="sidebar__nav__item"
                :class="{ 'sidebar__nav__item--active': isActive }"
                @click="toggleSubMenu($event)"
              >
                <span>
                  <i
                    class="
                      las
                      la-sticky-note
                      sidebar__nav__item__icon sidebar__nav__item__icon--left
                    "
                  ></i>
                  <i
                    class="
                      las
                      la-angle-right
                      sidebar__nav__item__icon sidebar__nav__item__icon--right
                    "
                  ></i>
                  Posts
                </span>
              </a>
            </router-link>

            <div class="sidebar__nav__submenu">
              <ul>
                <li>
                  <router-link
                    to="/admin/posts"
                    exact-active-class="sidebar__nav__submenu__item--active"
                    class="sidebar__nav__submenu__item"
                  >
                    <span>All Posts</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    to="/admin/posts/add"
                    exact-active-class="sidebar__nav__submenu__item--active"
                    class="sidebar__nav__submenu__item"
                  >
                    <span>Add Post</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </aside>

    <div class="admin__content">
      <header class="header">
        <div class="container-fluid">
          <button
            @click="toggleMobileSidebar"
            type="button"
            class="header__sidebar-toggle"
          >
            <i class="la la-bars"></i>
          </button>

          <div v-click-outside="closeUserNav" class="header__user">
            <div
              @click="toggleUserNav"
              class="header__user__avatar"
              :style="{
                backgroundImage: `url(${
                  user?.photoURL ? user.photoURL : noImage
                })`,
              }"
            ></div>

            <nav
              class="header__user__nav"
              :class="{ 'header__user__nav--visible': !userNavIsHidden }"
            >
              <div class="header__user__nav__header">
                <div
                  class="header__user__nav__header__avatar"
                  :style="{
                    backgroundImage: `url(${
                      user?.photoURL ? user.photoURL : noImage
                    })`,
                  }"
                ></div>
                <div class="header__user__nav__header__info">
                  <div class="name"></div>
                  <a :href="`mailto:${user?.email}`">{{ user?.email }}</a>
                </div>
              </div>
              <ul>
                <li>
                  <router-link
                    class="header__user__nav__item"
                    to="/admin/profile"
                  >
                    <div class="header__user__nav__item__icon">
                      <i class="las la-user"></i>
                    </div>
                    My Profile
                  </router-link>
                </li>
                <li>
                  <router-link
                    class="header__user__nav__item"
                    :to="`/admin/posts/${user?.uid}`"
                  >
                    <div class="header__user__nav__item__icon">
                      <i class="la la-sticky-note-o"></i>
                    </div>
                    My Posts
                  </router-link>
                </li>
              </ul>
              <div class="header__user__nav__footer">
                <button @click="signOut" class="btn btn--red" type="button">
                  LogOut
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div class="admin__content__inner">
        <div v-if="!loading" class="container-fluid">
          <router-view />
        </div>
        <div v-if="loading" class="loading">
          <i class="las la-spinner la-pulse la-6x la-fw"></i>
        </div>
      </div>

      <footer class="footer">
        <div class="container-fluid">
          &copy; 2020. Riff Point. All rights reserved.
        </div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { mapActions, useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = ref(true);
    const userNavIsHidden = ref(true);
    const sidebarIsHidden = ref(false);
    const sidebarMobileIsHidden = ref(true);

    router.afterEach(() => {
      userNavIsHidden.value = true;
    });

    Promise.all([
      store.dispatch("usersModule/GetAll"),
      store.dispatch("postsModule/GetAll"),
    ]).then(() => {
      loading.value = false;
    });

    return {
      user: computed(() => store.state.authModule.user),
      noImage: computed(() =>
        require("@/assets/images/site/no-image-white.svg")
      ),
      loading,
      userNavIsHidden,
      sidebarIsHidden,
      sidebarMobileIsHidden,
      router,
    };
  },
  methods: {
    ...mapActions(["authModule/SignOut"]),
    signOut() {
      this["authModule/SignOut"]().then(() => {
        this.router.push("/auth/sign-in");
      });
    },
    toggleSidebar() {
      this.sidebarIsHidden = !this.sidebarIsHidden;
    },
    toggleMobileSidebar() {
      this.sidebarMobileIsHidden = !this.sidebarMobileIsHidden;
    },
    toggleUserNav() {
      this.userNavIsHidden = !this.userNavIsHidden;
    },
    closeUserNav() {
      this.userNavIsHidden = true;
    },
    toggleSubMenu(e: Event) {
      e.preventDefault();

      const target = e.currentTarget as Element;
      const obj = target.classList;
      const openClass = "sidebar__nav__item--active";

      if (obj.contains(openClass)) {
        obj.remove(openClass);
      } else {
        obj.add(openClass);
      }
    },
  },
});
</script>
