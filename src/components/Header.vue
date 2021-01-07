<template>
  <nav class="navbar is-warning" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item">
        <router-link to="/" v-if="!isLoggedIn">VUE</router-link>
        <b-navbar-item v-if="isLoggedIn" @click="home">
          Home
        </b-navbar-item>
        <b-navbar-item v-if="isGuest" @click="listPolls">
          Polls
        </b-navbar-item>
        <b-navbar-item v-if="!isLoggedIn" @click="signup">
          Register
        </b-navbar-item>
        <b-navbar-dropdown v-if="isAdmin" label="Actions">
          <b-navbar-item @click="createPoll">
            Create a new Poll
          </b-navbar-item>
          <b-navbar-item @click="managePolls">
            Manage Polls
          </b-navbar-item>
        </b-navbar-dropdown>
      </div>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <div class="navbar-item">
          <a v-if="!isLoggedIn" @click="login" class="button is-white">Login</a>
          <a v-if="isLoggedIn" @click="logout" class="button is-white"
            >Logout</a
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Header",
  computed: {
    isLoggedIn: {
      get() {
        return this.$store.state.login.isLoggedIn;
      },
      set(val) {
        this.$store.commit("updateIsLoggedIn", val);
      },
    },
    isAdmin: {
      get() {
        return this.$store.state.register.isAdmin;
      },
      set(val) {
        this.$store.commit("updateIsAdmin", val);
      },
    },
    isGuest: {
      get() {
        return this.$store.state.register.isGuest;
      },
      set(val) {
        this.$store.commit("updateIsGuest", val);
      },
    },
  },
  methods: {
    ...mapActions({
      dologout: "logout",
    }),
    login() {
      if (this.$route.name != "Login") this.$router.push("login");
      else return;
    },
    logout() {
      this.dologout();
      this.$router.push("/");
    },
    signup() {
      if (this.$route.name != "Register") this.$router.push("register");
      else return;
    },
    home() {
      if (this.$route.name != "Profile") this.$router.push("profile");
      else return;
    },
    listUsers() {
      this.$store.dispatch("listUsers");
    },
    listPolls() {
      if (this.$route.name != "PollsView") this.$router.push("polls");
    },
    createPoll() {
      if (this.$route.name != "CreatePoll") this.$router.push("createpoll");
    },
    managePolls() {
      if (this.$route.name != "ManagePolls") this.$router.push("managepolls");
    },
  },
};
</script>

<style></style>
