<template>
  <div class="loginForm">
    <section v-on:keyup.enter="loginClick()">
      <b-field label="Username" class="mt-5">
        <b-input required v-model="username" maxlength="30"></b-input>
      </b-field>
      <b-field label="Password">
        <b-input required type="password" v-model="password" password-reveal>
        </b-input>
      </b-field>
      <button
        :class="{ button: true, 'is-full': true, 'is-loading': login_progress }"
        @click="loginClick()"
      >
        Login
      </button>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "LoginForm",
  data() {
    return {
      has_minimum_length: false,
      has_number: false,
      has_lowercase: false,
      has_uppercase: false,
    };
  },
  mounted: function() {
    this.username = "";
    this.password = "";
  },
  watch: {
    password() {
      this.has_minimum_length = this.password.length >= 8;
      this.has_number = /\d/.test(this.password);
      this.has_lowercase = /[a-z]/.test(this.password);
      this.has_uppercase = /[A-Z]/.test(this.password);
    },
    user(val) {
      if (val.username) {
        this.$router.push("profile");
      }
    },
    error_message(val) {
      if (val) {
        this.$snackbar.open({
          duration: 5000,
          message: "Login failed. " + val.message,
          type: "is-danger",
          position: "is-bottom-left",
        });
      }
    },
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      isLoggedIn: "isLoggedIn",
    }),
    login_progress: {
      get() {
        return this.$store.state.login.login_progress;
      },
      set(val) {
        this.$store.commit("updateLoginProcess", val);
      },
    },
    error_message: {
      get() {
        return this.$store.state.login.error;
      },
      set(val) {
        this.$store.commit("updateErrorMessage", val);
      },
    },
    username: {
      get() {
        return this.$store.state.login.username;
      },
      set(val) {
        this.$store.commit("updateUsername", val);
      },
    },
    password: {
      get() {
        return this.$store.state.login.password;
      },
      set(val) {
        this.$store.commit("updatePassword", val);
      },
    },
  },
  methods: {
    ...mapActions(["login"]),
    ...mapMutations(["popUp"]),
    loginClick() {
      if (this.username === "") this.popUp("Enter Email Address");
      else if (!this.username.includes("@"))
        this.popUp("Enter a valid Email Address");
      else if (this.role === "") this.popUp("Select Role");
      else if (this.password === "") {
        this.popUp("Enter Password");
      } else if (
        !this.has_minimum_length ||
        !this.has_number ||
        !this.has_lowercase ||
        !this.has_uppercase
      )
        this.popUp("Enter a valid password");
      else {
        this.$store.dispatch("login", {
          username: this.username,
          password: this.password,
        });
      }
    },
  },
};
</script>

<style></style>
