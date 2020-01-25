import firebase from '@/plugins/firebase'

const googleProvider = new firebase.auth.GoogleAuthProvider()

export const state = () => ({
  uid: null
})

export const getters = {
  isAuthenticated (state) {
    return !!state.uid
  }
}

export const actions = {
  async login () {
    await firebase.auth().signInWithRedirect(googleProvider)
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