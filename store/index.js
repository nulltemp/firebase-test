import firebase from '@/plugins/firebase'

const googleProvider = new firebase.auth.GoogleAuthProvider()
const githubProvider = new firebase.auth.GithubAuthProvider();

export const state = () => ({
  uid: null
})

export const getters = {
  isAuthenticated (state) {
    return !!state.uid
  }
}

export const actions = {
  async googleLogin () {
    await firebase.auth().signInWithRedirect(googleProvider)
  },
  async githubLogin () {
    await firebase.auth().signInWithRedirect(githubProvider)
  },
  async logout ({ commit }) {
    try {
      await firebase.auth().signOut();
    } finally {
      commit('setUser', null)
    }
  },
  setUser ({ commit }, payload) {
    commit('setUser', payload)
  }
}

export const mutations = {
  setUser (state, payload) {
    state.uid = payload
  }
}