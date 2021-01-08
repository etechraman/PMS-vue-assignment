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
          <div class="card-header ml-5">
            {{ index + 1 }}. &nbsp; {{ item.title }}

            <button @click="promptTitle(item)">
              <b-icon class="ml-5 level-right" icon="pencil"></b-icon>
            </button>
          </div>
          <div
            class="card-content ml-5 level-left"
            v-for="(option, i) in item.options"
            :key="i"
          >
            <div class="media">
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
                @click="confirmDeleteOption(item, option)"
              ></a>
              <div class="ml-5" position="is-right">
                <br />
                Votes:{{ option.vote }}
              </div>
            </div>
          </div>
          <div class="card-footer level">
            <a
              class="button is-black is-small level-left"
              @click="promptOption(item)"
              >Add New Option</a
            >
            <a
              class="button is-black is-small level-left"
              @click="confirmDeletePoll(item.id)"
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
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Polls",
  data() {
    return {
      selected: "",
      id: "",
      title: "",
      updatePollTitle: "",
      option: "",
    };
  },
  async mounted() {
    this.reset();
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
      this.$store.commit("popUp", "Error");
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
    ...mapMutations(["popUp"]),
    reset() {
      this.id = "";
      this.title = "";
    },
    promptTitle(item) {
      this.id = item.id;
      this.$buefy.dialog.prompt({
        message: `Update Title`,
        confirmText: "Update Title",
        inputAttrs: {
          placeholder: item.title,
          value: item.title,

          maxlength: 80,
        },
        trapFocus: true,
        onConfirm: (value) => this.updateTitleClick(value),
        // onConfirm: (value) => this.$buefy.toast.open(`Your name is: ${value}`),
      });
    },
    async updateTitleClick(value) {
      if (value !== "") {
        const resp = await this.$store.dispatch("updateTitle", {
          id: this.id,
          title: value,
        });
        if (resp) {
          this.polls.forEach((item) => {
            if (item.id === this.id) {
              item.title = value;
            }
          });
          this.id = "";
          this.title = "";
          this.updatePollTitle = "";
        }
      } else {
        this.popUp("Title CanNot be empty");
      }
    },
    promptOption(item) {
      this.id = item.id;
      this.$buefy.dialog.prompt({
        message: `Add Option`,
        confirmText: "Add Option",
        inputAttrs: {
          placeholder: "Enter Option here",
          maxlength: 30,
        },
        trapFocus: true,

        onConfirm: (value) => {
          let bool = Boolean;
          item.options.forEach((option) => {
            if (value !== option.option) bool = true;
            else {
              bool = false;
            }
          });
          if (bool) this.addPollOption(value);
          else {
            this.popUp("New Option should never match old ones");
          }
        },
      });
    },
    async addPollOption(value) {
      if (value !== "") {
        const resp = await this.$store.dispatch("addNewOption", {
          id: this.id,
          text: value,
        });
        if (resp) {
          this.polls.forEach((item) => {
            if (item.id === this.id) {
              item.options.push({
                option: value,
                vote: 0,
              });
            }
          });
          this.id = "";
        }
      } else this.popUp("Option Cannot be blank");
    },

    confirmDeletePoll(id) {
      this.id = id;
      this.$buefy.dialog.confirm({
        title: "Deleting Poll",
        message:
          "Are you sure you want to <b>delete</b> this poll? This action cannot be undone.",
        confirmText: "Delete Poll",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deletePoll(),
      });
    },

    async deletePoll() {
      const resp = await this.$store.dispatch("deletePoll", this.id);
      if (resp) {
        this.popUp("Poll deleted!");
        let itemToBeDeleted = "";
        this.polls.forEach((item, index) => {
          if (item.id === this.id) itemToBeDeleted = index;
        });
        this.polls.splice(itemToBeDeleted, 1);
        this.id = "";
      }
    },
    confirmDeleteOption(item, option) {
      this.id = item.id;
      this.option = option.option;
      this.$buefy.dialog.confirm({
        title: "Deleting Option",
        message:
          "Are you sure you want to <b>delete</b> this option? This action cannot be undone.",
        confirmText: "Delete Option",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteOption(),
      });
    },
    async deleteOption() {
      const resp = await this.$store.dispatch("deleteOption", {
        id: this.id,
        text: this.option,
      });
      if (resp) {
        this.popUp("Option has been deleted");
        this.polls.forEach((item) => {
          let optionToBeDeleted = "";
          if (item.id === this.id) {
            item.options.forEach((item, index) => {
              if (item.option === this.option) optionToBeDeleted = index;
            });
            item.options.splice(optionToBeDeleted, 1);
          }
        });
        this.id = "";
        this.option = "";
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
        this.popUp("Error");
      }
    },
  },
};
</script>

<style></style>
