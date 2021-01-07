<template>
  <div class="registerForm">
    <section>
      <b-field label="First Name" class="mt-5">
        <b-input required v-model="firstname" maxlength="30"></b-input>
      </b-field>
      <b-field label="Last Name" class="mt-5">
        <b-input required v-model="lastname" maxlength="30"></b-input>
      </b-field>
      <b-field label="Email Address" class="mt-5">
        <b-input required v-model="username" maxlength="30"></b-input>
      </b-field>
      <b-field label="Role" class="mt-5">
        <b-select placeholder="Select a role of user" v-model="role" expanded>
          <option value="admin">Admin</option>
          <option value="guest">Guest</option>
        </b-select>
      </b-field>
      <b-field label="Password" class="mt-5">
        <b-input required type="password" v-model="password"> </b-input>
      </b-field>
      <b-field label="Confirm Password" class="mt-5">
        <b-input required type="password" v-model="confirmPassword"> </b-input>
      </b-field>
      <button
        :class="{
          button: true,
          'is-full': true,
          'is-loading': login_progress,
          'mt-5': true,
        }"
        @click="registerClick()"
      >
        Register
      </button>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "RegisterForm",
  computed: {
    ...mapGetters({
      user: "getUser",
      isLoggedIn: "isLoggedIn",
    }),
    login_progress() {
      return this.$store.state.login.login_progress;
    },
    error_message() {
      return this.$store.state.login.error;
    },
    firstname: {
      get() {
        return this.$store.state.register.firstname;
      },
      set(val) {
        this.$store.commit("updateFirstName", val);
      },
    },
    lastname: {
      get() {
        return this.$store.state.register.lastname;
      },
      set(val) {
        this.$store.commit("updateLastName", val);
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
    role: {
      get() {
        return this.$store.state.register.role;
      },
      set(val) {
        this.$store.commit("updateRole", val);
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
    confirmPassword: {
      get() {
        return this.$store.state.login.confirmPassword;
      },
      set(val) {
        this.$store.commit("updateConfirmPassword", val);
      },
    },
    id: {
      get() {
        return this.$store.state.register.id;
      },
      set(val) {
        this.$store.commit("updateId", val);
      },
    },
  },
  methods: {
    ...mapActions(["register"]),
    registerClick() {
      if (this.firstname === "")
        alert("Enter First Name before clicking submit");
      else if (this.lastname === "")
        alert("Enter the last name before clicking submit");
      else if (this.username === "")
        alert("Enter the user name before clicking submit");
      else if (this.role === "")
        alert("Select the role before clicking submit");
      else if (this.password === "")
        alert("Enter the password before clicking submit");
      else if (this.password !== this.confirmPassword) {
        alert("Passwords didnt match");
        this.password = "";
        this.confirmPassword = "";
      } else {
        this.$store.dispatch("register", {
          username: this.username,
          password: this.password,
          role: this.role,
          id: Math.random()
            .toString(36)
            .substr(2, 9),
        });
      }
    },
  },
};
</script>

<style></style>
