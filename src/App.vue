<template>
  <div id="nav">
  </div>
  <topbar v-if="$route.path!=='/'&&$route.path!=='/signup'"/>
  <router-view/>
</template>

<script>
import Topbar from '@/components/layouts/Topbar'
export default {
  components: {
    Topbar
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
