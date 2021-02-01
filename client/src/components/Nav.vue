<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/edit">Edit</router-link> |
    <a v-if="!$auth.isAuthenticated" @click="login">Login</a>
    <a v-if="$auth.isAuthenticated" @click="logout"> | Logout | </a>
    <router-link v-if="$auth.isAuthenticated" to="/profile"
      >Profile</router-link
    >
  </div>
</template>

<script>
export default {
  name: 'my-nav',
  methods: {
    login () {
      this.$auth.loginWithRedirect()
    },
    logout () {
      this.$auth.logout({
        returnTo: window.location.origin
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
