<template>
<div id="container">
  <h1>議題：{{ name }}</h1>
  <p class="d-data">タイプ:{{ type }} 
    <span v-if="tags.length">タグ:
      <span v-for="tag in tags" :key="tag">{{tag}}</span>
    </span> 
    状態:<span v-if="closed">閉じられました</span></p>
  <Board ref="board" :posts="posts"></Board>
  <Form ref="form" @onPosted="this.$refs.board.loadPosts()"></Form>
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
    loadPosts() {
      let posts = [];
      let db = firebase.firestore();
      let ref = db.collection("discussions").doc(this.$route.params.did);
      ref.get().then((doc) => {
        let data = doc.data()
        console.log(data)
        this.name = data.name
        this.closed = data.closed
        if (data.tags !== void 0) {this.tags = data.tags}
        this.description = data.description
        this.type = data.type
        this.posts = this.sortByTime(this.makeTree(posts));
    });
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
  },
  getPostPathById(id){
    let post = this.getPostById(id)
    return this.getPostPath(post)
  },
  getPostPath(post) {
    let index = this.getPostIndexById(post.id)
    if (typeof post.parent === "undefined") {
      return index       
    } else {
      let parentPath = this.getPostPath(post.parent)
      return parentPath + "/" + index
    }
  },
  getPostIndexById(id) {
    let self = this
    let post = self.getPostById(id)
    // 返信ではないpostの場合そのままのインデックスを取得
    if (post.parentId === void 0) {
      return self.posts.findIndex((p) => {
        return p == post;
      }) + 1;
    }
    // 返信である場合、親の返信の中でのインデックスを取得する
    return post.parent.replys.findIndex((p) => {
      return p == post;
    }) + 1;
  },
  getPostById(id) {
    let self = this
    for (let post of self.posts) {
      let ret = self.searchPostById(post, id);
      if (ret !== null) return ret
    }
    return null;
  },
  searchPostById(currentPost, id) {
    // そのpostのidが探しているものと一致するならそれを返す
    if (currentPost.id == id) {
      return currentPost
    }
    // 全ての返信を探す
    for (let reply of currentPost.replys) {
      let ret = this.searchPostById(reply, id)
      if (ret !== null) return ret;
    }
    return null;
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
      self.loadPosts();
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