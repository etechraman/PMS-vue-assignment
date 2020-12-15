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
          <div class="card-content ml-5">
            <input id="opt1" type="checkbox" class="mr-5" />{{ item.opt1 }}
          </div>
          <div class="card-content ml-5">
            <input id="opt2" type="checkbox" class="mr-5" />{{ item.opt2 }}
          </div>
          <div class="card-content ml-5">
            <input id="opt3" type="checkbox" class="mr-5" />{{ item.opt3 }}
          </div>
          <div class="card-content ml-5">
            <input id="opt4" type="checkbox" class="mr-5" />{{ item.opt4 }}
          </div>
          <div class="card-footer-item">
            <a
              v-if="polls.length"
              class="button is-black"
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
export default {
  name: "Polls",
  async mounted() {
    this.$store.commit("clearPolls", []);
    try {
      // commit("login_progress", true);
      const response = await axios.get(
        "https://secure-refuge-14993.herokuapp.com/list_polls"
      );

      for (let i = 0; i < response.data.data.length; i++) {
        this.$store.commit("updatePolls", {
          id: response.data.data[i]._id,
          title: response.data.data[i].title,
          opt1: response.data.data[i].options[0].option,
          opt2: response.data.data[i].options[1].option,
          opt3: response.data.data[i].options[2].option,
          opt4: response.data.data[i].options[3].option,
        });
      }
      //   console.log(this.$store.state.polls);
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
  },
  methods: {
    // clickCheckbox(e) {
    //   console.log(e);
    //   console.log(this);
    //   console.log(document.getElementById("opt1").value);
    // },
    submitClick(item) {
      let text = "";
      if (document.getElementById("opt1").checked) text = item.opt1;
      else if (document.getElementById("opt2").checked) text = item.opt2;
      else if (document.getElementById("opt3").checked) text = item.opt3;
      else if (document.getElementById("opt4").checked) text = item.opt4;
      else text = "";
      this.$store.dispatch("vote", {
        id: item.id,
        text: text,
      });
    },
  },
};
</script>

<style></style>
