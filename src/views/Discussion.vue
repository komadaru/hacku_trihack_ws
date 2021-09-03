<template>
<div id="container">
  <h1>掲示板</h1>
  <Board ref="board" :setId="setId"></Board>
  <Form ref="form" @onPosted="this.$refs.board.loadPosts()"></Form>
</div>
</template>

<script>
import Board from "../components/Board.vue"
import Form from '../components/Form.vue'

export default {
  name: 'Discussion',
  components: {
    Board,
    Form
  },
  data() {
    return {
      setId: null
    }
  },
  mounted() {
    this.setId = this.$refs.form.setId
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
  margin-top: 60px;
}

#container {
  max-width: 700px;
  margin: 0 auto;
}
</style>