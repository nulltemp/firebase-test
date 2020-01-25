<template>
  <div>
    <div v-if="isLoading">loading</div>
    <button v-else @click="googleLogin">Login in with Google</button>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      isLoading: true
    }
  },
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setUser(user.uid) // setUser is mapped action from vuex
        this.$router.push('/') // if non-null user given, go to root page.
      } else {
        this.setUser(null)
        this.isLoading = false
      }
    })
  },
  methods: {
    ...mapActions([
      'login', 'setUser'
    ]),
    async googleLogin () {
      this.isLoading = true
      await this.login()
    }
  }
}
</script>

<style scoped>
</style>