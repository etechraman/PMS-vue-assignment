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
    addNewOption: "",
  },
  getters: {
    options: (state) => state.options,
    polls: (state) => state.polls,
  },
  mutations: {
    voted(state, payload) {
      console.log(payload, state);
      console.log("I Voted");
      console.log(state.login);
      state.login.userVote.push(payload);
      console.log(state.login.userVote, ">>>>>userVote");
      localStorage.setItem(
        "userVote",
        JSON.stringify(this.state.login.userVote)
      );
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
      state.polls.push(val);
    },
    updateAddNewOption(state, val) {
      state.addNewOption = val;
    },
  },
  actions: {
    async addNewOption({ commit }, payload) {
      try {
        commit("login_progress", true);
        await axios.post(
          `https://secure-refuge-14993.herokuapp.com/add_new_option?id=${payload.id}&option_text=${payload.text}`
        );
        commit("login_progress", false);
        commit("updateAddNewOption", "");
        return true;
      } catch (err) {
        commit("login_progress", false);
        commit("login_fail", err);
      }
    },
    async deleteOption({ commit }, payload) {
      try {
        commit("login_progress", true);
        await axios.post(
          `https://secure-refuge-14993.herokuapp.com/delete_poll_option?id=${payload.id}&option_text=${payload.text}`
        );
        commit("login_progress", false);
        return true;
      } catch (err) {
        commit("login_progress", false);
        commit("login_fail", err);
      }
    },
    async deletePoll({ commit }, id) {
      try {
        commit("login_progress", true);
        await axios.post(
          `https://secure-refuge-14993.herokuapp.com/delete_poll?id=${id}`
        );
        commit("login_progress", false);
        return true;
      } catch (err) {
        commit("login_progress", false);
        commit("login_fail", err);
      }
    },
    async listUsers() {
      try {
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
        const response = await axios.get(
          "https://secure-refuge-14993.herokuapp.com/list_polls"
        );
        console.log(response);
      } catch (err) {
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
      commit("clearPolls", []);
      try {
        let headers = {
          access_token: `${localStorage.getItem("userToken")}`,
        };
        commit("login_progress", true);
        axios.get(
          `https://secure-refuge-14993.herokuapp.com/do_vote?id=${payload.id}&option_text=${payload.text}`,
          { headers }
        );
        await commit("voted", {
          userToken: headers.access_token,
          pollId: payload.id,
        });
        commit("login_progress", false);
      } catch (err) {
        console.log("Error!!", err);
      }
    },
  },
  modules: { login, register },
});
