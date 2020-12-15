import Vue from "vue";
import Vuex from "vuex";
import login from "./modules/login";
import register from "./modules/register";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    id: "",
    polls: [],
    title: "",
    opt1: "",
    opt2: "",
    opt3: "",
    opt4: "",
  },
  getters: {
    options: (state) => state.options,
    polls: (state) => state.polls,
  },
  mutations: {
    voted() {
      console.log("I Voted");
    },
    updateId(state, val) {
      state.id = val;
    },
    updateTitle(state, val) {
      state.title = val;
    },
    updateOpt1(state, val) {
      state.opt1 = val;
    },
    updateOpt2(state, val) {
      state.opt2 = val;
    },
    updateOpt3(state, val) {
      state.opt3 = val;
    },
    updateOpt4(state, val) {
      state.opt4 = val;
    },
    clearPolls(state, val) {
      state.polls = val;
    },
    updatePolls(state, val) {
      // console.log(val);
      state.polls.push(val);
    },
  },
  actions: {
    async listUsers() {
      try {
        // commit("login_progress", true);
        const response = await axios.get(
          "https://secure-refuge-14993.herokuapp.com/list_users"
        );
        console.log(response);
      } catch (err) {
        alert("Error");
      }
    },
    async listPolls() {
      try {
        // commit("login_progress", true);
        const response = await axios.get(
          "https://secure-refuge-14993.herokuapp.com/list_polls"
        );
        console.log(response);
      } catch (err) {
        // commit("login_progress", false);
        // commit("login_fail", err);
        alert("Error");
      }
    },
    async createPoll({ commit }, payload) {
      try {
        commit("login_progress", true);
        const response = await axios.post(
          `https://secure-refuge-14993.herokuapp.com/add_poll?title=${payload.title}&options=${payload.opt1}____${payload.opt2}____${payload.opt3}____${payload.opt4}`
        );
        console.log(response);
        // delete payload.password;
        payload.token = response;
        commit("updateId", "");
        commit("updateTitle", "");
        commit("updateOpt1", "");
        commit("updateOpt2", "");
        commit("updateOpt3", "");
        commit("updateOpt4", "");
        commit("login_progress", false);
      } catch (err) {
        commit("login_progress", false);
        commit("login_fail", err);
      }
    },

    async vote({ commit }, payload) {
      try {
        console.log(this.state.login.userToken);
        const headers = { access_token: localStorage.userToken };
        console.log(headers);
        console.log(payload);
        // console.log(payload.text);
        const response = await axios.post(
          `https://secure-refuge-14993.herokuapp.com/do_vote?id=${payload.id}&option_text=${payload.text}`,
          payload,
          { headers }
        );
        console.log(response);
        commit("voted");
      } catch (err) {
        console.log("Error!!", err);
      }
    },
  },
  modules: { login, register },
});
