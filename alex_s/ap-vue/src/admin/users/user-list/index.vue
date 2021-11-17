<template>
  <div class="users">
    <h2 class="page-title">Users</h2>

    <div class="users__list">
      <div class="card">
        <div class="card__header">
          <div class="card__title">Registered Users</div>
        </div>

        <div class="card__body">
          <div class="table">
            <div class="table__filters">
              <div class="table__display-per-page">
                Display per page:
                <select v-model="usersPerPage" @change="currentPage = 1">
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
                    <th class="table__header__item">Avatar</th>
                    <th
                      class="table__header__item table__header__item--sortable"
                      @click="sortUsers('name')"
                    >
                      Name
                      <sorting-btn :sortedBy="sortedBy['name']"></sorting-btn>
                    </th>
                    <th
                      class="table__header__item table__header__item--sortable"
                      @click="sortUsers('surname')"
                    >
                      Surname
                      <sorting-btn
                        :sortedBy="sortedBy['surname']"
                      ></sorting-btn>
                    </th>
                    <th
                      class="table__header__item table__header__item--sortable"
                      @click="sortUsers('email')"
                    >
                      Email
                      <sorting-btn :sortedBy="sortedBy['email']"></sorting-btn>
                    </th>
                    <th
                      class="table__header__item table__header__item--sortable"
                      @click="sortUsers('occupation')"
                    >
                      Occupation
                      <sorting-btn
                        :sortedBy="sortedBy['occupation']"
                      ></sorting-btn>
                    </th>
                    <th class="table__header__item">Registered</th>
                    <th
                      class="table__header__item table__header__item--actions"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="user of users.slice(
                      usersPerPage * (currentPage - 1),
                      usersPerPage * currentPage
                    )"
                    :key="user.uid"
                  >
                    <td class="table__body__item">
                      <div class="users__list__avatar">
                        <div
                          class="users__list__avatar__img"
                          :style="{
                            backgroundImage: `url(${
                              user.photoURL ? user.photoURL : noImage
                            })`,
                          }"
                        ></div>
                      </div>
                    </td>
                    <td class="table__body__item">{{ user.name }}</td>
                    <td class="table__body__item">{{ user.surname }}</td>
                    <td class="table__body__item">{{ user.email }}</td>
                    <td class="table__body__item">{{ user.occupation }}</td>
                    <td class="table__body__item">
                      {{ getDate(user.createdAt) }}
                    </td>
                    <td class="table__body__item table__body__item--actions">
                      <router-link
                        :to="`/admin/users/edit/${user.uid}`"
                        class="table__body__item__edit"
                      >
                        <i class="las la-edit"></i>
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="table__footer">
              <div class="table__info">
                <div>
                  Page: <span>{{ currentPage }}</span> of
                  <span>{{ Math.ceil(users.length / usersPerPage) }}</span>
                </div>
                <div>
                  Showing
                  <span>
                    {{ showingFromUsers }}
                  </span>
                  to
                  <span>
                    {{ showingToUsers }}
                  </span>
                  of
                  <span> {{ users.length }}</span> entries
                </div>
              </div>

              <div class="table__pagination">
                <Pagination
                  v-model:currentPage="currentPage"
                  :pages="Math.ceil(users.length / usersPerPage)"
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
import { useStore } from "vuex";
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
    const store = useStore();
    const sortedBy = reactive({
      name: null,
      surname: null,
      email: null,
      occupation: null,
      createdAt: null,
    });
    const currentPage = ref(1);
    const usersPerPage = ref(5);
    const searchText = ref("");

    return {
      noImage: computed(() =>
        require("@/assets/images/site/no-image-white.svg")
      ),
      users: computed(() => {
        const searchFields = [
          "name",
          "surname",
          "email",
          "occupation",
          "createdAt",
        ];

        return store.state.usersModule.users.filter((item: any) => {
          let check = false;

          searchFields.map((field) => {
            if (
              item[field]
                ?.toLowerCase()
                .includes(searchText.value.toLowerCase())
            ) {
              check = true;
            }
          });

          return check;
        });
      }),
      showingFromUsers: computed(() =>
        currentPage.value > 1 &&
        usersPerPage.value < store.state.usersModule.users.length
          ? (currentPage.value - 1) * usersPerPage.value
          : 1
      ),
      showingToUsers: computed(() =>
        currentPage.value * usersPerPage.value <=
        store.state.usersModule.users.length
          ? currentPage.value * usersPerPage.value
          : store.state.usersModule.users.length
      ),
      sortedBy,
      currentPage,
      usersPerPage,
      searchText,
    };
  },
  methods: {
    getDate(date: string): string {
      return moment(new Date(date)).format("MMMM DD, yyyy");
    },
    sortUsers(fieldName: string): void {
      let result = GlobalService.SortItems(
        this.users,
        fieldName,
        this.sortedBy
      );
      this.users = result["items"];
      this.sortedBy = result["sortedBy"];
    },
  },
});
</script>
