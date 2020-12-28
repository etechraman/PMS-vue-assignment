import axios from "axios";
export default {
  state: {
    firstname: "",
    lastname: "",
    role: "",
    id: "",
    isAdmin: false,
    isGuest: false,
  },
  getters: {
    isAdmin: (state) => state.isAdmin,
    isGuest: (state) => state.isGuest,
  },
  actions: {
    async register({ commit }, payload) {
      try {
        commit("login_progress", true);
        const response = await axios.post(
          `https://secure-refuge-14993.herokuapp.com/add_user?username=${payload.username}&password=${payload.password}&role=${payload.role}`
        );
        delete payload.password;
        payload.token = response;
        commit("updateFirstName", "");
        commit("updateLastName", "");
        commit("updateUsername", "");
        commit("updateId", "");
        commit("updateRole", "");
        commit("updatePassword", "");
        commit("login_progress", false);
      } catch (err) {
        // console.log(err);
        commit("login_progress", false);
        commit("login_fail", err);
      }
    },
  },
  mutations: {
    updateFirstName(state, val) {
      state.firstname = val;
    },
    updateLastName(state, val) {
      state.lastname = val;
    },
    updateRole(state, val) {
      state.role = val;
    },
    updateId(state, val) {
      state.id = val;
    },
    updateIsAdmin(state, val) {
      state.isAdmin = val;
    },
    updateIsGuest(state, val) {
      state.isGuest = val;
    },
  },
};
