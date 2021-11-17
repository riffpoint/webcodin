import { RouteRecordRaw } from "vue-router";

import Admin from "./index.vue";
import Dashboard from "./dashboard/index.vue";

import Users from "./posts/index.vue";
import UserList from "./users/user-list/index.vue";
import UserManage from "./users/user-manage/index.vue";

import Posts from "./posts/index.vue";
import PostList from "./posts/post-list/index.vue";
import PostManage from "./posts/post-manage/index.vue";

import Profile from "./profile/index.vue";

const adminRoutes: Array<RouteRecordRaw> = [
  {
    path: "/admin",
    component: Admin,
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard,
        meta: { requiresLogin: true },
      },
      {
        path: "users",
        name: "users",
        component: Users,
        meta: { requiresLogin: true },
        children: [
          {
            path: "",
            name: "user-list",
            component: UserList,
            meta: { requiresLogin: true },
          },
          {
            path: "edit/:id",
            name: "user-edit",
            component: UserManage,
            meta: { requiresLogin: true },
          },
        ],
      },
      {
        path: "posts",
        name: "posts",
        component: Posts,
        meta: { requiresLogin: true },
        children: [
          {
            path: "",
            name: "post-list",
            component: PostList,
            meta: { requiresLogin: true },
          },
          {
            path: "add",
            name: "post-add",
            component: PostManage,
            meta: { requiresLogin: true },
          },
          {
            path: ":id",
            name: "my-posts",
            component: PostList,
            meta: { requiresLogin: true },
          },
          {
            path: "edit/:id",
            name: "post-edit",
            component: PostManage,
            meta: { requiresLogin: true },
          },
        ],
      },
      {
        path: "profile",
        name: "profile",
        component: Profile,
        meta: { requiresLogin: true },
      },
    ],
  },
];

export default adminRoutes;
