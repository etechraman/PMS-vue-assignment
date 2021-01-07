<template>
  <div id="app">
    <Header />
    <router-view></router-view>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Header from "@/components/Header";

export default {
  name: "app",
  components: {
    Header,
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      user: "getUser",
      isAdmin: "isAdmin",
      isGuest: "isGuest",
    }),
  },
  mounted: function() {
    if (localStorage.getItem("isLoggedIn") !== null) {
      this.$store.state.login.isLoggedIn = JSON.parse(
        localStorage.getItem("isLoggedIn")
      );
      this.$store.state.login.user = JSON.parse(localStorage.getItem("user"));
      if (localStorage.getItem("isAdmin") !== null)
        this.$store.state.register.isAdmin = localStorage.getItem("isAdmin");
      if (localStorage.getItem("isGuest") !== null)
        this.$store.state.register.isGuest = localStorage.getItem("isGuest");
      this.$store.state.login.userToken = localStorage.getItem(
        "userToken"
      );
    } else return;
  },
};
</script>

<style></style>
