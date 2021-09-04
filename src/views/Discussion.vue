<template>
<div id="container">
  <h1>議題：{{ name }}</h1>
  <p class="d-data">タイプ:{{ type }} 
    <span v-if="tags.length">タグ:
      <span v-for="tag in tags" :key="tag">{{tag}}</span>
    </span> 
    状態:<span v-if="closed">閉じられました</span></p>
  <p>{{ description }}</p>
  <Board ref="board" :posts="posts"></Board>
  <Form ref="form"></Form>
</div>
</template>

<script>
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"
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
      setId: null,
      name: "",
      description: "",
      tags: [],
      closed: false,
      posts: [],
      type: ""
    }
  },
  methods: {
    loadDiscuss() {
      let db = firebase.firestore();
      // 議論の情報を取得
      let disRef = db.collection("discussions").doc(this.$route.params.did);
      disRef.get().then((doc) => {
        let data = doc.data()
        this.name = data.name
        this.closed = data.closed
        if (data.tags !== void 0) {this.tags = data.tags}
        this.description = data.description
        this.type = data.type
      });
      // 投稿を全て取得
      let postsRef = disRef.collection("posts")
      let posts = [];
      postsRef.get().then((snapshot) => {
        for (let doc of snapshot.docs) {
          let post = doc.data();
          post.id = doc.id; //idをセット
          post.replys = []; //返信の配列作成
          post.time = post.time.toDate(); //日付をDate型に変更
          posts.push(post)
        }
        console.log(posts)
        this.posts = this.sortByTime(this.makeTree(posts));
      })
    },
    makeTree(posts) {
      for (let post of posts){
        if (typeof post.parentId !== "undefined") {
          post.parent = posts.find((p) => {
            return p.id == post.parentId;
          });
          post.parent.replys.push(post);
        }
      }
      posts = posts.filter((post) => {
        return typeof post.parentId === "undefined"
      })
      return posts
    },
    sortByTime(tree) {
      let self = this
      tree.sort((a, b) => a.time - b.time);
      for (let node of tree) {
        if (node.replys.length != 0){
          self.sortByTime(node.replys)
        }
      }
      return tree;
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