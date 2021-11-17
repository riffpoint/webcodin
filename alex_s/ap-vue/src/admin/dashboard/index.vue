<template>
  <div class="dashboard">
    <h2 class="page-title">Dashboard</h2>

    <div class="dashboard__activity">
      <div class="dashboard__activity__header">Activity</div>
      <div class="dashboard__activity__body">
        <div class="row">
          <div class="col">
            <div class="dashboard__activity__item">
              <div class="dashboard__activity__item__icon">
                <i class="las la-user-friends"></i>
              </div>
              <div class="dashboard__activity__item__title">Users</div>
              <div class="dashboard__activity__item__description">
                <span>{{ users ? users.length : 0 }}</span>
                new registrations
              </div>
            </div>
          </div>
          <div class="col">
            <div class="dashboard__activity__item">
              <div class="dashboard__activity__item__icon">
                <i class="las la-sticky-note"></i>
              </div>
              <div class="dashboard__activity__item__title">Posts</div>
              <div class="dashboard__activity__item__description">
                <span>{{ posts ? posts.length : 0 }}</span>
                new posts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard__list">
      <div class="row">
        <div
          v-if="users.length"
          :class="{ 'col-md-6': posts.length, col: !posts.length }"
        >
          <div class="card">
            <div class="card__header">
              <div class="card__title">New Users</div>

              <div class="card__actions">
                <router-link
                  class="dashboard__list__view-all"
                  to="/admin/users"
                >
                  view all users
                </router-link>
              </div>
            </div>
            <div class="card__body">
              <template v-for="(user, i) of users" :key="user.uid">
                <div v-if="i < 5" class="dashboard__list__item">
                  <div class="dashboard__list__item__avatar">
                    <div
                      class="dashboard__list__item__avatar__img"
                      :style="{
                        backgroundImage: `url(${
                          user.photoURL ? user.photoURL : noImage
                        })`,
                      }"
                    ></div>
                  </div>
                  <div class="dashboard__list__item__info">
                    <div class="dashboard__list__item__title">
                      {{ user.name }} {{ user.surname }}
                    </div>
                    <div class="dashboard__list__item__content">
                      <span class="dashboard__list__item__description">{{
                        user.occupation
                      }}</span>
                      <span v-if="user.occupation"> | </span>
                      <span class="dashboard__list__item__date">{{
                        getDate(user.createdAt)
                      }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div
          v-if="posts.length"
          :class="{ 'col-md-6': users.length, col: !users.length }"
        >
          <div class="card">
            <div class="card__header">
              <div class="card__title">New Posts</div>

              <div class="card__actions">
                <router-link
                  class="dashboard__list__view-all"
                  to="/admin/posts"
                >
                  view all posts
                </router-link>
              </div>
            </div>
            <div class="card__body">
              <template v-for="(post, i) of posts" :key="post.uid">
                <div v-if="i < 5" class="dashboard__list__item">
                  <div class="dashboard__list__item__info">
                    <div class="dashboard__list__item__title">
                      {{ post.title }}
                    </div>
                    <div>
                      <span
                        v-if="getNameOfPostOwner(post.owner)"
                        class="dashboard__list__item__description"
                        >by <span>{{ getNameOfPostOwner(post.owner) }}</span> |
                      </span>
                      <span class="dashboard__list__item__date">{{
                        getDate(post.createdAt.toDate())
                      }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { User } from "@/servises/users/user";
import moment from "moment";

export default defineComponent({
  setup() {
    const store = useStore();

    return {
      noImage: computed(() =>
        require("@/assets/images/site/no-image-white.svg")
      ),
      users: computed(() => store.state.usersModule.users),
      posts: computed(() => store.state.postsModule.posts),
    };
  },
  methods: {
    getDate(date: string): string {
      return moment(date).format("MMMM DD, yyyy");
    },
    getNameOfPostOwner(ownerId: string): string {
      let name = "";

      this.users.map((user: User) => {
        if (user.uid === ownerId) {
          name = `${user.name} ${user.surname}`;
        }
      });

      return name;
    },
  },
});
</script>
