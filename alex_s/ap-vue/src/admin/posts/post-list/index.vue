<template>
  <div class="posts">
    <h2 class="page-title">Posts</h2>

    <div class="posts__list">
      <div class="card">
        <div class="card__header">
          <div class="card__title">Users' Posts</div>
          <div class="card__actions">
            <router-link :to="`/admin/posts/add`" class="btn btn--blue">
              Add New Post
            </router-link>
          </div>
        </div>

        <div class="card__body">
          <div class="table">
            <div class="table__filters">
              <div class="table__display-per-page">
                Display per page:
                <select v-model="postsPerPage" @change="currentPage = 1">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div class="table__search">
                Search:
                <input
                  v-model="searchText"
                  type="text"
                  placeholder="Type keywords here..."
                />
              </div>
            </div>

            <div class="table__container">
              <table>
                <thead>
                  <tr>
                    <th
                      class="table__header__item table__header__item--sortable"
                      @click="sortPosts('title')"
                    >
                      Title
                      <sorting-btn :sortedBy="sortedBy['title']"></sorting-btn>
                    </th>
                    <th class="table__header__item">Created by</th>
                    <th class="table__header__item">Created</th>
                    <th
                      class="table__header__item table__header__item--actions"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="post of posts.slice(
                      postsPerPage * (currentPage - 1),
                      postsPerPage * currentPage
                    )"
                    :key="post.uid"
                  >
                    <td class="table__body__item">{{ post.title }}</td>
                    <td class="table__body__item">
                      {{ getNameOfPostOwner(post.owner) }}
                    </td>
                    <td class="table__body__item">
                      {{ getDate(post.createdAt.toDate()) }}
                    </td>
                    <td class="table__body__item table__body__item--actions">
                      <router-link
                        :to="`/admin/posts/edit/${post.uid}`"
                        class="table__body__item__edit"
                      >
                        <i class="las la-edit"></i>
                      </router-link>
                      <button
                        type="button"
                        :disabled="postDeleteLoading"
                        class="table__body__item__delete"
                        @click="onDeletePost(post.uid)"
                      >
                        <i class="las la-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="table__footer">
              <div class="table__info">
                <div>
                  Page: <span>{{ currentPage }}</span> of
                  <span>{{ Math.ceil(posts.length / postsPerPage) }}</span>
                </div>
                <div>
                  Showing
                  <span>
                    {{ showingFromPosts }}
                  </span>
                  to
                  <span>
                    {{ showingToPosts }}
                  </span>
                  of
                  <span> {{ posts.length }}</span> entries
                </div>
              </div>

              <div class="table__pagination">
                <Pagination
                  v-model:currentPage="currentPage"
                  :pages="Math.ceil(posts.length / postsPerPage)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref } from "vue";
import { User } from "@/servises/users/user";
import { useRouter } from "vue-router";
import { useStore, mapActions } from "vuex";
import moment from "moment";
import GlobalService from "@/servises/global";
import sortingBtn from "@/components/sorting-btn/index.vue";
import Pagination from "@/components/pagination/index.vue";

export default defineComponent({
  components: {
    "sorting-btn": sortingBtn,
    Pagination,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const sortedBy = reactive({
      title: null,
      owner: null,
      createdAt: null,
    });
    const currentPage = ref(1);
    const postsPerPage = ref(5);
    const searchText = ref("");

    const postDeleteLoading = ref(false);

    return {
      users: computed(() => store.state.usersModule.users),
      posts: computed(() => {
        const searchFields = ["title", "owner", "createdAt"];

        return store.state.postsModule.posts.filter((item: any) => {
          let check = false;
          let id = router.currentRoute.value.params.id;

          if (id && item.owner !== id) return false;

          searchFields.map((field) => {
            const value =
              typeof item[field] === "string"
                ? item[field]
                : moment(item[field].toDate()).format("MMMM dd, yyyy");
            if (value.toLowerCase().includes(searchText.value.toLowerCase())) {
              check = true;
            }
          });

          return check;
        });
      }),
      showingFromPosts: computed(() =>
        currentPage.value > 1 &&
        postsPerPage.value < store.state.postsModule.posts.length
          ? (currentPage.value - 1) * postsPerPage.value
          : 1
      ),
      showingToPosts: computed(() =>
        currentPage.value * postsPerPage.value <=
        store.state.postsModule.posts.length
          ? currentPage.value * postsPerPage.value
          : store.state.postsModule.posts.length
      ),
      sortedBy,
      currentPage,
      postsPerPage,
      searchText,
      postDeleteLoading,
    };
  },
  methods: {
    ...mapActions({
      deletePost: "postsModule/DeletePost",
    }),
    getNameOfPostOwner(ownerId: string): string {
      let name = "";

      this.users.map((user: User) => {
        if (user.uid === ownerId) {
          name = `${user.name} ${user.surname}`;
        }
      });

      return name;
    },
    getDate(date: string): string {
      return moment(date).format("MMMM DD, yyyy");
    },
    sortPosts(fieldName: string): void {
      let result = GlobalService.SortItems(
        this.posts,
        fieldName,
        this.sortedBy
      );
      this.posts = result["items"];
      this.sortedBy = result["sortedBy"];
    },
    onDeletePost(id: string) {
      this.postDeleteLoading = true;

      this.deletePost(id).then(() => {
        this.postDeleteLoading = false;
      });
    },
  },
});
</script>
