import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";

export default {
  state: {
    username: "",
    password: "",
    user: {},
    isLoggedIn: false,
    error: false,
    login_progress: false,
    userToken: "",
    userVote: [],
  },
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isLoggedIn,
    userVote: (state) => state.userVote,
  },
  actions: {
    async login({ commit }, payload) {
      try {
        commit("login_progress", true);
        const response = await axios.post(
          `https://secure-refuge-14993.herokuapp.com/login?username=${payload.username}&password=${payload.password}`,
          payload
        );
        delete payload.password;
        this.state.login.userToken = response.data.token;
        const userData = VueJwtDecode.decode(response.data.token);
        payload.token = response;
        commit("login", {
          username: userData.username,
          id: userData.id,
          role: userData.role,
        });
        commit("updateUsername", "");
        commit("updatePassword", "");
        commit("login_progress", false);
      } catch (err) {
        console.log(err);
        commit("login_progress", false);
        alert("Login Failed");
        commit("login_fail", err);
      }
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  mutations: {
    login(state, data) {
      state.user = data;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("isLoggedIn", state.isLoggedIn);
      localStorage.setItem("userToken", this.state.login.userToken);
      if (data.role === "admin" || data.role === "Admin") {
        this.state.register.isAdmin = true;
        localStorage.setItem("isAdmin", true);
      } else if (data.role === "guest" || data.role === "Guest") {
        this.state.register.isGuest = true;
        localStorage.setItem("isGuest", true);
      }
      state.username = "";
      state.password = "";
    },
    login_fail: (state, data) => {
      state.error = data;
    },
    login_progress: (state, data) => {
      state.login_progress = data;
    },
    logout(state) {
      state.user = {};
      state.isLoggedIn = false;
      this.state.register.isAdmin = false;
      this.state.register.isGuest = false;
      this.state.login.userToken = "";
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isGuest");
      localStorage.removeItem("userToken");
    },

    updateUsername(state, val) {
      state.username = val;
    },
    updatePassword(state, val) {
      state.password = val;
    },
    updateIsLoggedIn(state, val) {
      state.isLoggedIn = val;
    },
    updateLoginProcess(state, val) {
      state.login_progress = val;
    },
    updateErrorMessage(state, val) {
      state.error = val;
    },
  },
};
