<template>
  <div>
    <div v-if="isLoading">loading</div>
    <div v-else>
      <button @click="doLogin('google')">Login in with Google</button>
      <button @click="doLogin('github')">Login in with Github</button>
      <button @click="doLogin('slack')">Login in with Slack</button>
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
  async created () {
    const queryPrams = new URLSearchParams(window.location.search);
    const token = queryPrams.get('t');

    if (token) {
      await firebase.auth().signInWithCustomToken(token);
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
      switch(type) {
        case 'google':
          await this.googleLogin()
          break
        case 'github':
          await this.githubLogin()
          break
        case 'slack':
          location.href =`https://slack.com/oauth/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=identity.basic&redirect_uri=${process.env.REDIRECT_URL}`
          break
        default:
          throw new Error('invalid login type.')
      }
    }
  }
}
</script>

<style scoped>
</style>