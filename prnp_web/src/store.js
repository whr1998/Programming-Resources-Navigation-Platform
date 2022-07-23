import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    TOKEN: '',
    CURRENTPATH: '',
    USERID: '' || localStorage.getItem('userid'),
    USERNAME: '' || localStorage.getItem('username'),
    TOUX: '' || localStorage.getItem('userid'),
  },
  //  Getter相当于vue中的computed计算属性
  getters: {
    getToken: (state) => { return state.TOKEN },
    getCurrentPath: (state) => { return state.CURRENTPATH },
    getUserID: (state) => { return state.USERID },
    getUserName: (state) => { return state.USERNAME },
    getToux: (state) => { return state.TOUX },
  },
  mutations: {
    set_token(state, loginToken) {
      localStorage.setItem('TOKEN', loginToken)
      state.TOKEN = loginToken
    },
    delete_token(state) {
      localStorage.removeItem('TOKEN')
      state.TOKEN = ""
    },

    set_currentPath(state, currentPath) {
      state.CURRENTPATH = currentPath
    },

    set_userId(state, userId) {
      localStorage.setItem('userid', userId)
      state.USERID = userId
    },

    set_userName(state, username) {
      localStorage.setItem('username', username)
      state.USERNAME = username
    },

    set_toux(state, toux) {
      localStorage.setItem('toux', toux)
      state.TOUX = toux
    },
  },
  actions: {
    //注册actions，类似vue里面的methods 
    //通过这个修改state里面的值
    // 可以直接用mutations修改，但是官方建议使用actions去调用mutations去修改
    set_token(context, token) {
      context.commit("set_token", token);
    },
    delete_token(context) {
      context.commit("delete_token");
    },

    set_currentPath(context, currentPath) {
      context.commit("set_currentPath", currentPath);
    },

    set_userId(context, userId) {
      context.commit("set_userId", userId);
    },

    set_userName(context, username) {
      context.commit("set_userName", username);
    },

    set_toux(context, toux) {
      context.commit("set_toux", toux);
    },
  }
})
