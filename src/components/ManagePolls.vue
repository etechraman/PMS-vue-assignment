<template>
  <div id="polls">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title">
            Polls Management Page
          </h1>
        </div>
      </div>
    </section>
    <section>
      <div v-if="polls.length">
        <div
          v-for="(item, index) in polls"
          :key="index"
          class="card  mb-6 mt-5"
        >
          <b-field
            v-if="title === item.title"
            label="Title: "
            class="mt-5 ml-5"
          >
            <b-input
              class="mr-6"
              required
              maxlength="60"
              v-model="updatePollTitle"
            ></b-input>
            <button
              :class="{
                button: true,
                'is-full': true,
                'is-loading': login_progress,
              }"
              @click="updateTitle(item.id)"
            >
              Add
            </button>
          </b-field>
          <div class="card-header ml-5">
            {{ index + 1 }}. &nbsp; {{ item.title }}

            <button @click="handleUpdateTitle(item)">
              <b-icon class="ml-5 level-right" icon="pencil"></b-icon>
            </button>
          </div>
          <div
            class="card-content ml-5 level-left"
            v-for="(option, i) in item.options"
            :key="i"
          >
            <input
              disabled
              class="mr-6"
              name="radio"
              type="radio"
              v-model="selected"
              :value="`${option.option}`"
            />{{ option.option }}
            <a
              class="delete ml-5 level-right"
              @click="deleteOption(item, option)"
            ></a>
            <div class="ml-5" position="is-right">
              <br/> Votes:{{ option.vote }}
            </div>
          </div>
          <b-field v-if="id === item.id" label="Option: " class="mt-5 ml-5">
            <b-input
              class="mr-6"
              required
              maxlength="30"
              v-model="addNewOption"
            ></b-input>
            <button
              :class="{
                button: true,
                'is-full': true,
                'is-loading': login_progress,
              }"
              @click="addPollOption(item.id)"
            >
              Add
            </button>
          </b-field>
          <div class="card-footer level">
            <a
              class="button is-black is-small level-left"
              @click="addOption(item)"
              >Add New Option</a
            >
            <a
              class="button is-black is-small level-right"
              @click="deletePoll(item.id)"
              >Delete Poll</a
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
export default {
  name: "Polls",
  data() {
    return {
      selected: "",
      id: "",
      title: "",
      updatePollTitle: "",
    };
  },
  async mounted() {
    this.$store.commit("clearPolls", []);
    try {
      const response = await axios.get(
        "https://secure-refuge-14993.herokuapp.com/list_polls"
      );
      for (let i = 0; i < response.data.data.length; i++) {
        this.$store.commit("updatePolls", {
          id: response.data.data[i]._id,
          title: response.data.data[i].title,
          options: response.data.data[i].options,
        });
      }
    } catch (err) {
      this.$store.commit("clearPolls", []);
      alert("Error");
    }
  },
  computed: {
    ...mapGetters({
      polls: "polls",
      userToken: "userToken",
    }),
    login_progress() {
      return this.$store.state.login.login_progress;
    },
    addNewOption: {
      get() {
        return this.$store.state.addNewOption;
      },
      set(val) {
        this.$store.commit("updateAddNewOption", val);
      },
    },
  },
  methods: {
    handleUpdateTitle(item) {
      if (this.title === "") {
        this.title = item.title;
        this.updatePollTitle = item.title;
      } else this.title = "";
    },
    async updateTitle(id) {
      const resp = await this.$store.dispatch("updateTitle", {
        id: id,
        title: this.updatePollTitle,
      });
      if (resp) {
        this.id = "";
        this.title = "";
        this.updatePollTitle = "";
        this.viewPolls();
      }
    },

    addOption(item) {
      if (this.id === "") this.id = item.id;
      else this.id = "";
    },
    async addPollOption(id) {
      const resp = await this.$store.dispatch("addNewOption", {
        id: id,
        text: this.addNewOption,
      });
      if (resp) {
        this.id = "";
        this.viewPolls();
      }
    },
    async deletePoll(id) {
      if (confirm("CAUTION!! Are you sure you want to delete the poll")) {
        const resp = await this.$store.dispatch("deletePoll", id);
        if (resp) this.viewPolls();
      }
    },
    async deleteOption(item, option) {
      if (confirm("Caution!! Are you sure you want to delete this option?")) {
        const resp = await this.$store.dispatch("deleteOption", {
          id: item.id,
          text: option.option,
        });
        if (resp) this.viewPolls();
      }
    },
    async viewPolls() {
      this.$store.commit("clearPolls", []);
      try {
        const response = await axios.get(
          "https://secure-refuge-14993.herokuapp.com/list_polls"
        );
        for (let i = 0; i < response.data.data.length; i++) {
          this.$store.commit("updatePolls", {
            id: response.data.data[i]._id,
            title: response.data.data[i].title,
            options: response.data.data[i].options,
          });
        }
      } catch (err) {
        // console.log(err);
        this.$store.commit("clearPolls", []);
        alert("Error");
      }
    },
  },
};
</script>

<style></style>
