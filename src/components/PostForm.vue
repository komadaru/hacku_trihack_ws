<template>
  <form class="card card-body border-dark" @submit.prevent="onSubmit">
    <div class="row">
      <div class="mb-3 col" v-if="isVote()">
        <label class="form-label">投票：
        <select v-model="voteChoice" class="form-select" required>
          <option :value="choice" v-for="choice in replyingVote.choices" :key="choice">{{choice}}</option>
        </select>
      </label>
      </div>
      <div class="mb-3 col" v-else>
      <label class="form-label">タイプ：
        <select v-model="type" class="form-select" required>
          <option :value="key" v-for="(t,key) in types()" :key="key">{{key}}</option>
        </select>
      </label>
      </div>
      <div class="mb-3 col" v-if="isReply()">
        <span>返信先：#({{ destPath }}) 
        <button 
          type="button"
          @click="deleteForm"
          onclick="return false"
          class="btn btn-warning">
          返信をキャンセル</button>
        </span>
      </div>
      <div class="mb-3 col">
      <label class="form-label">名前：
        <input 
          type="text" 
          class="form-control"
          v-model="name" 
          readonly>
      </label>
      </div>
    </div>
    <VoteForm 
      v-if="type==='投票'"
      v-model:choices="creatingVote.choices"
      v-model:nChoicesPerPerson="creatingVote.nChoicesPerPerson"
      v-model:timelimit="creatingVote.timelimit"></VoteForm>
    <button type="button" @click="test(creatingVote)">test</button>
    <div class="mb-3 row">
    <label class="form-label">コメント：
      <textarea 
        v-model="content"
        class="form-control mb-3 mx-auto"
        rows="11"
        required>
      </textarea>
    </label>
    </div>
    <div class="mb-3">
      <input type="submit" class="btn btn-primary">
      <button type="button" class="btn btn-danger" @click="clear">すべてクリア</button>
    </div>
  </form>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import moment from "moment";
import typeMap from "../../plugins/typeMap.js"
import VoteForm from "./VoteForm.vue"

export default {
  props: {
    destPath: String,
    destId: String,
    disId: String,
    replyingVote: Object
  },
  components: {
    VoteForm
  },
  data(){
    return{
      type: "コメント",
      name: "",
      commenter: "",
      content: "",
      voteChoice: void 0,
      creatingVote: {
        choices: "",
        nChoicesPerPerson: 1,
        timelimit: moment().format("YYYY-MM-DD HH:mm")
      }
    }
  },
  methods: {
    onSubmit() {
      let post = {
        "type": this.type,
        "commenter": this.commenter,
        "content": this.content,
        "time": firebase.firestore.Timestamp.now(),
        "parentId": this.destId,
        "voteChoice": this.voteChoice
        }
      if (this.type === "投票") {
        post.vote = this.creatingVote;
        // Timestamp型に変換
        post.vote.timelimit
          = firebase.firestore.Timestamp.fromDate(
            new Date(post.vote.timelimit))
        // 改行で分割したリストにする（空文字は消す）
        post.vote.choices = post.vote.choices.split(/\r\n|\n/)
        post.vote.choices = post.vote.choices.filter(el => {
          return el != "";
        });
      }
      this.postComment(post);
      this.$emit("onSubmit")
      this.clear();
      if (this.isReply()) {this.deleteForm();}
    },
    postComment(postData) {
      let db = firebase.firestore();
      let col = db.collection("discussions").doc(this.disId)
        .collection("posts");
      col.add(postData)
      .then((docRef) => {
        console.log("コメントを送信しました", docRef.id)
        if (postData.type === "クローズ") {
          this.closeDiscuss(postData);
        }
      })
      .catch((e) => {
        console.error("コメントの送信に失敗しました", e)
      })
    },
    closeDiscuss(postData) {
      let db = firebase.firestore();
      let disRef = db.collection("discussions").doc(this.disId);
      disRef.update(
        {closed: true, conclusion: postData.content}).then(() => {
        console.log("クローズしました")
        this.$emit("onClosed")
      })
    },
    setUser() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.commenter = user.uid
          firebase.firestore().collection("users")
            .doc(this.commenter).get()
            .then((doc) => this.name = doc.data().name)
            .catch(() => this.name = "ユーザー名が取得できません")
        } else {
          console.error("ログインしていません")
        }
      });
    },
    types() {
      let ret = {...typeMap}
      if (this.isReply()) {
        // 返信ではクローズと投票は選べない
        delete ret["クローズ"]
        delete ret["投票"]
      }
      return ret
    },
    isReply(){
      return typeof this.destId !== "undefined";
    },
    isVote() {
      return typeof this.replyingVote !== "undefined";
    },
    clear() {
      this.type = "コメント";
      this.content = "";
      this.voteChoice = void 0;
      this.creatingVote = {
        choices: "",
        nChoicesPerPerson: 1,
        timelimit: moment().format("YYYY-MM-DD HH:mm")
      };
    },
    deleteForm() {
      this.$emit("deleted")
    },
    test(s) {
      console.log(s)
    }
  },
  created() {
    this.setUser()
  }
}
</script>

<style scoped>
  form {
    /*border: solid 0.1rem black;*/
  }

  textarea {
    max-width: 80%;
  }
</style>