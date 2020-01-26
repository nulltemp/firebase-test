<template>
  <div>
    <div v-if="isLoading">loading</div>
    <div v-else>
      <button @click="doLogin('google')">Login in with Google</button>
      <button @click="doLogin('github')">Login in with Github</button>
    </div>
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
      'googleLogin', 'githubLogin', 'setUser'
    ]),
    async doLogin (type) {
      this.isLoading = true
      if (type === 'google') {
        await this.googleLogin()
      } else {
        await this.githubLogin()
      }
    }
  }
}
</script>

<style scoped>
</style>