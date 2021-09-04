<template>
<div id="container">
  <div id="main" v-if="isValid">
  <h1>議題：{{ name }}</h1>
  <p class="d-data">タイプ:{{ type }} 
    <span v-if="tags.length">タグ:
      <span v-for="tag in tags" :key="tag">{{tag}}</span>
    </span> 
    状態:<span v-if="closed">閉じられました</span></p>
  <p>{{ description }}</p>
  <Board ref="board" :disId="disId"></Board>
  <PostForm ref="form" :disId="disId"></PostForm>
  </div>
  <p class="invalid-message" v-else>議論 (id:{{ disId }})は存在しないか、閲覧する権限がありません。</p>
</div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
import Board from "../components/Board.vue"
import PostForm from '../components/PostForm.vue'

export default {
  name: 'Discussion',
  components: {
    Board,
    PostForm
  },
  data() {
    return {
      disId: this.$route.params.did,
      name: "",
      description: "",
      tags: [],
      closed: false,
      type: "",
      isValid: true
    }
  },
  methods: {
    loadDiscuss() {
      let db = firebase.firestore();
      // 議論の情報を取得
      let disRef = db.collection("discussions").doc(this.disId);
      disRef.get().then((doc) => {
        let data = doc.data()
        this.name = data.name
        this.closed = data.closed
        if (data.tags !== void 0) {this.tags = data.tags}
        this.description = data.description
        this.type = data.type
      }).catch(() =>{this.isValid = false});
    }
  },
  created() {
    //デバッグ
    let self = this
    firebase.auth().signInWithEmailAndPassword(
      "example@example.com", "example")
    .then((v) => {
      console.log("ログイン成功 uid:" + v.user.uid)
      console.log("コメントを初期化しています");
      self.loadDiscuss();
    })
    .catch(e => console.error("ログイン失敗" + e))
    //ここまでデバッグ

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