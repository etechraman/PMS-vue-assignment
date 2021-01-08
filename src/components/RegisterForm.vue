<template>
  <section v-on:keyup.enter="registerClick()">
    <b-field label="First Name">
      <b-input required v-model="firstname" maxlength="30"></b-input>
    </b-field>
    <b-field label="Last Name">
      <b-input required v-model="lastname" maxlength="30"></b-input>
    </b-field>
    <b-field label="Email Address">
      <b-input
        type="email"
        required
        v-model="username"
        maxlength="30"
      ></b-input>
    </b-field>
    <b-field label="Role">
      <b-select placeholder="Select a role of user" v-model="role" expanded>
        <option value="admin">Admin</option>
        <option value="guest">Guest</option>
      </b-select>
    </b-field>
    <b-field label="Password">
      <b-input expanded required type="password" v-model="password"> </b-input>
    </b-field>
    <small id="passwordHelp" class="form-text text-muted">
      Password should contain
      <span :class="has_minimum_length ? 'has_required' : ''"
        >atleast 8 chacters</span
      >,
      <span :class="has_lowercase ? 'has_required' : ''"
        >one lowercase letter</span
      >,
      <span :class="has_uppercase ? 'has_required' : ''"
        >one uppercase letter</span
      >, <span :class="has_number ? 'has_required' : ''">One number</span>
    </small>
    <b-field label="Confirm Password">
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
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "RegisterForm",
  data() {
    return {
      firstname: "",
      lastname: "",
      username: "",
      role: "",
      password: "",
      has_minimum_length: false,
      has_number: false,
      has_lowercase: false,
      has_uppercase: false,
      confirmPassword: "",
    };
  },
  mounted: function() {
    this.formReset();
  },
  watch: {
    password() {
      this.has_minimum_length = this.password.length >= 8;
      this.has_number = /\d/.test(this.password);
      this.has_lowercase = /[a-z]/.test(this.password);
      this.has_uppercase = /[A-Z]/.test(this.password);
    },
  },
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
    // firstname: {
    //   get() {
    //     return this.$store.state.register.firstname;
    //   },
    //   set(val) {
    //     this.$store.commit("updateFirstName", val);
    //   },
    // },
    // lastname: {
    //   get() {
    //     return this.$store.state.register.lastname;
    //   },
    //   set(val) {
    //     this.$store.commit("updateLastName", val);
    //   },
    // },
    // username: {
    //   get() {
    //     return this.$store.state.login.username;
    //   },
    //   set(val) {
    //     this.$store.commit("updateUsername", val);
    //   },
    // },
    // role: {
    //   get() {
    //     return this.$store.state.register.role;
    //   },
    //   set(val) {
    //     this.$store.commit("updateRole", val);
    //   },
    // },
    // confirmPassword: {
    //   get() {
    //     return this.$store.state.login.confirmPassword;
    //   },
    //   set(val) {
    //     this.$store.commit("updateConfirmPassword", val);
    //   },
    // },
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
    ...mapMutations(["popUp"]),
    async registerClick() {
      if (this.firstname === "") this.popUp("Enter First Name");
      else if (this.lastname === "") this.popUp("Enter Last Name");
      else if (this.username === "") this.popUp("Enter Email Address");
      else if (!this.username.includes("@"))
        this.popUp("Enter a valid Email Address");
      else if (this.role === "") this.popUp("Select Role");
      else if (this.password === "") {
        this.popUp("Enter Password");
      } else if (!this.has_minimum_length)
        this.popUp("Password must have atleast 8 characters");
      else if (!this.has_number)
        this.popUp("Password must have at least one number");
      else if (!this.has_lowercase)
        this.popUp("Password must have at least one lowercase letter");
      else if (!this.has_uppercase)
        this.popUp("Password must have at least one Uppercase letter");
      else if (this.password !== this.confirmPassword) {
        this.popUp("Passwords didnt match");
        this.password = "";
        this.confirmPassword = "";
      } else {
        await this.$store.dispatch("register", {
          username: this.username,
          password: this.password,
          role: this.role,
          id: Math.random()
            .toString(36)
            .substr(2, 9),
        });
        this.formReset();
      }
    },
    formReset() {
      this.firstname = "";
      this.lastname = "";
      this.username = "";
      this.role = "";
      this.password = "";
      this.confirmPassword = "";
    },
  },
};
</script>

<style>
.has_required {
  text-decoration: line-through;
  color: #689868;
}
/* .password {
  display: flex;
} */
</style>
