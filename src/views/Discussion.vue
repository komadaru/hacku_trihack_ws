<template>
<div id="container">
  <div id="main" v-if="isValid">
  <h1>議題：{{ name }}</h1>
  <p class="d-data">タイプ:{{ type }} 
    <span v-if="tags.length">タグ:
      <span v-for="tag in tags" :key="tag">{{tag}}</span>
    </span> 
    状態:
    <span v-if="closed">
      クローズされました
      <button type="button" @click="switchOpen">
        再度オープンする
      </button>
    </span>
    <span v-else>
      オープン
      <button type="button" @click="switchOpen">
        クローズする
      </button>
    </span>
  </p>
  <p>{{ description }}</p>
  <Board ref="board" :disId="disId" :idUsers="idUsers" v-if="boardOk"></Board>
  <PostForm ref="form" :disId="disId" @onSubmit="reloadPosts"
    @onClosed="loadDiscuss"
    v-if="!closed"></PostForm>
  </div>
  <p class="invalid-message" v-else>議論 (id:{{ disId }})は存在しないか、閲覧する権限がありません。</p>
  <div class="conclusion" v-if="closed">
    <h2>結論:</h2>
    <p>{{ conclusion }}</p>
  </div>
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
      community: "",
      name: "",
      description: "",
      tags: [],
      closed: false,
      type: "",
      isValid: true,
      idUsers: {},
      boardOk: false,
      conclusion: ""
    }
  },
  methods: {
    setIdUsers() {
      let db = firebase.firestore();
      // コミュニティの情報を取得
      let comRef = db.collection("communities").doc(this.community);
      return comRef.get().then((doc) => {
        let uids = doc.data().users;
        let uCol = db.collection("users")
        let promises = [];
        for (let uid of uids) {
          promises.push(uCol.doc(uid).get())
        }
        Promise.all(promises).then((docs) => {
          for (let d of docs) {
            this.idUsers[d.id] = d.data();
          }
        })
      })
    },
    loadDiscuss() {
      let db = firebase.firestore();
      // 議論の情報を取得
      let disRef = db.collection("discussions").doc(this.disId);
      return disRef.get().then((doc) => {
        let data = doc.data()
        this.name = data.name
        this.closed = data.closed
        this.description = data.description
        this.type = data.type
        this.closed = data.closed
        this.community = data.community
        if (data.tags !== void 0) {this.tags = data.tags}
        if (data.conclusion !== void 0) {this.conclusion = data.conclusion}
      }).catch(() => {this.isValid = false});
    },
    reloadPosts() {
      this.$refs.board.loadPosts()
    },
    switchOpen() {
      let db = firebase.firestore();
      // 議論の情報を取得
      let disRef = db.collection("discussions").doc(this.disId);
      disRef.update({closed: !this.closed}).then(() =>{
        this.loadDiscuss();
      });
    }
  },
  created() {
    // ログインチェックを待ってから読み込み
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid + "でログイン中")
        this.loadDiscuss().then(() => {
          this.setIdUsers().then(() => {
            this.boardOk = true;
          });
        });
      } else {
        this.isValid = false;
        console.error("ログインしていません");
      }
    })
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

.conclusion {
  border: solid 0.1rem;
  font-size: 2rem;
}
</style>