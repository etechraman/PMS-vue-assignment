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
          <div class="card-header ml-5 mr-5">
            {{ index + 1 }}. &nbsp; {{ item.title }}
          </div>
          <div
            class="card-content ml-5"
            v-for="(option, i) in item.options"
            :key="i"
          >
            <b-radio v-model="selected" :native-value="option.option">{{
              option.option
            }}</b-radio>
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
import { mapGetters, mapMutations } from "vuex";
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
      userToken: "userToken",
      userVote: "userVote",
    }),
    polls: {
      get() {
        return this.$store.state.polls;
      },
      set(val) {
        this.$store.commit("pollToView", val);
      },
    },
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
    ...mapMutations(["popUp"]),

    submitClick(item) {
      let text = "";
      for (let i = 0; i < item.options.length; i++) text = this.selected;

      if (text != "") {
        this.$store.dispatch("vote", {
          id: item.id,
          text: text,
        });
        this.userHasVoted = true;
        this.selected = text;
        let pollToView = [];
        this.polls.forEach((temp, index) => {
          if (temp.id === item.id) {
            pollToView = this.polls.slice(index, index + 1);
          }
        });
        this.polls = pollToView;
      } else {
        this.popUp("Error!! Select an option before clicking submit");
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
            this.selected = item.option;
            return false;
          }
        });
      }

      try {
        const response = await axios.get(
          "https://secure-refuge-14993.herokuapp.com/list_polls"
        );

        for (let i = response.data.data.length - 1; i >= 0; i--) {
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
        // console.log(err);
        this.$store.commit("clearPolls", []);
        this.popUp("Error");
      }
    },
  },
};
</script>

<style></style>
