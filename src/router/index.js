import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (login.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../components/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../components/Register.vue"),
  },
  {
    path: "/profile",
    name: "UserProfile",
    component: () => import("../components/UserProfile.vue"),
  },
  {
    path: "/polls",
    name: "Polls",
    component: () => import("../components/Polls.vue"),
  },
  {
    path: "/createpoll",
    name: "CreatePoll",
    component: () => import("../components/CreatePoll.vue"),
  },
  {
    path: "/managepolls",
    name: "ManagePolls",
    component: () => import("../components/ManagePolls.vue"),
  },
];

const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  if (localStorage.getItem("isLoggedIn") !== null) {
    if (localStorage.getItem("isGuest") !== null) {
      if (to.path == "/profile" || to.path == "/polls") {
        next();
      } else if (
        to.path == "/" ||
        to.path == "/#" ||
        to.path == "/login" ||
        to.path == "/createpoll" ||
        to.path == "/managepolls" ||
        to.path == "/register"
      ) {
        next("/profile");
      } else {
        next(false);
      }
    } else if (localStorage.getItem("isAdmin") !== null) {
      if (
        to.path == "/profile" ||
        to.path == "/createpoll" ||
        to.path == "/managepolls"
      ) {
        next();
      } else if (
        to.path == "/" ||
        to.path == "/#" ||
        to.path == "/login" ||
        to.path == "/polls" ||
        to.path == "/register"
      ) {
        next("/profile");
      } else {
        next(false);
      }
    }
  } else {
    if (
      to.path == "/" ||
      to.path == "/login" ||
      to.path == "/#" ||
      to.path == "/register"
    ) {
      next();
    } else {
      next(false);
    }
  }
});
export default router;
