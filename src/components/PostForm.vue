<template>
  <form class="card card-body border-dark" @submit.prevent="onSubmit">
    <div class="row">
      <!--投票の時-->
      <div class="mb-3 col" v-if="isVote()">
        <label class="form-label">投票：
        <select v-model="voteChoice" class="form-select" required>
          <option :value="choice" v-for="choice in replyingPost.vote.choices" :key="choice">{{choice}}</option>
        </select>
      </label>
      </div>
      <!--アイデア出しの時-->
      <div class="mb-3 col" v-else-if="isIdea()">
        <p class="form-text">アイデア出し</p>
        <p class="form-text">1行1アイデア。空行は無視されます</p>
      </div>
      <!--それ以外のとき-->
      <div class="mb-3 col" v-else>
      <label class="form-label">タイプ：
        <select v-model="type" class="form-select" required>
          <option 
            :value="key" 
            v-for="[key, value] in types()" 
            :key="key">
          {{value}}</option>
        </select>
      </label>
      </div>
      <!--送信先情報と返信のキャンセルボタン-->
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
    <!--投票の作成とアイデア募集の作成-->
    <VoteForm 
      v-if="type==='vote'"
      v-model:choices="creatingVote.choices"
      v-model:nChoicesPerPerson="creatingVote.nChoicesPerPerson"
      v-model:timelimit="creatingVote.timelimit"></VoteForm>
    <IdeaForm
      v-else-if="type==='ideaEvent'"
      v-model:timelimit="ideaEvent.timelimit"></IdeaForm>
    <!--コメントの中身-->
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
    <!--送信ボタンと取り消しボタン-->
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
import IdeaForm from "./IdeaForm.vue"

export default {
  props: {
    destPath: String,
    disId: String,
    replyingPost: Object
  },
  components: {
    VoteForm,
    IdeaForm
  },
  data(){
    return{
      type: "comment-type",
      name: "",
      commenter: "",
      content: "",
      voteChoice: void 0,
      creatingVote: {
        choices: "",
        nChoicesPerPerson: 1,
        timelimit: moment().format("YYYY-MM-DD HH:mm")
      },
      ideaEvent: {
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
        "voteChoice": this.voteChoice,
      }
      if (this.isReply()) {
        post.parentId = this.replyingPost.id
      }
      if (this.type === "vote") {
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
      } else if (this.type === "ideaEvent") {
        post.ideaEvent = this.ideaEvent;
        // Timestamp型に変換
        post.ideaEvent.timelimit
          = firebase.firestore.Timestamp.fromDate(
            new Date(post.ideaEvent.timelimit))
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
        if (postData.type === "close") {
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
      let ret = new Map(typeMap)
      if (this.isReply()) {
        // 返信ではクローズと投票とアイデア募集は選べない
        let invalidsIfReply = ["close", "vote", "ideaEvent"]
        invalidsIfReply.forEach((invalid) => ret.delete(invalid))
      }
      return ret
    },
    isReply(){
      return typeof this.replyingPost !== "undefined";
    },
    isVote() {
      return this.isReply() && "vote" in this.replyingPost;
    },
    isIdea() {
      return this.isReply() && "ideaEvent" in this.replyingPost;
    },
    clear() {
      this.type = "comment-type";
      this.content = "";
      this.voteChoice = void 0;
      this.creatingVote = {
        choices: "",
        nChoicesPerPerson: 1,
        timelimit: moment().format("YYYY-MM-DD HH:mm")
      };
      this.ideaEvent = {
        timelimit: moment().format("YYYY-MM-DD HH:mm")
      }
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