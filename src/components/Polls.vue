<template>
  <div id="polls">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Polls Page
          </h1>
        </div>
      </div>
    </section>
    <section>
      <div v-if="polls.length">
        <div v-for="(item, index) in polls" :key="index" class="card mb-6 mt-5">
          <div class="card-header ml-5">
            {{ index + 1 }}. &nbsp; {{ item.title }}
          </div>
          <div
            class="card-content ml-5"
            v-for="(option, i) in item.options"
            :key="i"
          >
            <input
              name="radio"
              type="radio"
              class="mr-5"
              v-model="selected"
              :value="`${option.option}`"
              @click="checkboxClick($event)"
            />{{ option.option }}
          </div>
          <div class="card-footer-item">
            <a
              v-if="polls.length"
              :class="{
                button: true,
                'is-full': true,
                'is-black': true,
                'is-loading': login_progress,
              }"
              @click="submitClick(item)"
              >Submit</a
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "Polls",
  data() {
    return {
      selected: "",
      userHasVoted: false,
    };
  },
  mounted() {
    this.fetchPolls();
  },
  computed: {
    ...mapGetters({
      polls: "polls",
      userToken: "userToken",
      userVote: "userVote",
    }),
    login_progress: {
      get() {
        return this.$store.state.login.login_progress;
      },
      set(val) {
        this.$store.commit("updateLoginProcess", val);
      },
    },
  },
  methods: {
    checkboxClick(e) {
      console.log(e);
    },
    submitClick(item) {
      let text = "";
      for (let i = 0; i < item.options.length; i++) text = this.selected;

      if (text != "") {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        this.$store.dispatch("vote", {
          id: item.id,
          text: text,
        });
        this.userHasVoted = true;
        this.fetchPolls();
      } else {
        alert("Error!! Select an option before clicking submit");
      }
    },

    async fetchPolls() {
      this.$store.commit("clearPolls", []);
      if (localStorage.getItem("userVote") !== null) {
        this.$store.state.login.userVote = JSON.parse(
          localStorage.getItem("userVote")
        );
      } else {
        this.$store.state.login.userVote = [];
      }
      let pollID = "";
      if (this.$store.state.login.userVote !== []) {
        this.$store.state.login.userVote.forEach((item) => {
          if (
            VueJwtDecode.decode(item.userToken)._id ===
            VueJwtDecode.decode(localStorage.getItem("userToken"))._id
          ) {
            pollID = item.pollId;
            return false;
          } else pollID = "";
        });
      }

      try {
        const response = await axios.get(
          "https://secure-refuge-14993.herokuapp.com/list_polls"
        );
        for (let i = 0; i < response.data.data.length; i++) {
          if (pollID === "") {
            this.$store.commit("updatePolls", {
              id: response.data.data[i]._id,
              title: response.data.data[i].title,
              options: response.data.data[i].options,
            });
          } else if (pollID === response.data.data[i]._id) {
            this.$store.commit("updatePolls", {
              id: response.data.data[i]._id,
              title: response.data.data[i].title,
              options: response.data.data[i].options,
            });
          }
        }
      } catch (err) {
        console.log(err);
        this.$store.commit("clearPolls", []);
        alert("Error");
      }
    },
  },
};
</script>

<style></style>
