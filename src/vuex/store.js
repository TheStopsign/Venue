import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import AuthAPI from "@/services/AuthAPI.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    last_webex: null,
  },
  mutations: {
    // Store the user in our vuex state, add their token to
    // local storage, and add their token to the axios header
    // for any asynchronous requests that will be made
    SET_USER_DATA(state, userData) {
      if (userData != null) {
        state.user = userData;
        localStorage.setItem("user", JSON.stringify(userData));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData.token}`;
        axios.defaults.headers.common["User"] = JSON.stringify({
          _id: userData.current_user._id,
          first_name: userData.current_user.first_name,
          last_name: userData.current_user.last_name,
          email: userData.current_user.email,
          user_id: userData.current_user.user_id,
          instructor_courses: userData.current_user.instructor_courses,
          ta_sections: userData.current_user.ta_sections,
          student_sections: userData.current_user.student_sections,
        });
      }
    },
    CLEAR_USER_DATA() {
      localStorage.removeItem("user");
      location.reload();
    },
    SET_LAST_WEBEX(state, lecture_id) {
      if (lecture_id != null) {
        state.last_webex = lecture_id;
        localStorage.setItem("last_webex", lecture_id);
      }
    },
    CLEAR_LAST_WEBEX() {
      localStorage.removeItem("last_webex");
    },
  },
  actions: {
    login({ commit }, user) {
      return AuthAPI.login(user).then(({ data }) => {
        commit("SET_USER_DATA", data);
      });
    },
    loginCAS({ commit }) {
      return AuthAPI.loginStatus().then(({ data }) => {
        commit("SET_USER_DATA", data);
      });
    },
    logout({ commit }) {
      commit("CLEAR_USER_DATA");
    },
    setPermanentPassword({ commit }, user) {
      return AuthAPI.setPermanentPassword(user).then(({ data }) => {
        commit("SET_USER_DATA", data);
      });
    },
    setLastWebex({ commit }, lecture_id) {
      commit("SET_LAST_WEBEX", lecture_id);
    },
    updateCurrentUser({ commit }, data) {
      commit("SET_USER_DATA", data);
    },
  },
  getters: {
    loggedIn(state) {
      //returns true if there is state in state.user, false otherwise
      return !!state.user;
    },
  },
});
