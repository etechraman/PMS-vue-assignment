<template>
  <div class="createPoll">
    <section class="ml-5">
      <b-field label="Title" :label-position="labelPosition" class="mt-5">
        <b-input class="mr-6" required v-model="title" maxlength="80"></b-input>
      </b-field>
      <section>
        <b-field label="Option1: " class="mt-5">
          <b-input
            class="mr-6"
            required
            v-model="opt1"
            maxlength="30"
          ></b-input>
        </b-field>
        <b-field label="Option2: " class="mt-5">
          <b-input
            class="mr-6"
            required
            v-model="opt2"
            maxlength="30"
          ></b-input>
        </b-field>
        <b-field label="Option3: " class="mt-5">
          <b-input
            class="mr-6"
            required
            v-model="opt3"
            maxlength="30"
          ></b-input>
        </b-field>
        <b-field label="Option4: " class="mt-5">
          <b-input
            class="mr-6"
            required
            v-model="opt4"
            maxlength="30"
          ></b-input>
        </b-field>
      </section>

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
import { mapActions } from "vuex";
export default {
  name: "CreatePoll",
  data() {
    return {
      labelPosition: "centre",
    };
  },
  computed: {
    login_progress() {
      return this.$store.state.login.login_progress;
    },
    title: {
      get() {
        return this.$store.state.title;
      },
      set(val) {
        this.$store.commit("updateTitle", val);
      },
    },
    opt1: {
      get() {
        return this.$store.state.opt1;
      },
      set(val) {
        this.$store.commit("updateOpt1", val);
      },
    },
    opt2: {
      get() {
        return this.$store.state.opt2;
      },
      set(val) {
        this.$store.commit("updateOpt2", val);
      },
    },
    opt3: {
      get() {
        return this.$store.state.opt3;
      },
      set(val) {
        this.$store.commit("updateOpt3", val);
      },
    },
    opt4: {
      get() {
        return this.$store.state.opt4;
      },
      set(val) {
        this.$store.commit("updateOpt4", val);
      },
    },
  },
  methods: {
    ...mapActions(["createPoll"]),
    registerClick() {
      if (
        this.opt1 !== "" &&
        this.opt2 !== "" &&
        this.opt3 !== "" &&
        this.opt4 !== ""
      ) {
        this.$store.dispatch("createPoll", {
          title: this.title,
          opt1: this.opt1,
          opt2: this.opt2,
          opt3: this.opt3,
          opt4: this.opt4,
        });
      } else
        alert(
          "4 options are mandatory!! You can delete options from actions anytime"
        );
    },
  },
};
</script>

<style></style>
