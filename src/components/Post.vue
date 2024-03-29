<template>
  <div class="post-wrapper">
  <div :class="['post card',{'border-info':isBorderColored()}]">
      <div :class="['card-header',{'bg-info':isBgColored()}]">
      <div class="row">
        <div class="col mb-1">
        <!--付加情報（票かどうか、返信かどうか）-->
        <span v-if="isReply()">
          <span v-if="isVoteChoice()">(投票)</span>
          <span v-else>(Re)</span>
        </span>
        <!--バッジ（この投稿は何を主張しているのか）-->
        <span 
          v-if="isVoteChoice()"
          :class="['choice'].concat(
            stringToClasses(post.voteChoice))">
          {{post.voteChoice}}
        </span>
        <span 
          v-else 
          :class="['type', post.type].concat(
            stringToClasses(typeString(post.type)))">
          {{ typeString(post.type) }}
        </span>
        <!--パス（ツリーのインデックスを階層ごとに列挙）-->
        <span class="path"> #({{ path }}) </span>
        </div>
        <!--投稿時間-->
        <div class="col mb-1">{{ format(post.time) }}
        <!--返信ボタン-->
          <a 
            type="button"
            @click="switchForm" 
            class="reply btn btn-secondary
              btn-sm stretched-link">
          返信</a>
        </div>
      </div>
      <!--投稿者の情報-->
      <div class="commenter-name mb-0">
        <router-link 
        class="commenter-name-link"
        :to="'/user/' + post.commenter.uid">
        by {{ post.commenter.name }}</router-link>
        <span v-if="'role' in post.commenter">
          ({{ post.commenter.role }})
        </span>
      </div>
    </div>
    <!--本文-->
    <p class="card-body">{{ post.content }}</p>
    <!--投票またはアイデア募集に関する情報-->
    <VoteInfo v-if="post.type==='vote'" :post="post"
    :vote="post.vote">
    </VoteInfo>
    <IdeaInfo v-else-if="post.type==='ideaEvent'" :post="post"
    :ideaEvent="post.ideaEvent">
    </IdeaInfo>
    <!--返信のonof-->
    <span v-if="hasReply()" class="switch-reply">
      <button class="btn btn-link" @click="switchReply">{{ switchingMessage() }}</button>
    </span>
  </div>
  <!--返信用フォーム-->
  <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"
   @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
  <PostForm v-if="showsForm" :destPath="path" :replyingPost="post"
   :disId="disId" @deleted="switchForm"
   @onSubmit="$emit('onFormSubmit')"></PostForm>
  </transition>
  <!--返信を再帰的に呼び出し-->
  <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter"
   @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
  <ul class="replys" v-show="showsReply">
    <li v-for="(rPost, index) in post.replys" :key="rPost.id">
      <Post :post="rPost" :disId ="disId"
        :disType="disType"
        :path="path + '/' + (index + 1)"
        @onFormSubmit="$emit('onFormSubmit')">
      </Post>
    </li>
  </ul></transition>
  </div>
</template>

<script>
import PostForm from "./PostForm.vue";
import VoteInfo from "./VoteInfo.vue";
import IdeaInfo from "./IdeaInfo.vue";
import typeMap from "../../plugins/typeMap.js";
import classMap from "../../plugins/classMap.js";
import moment from "moment";

export default {
  props: {
    disId: String,
    disType: String,
    post: Object,
    path: String
  },
  emits: ["onFormSubmit"],
  components: {
    PostForm,
    VoteInfo,
    IdeaInfo
  },
  data(){
    return{
      showsReply: this.showsReplyDefalut(),
      showsForm: false
    }
  },
  methods: {
    format(time) {
      return moment(time).format("YYYY/MM/DD HH:mm:ss");
    },
    isReply() {
      return "parentId" in this.post;
    },
    isVoteChoice() {
      return "voteChoice" in this.post;
    },
    isIdea() {
      return this.isReply() && this.post.parent.type === "アイデア出し";
    },
    isBgColored() {
      return this.post.type==='vote' || this.isVoteChoice()
        || this.post.type==='ideaEvent' || this.isIdea();
    },
    isBorderColored() {
      return this.post.type==='vote' || this.isVoteChoice()
        || this.post.type==='ideaEvent' || this.isIdea();
    },
    stringToClasses(string) {
      let ret = [];
      // 特定の文字列が含まれる場合対応するクラスを付与
      for (let key of classMap.keys()) {
        if (string.includes(key)) {
          ret.push(classMap.get(key))
        }
      }
      return ret;
    },
    showsReplyDefalut() {
      // これが投票に対するリプライならばこれへのリプライはデフォルトで表示しない
      return !(this.isReply() && this.post.parent.type === "vote")
    },
    hasReply() {
      return this.post.replys.length != 0;
    },
    switchReply() {
      this.showsReply = !this.showsReply;
    },
    switchingMessage() {
      let nReplys = this.post.replys.length;
      if (this.showsReply) {
        return "▲返信(" + nReplys +")を非表示"
      }
      return "▼返信(" + nReplys + ")を表示"
    },
    typeString(type) {
      // タイプに対応する文字列（"comment-type"に対する"コメント"など）
      if (typeMap.has(type)) {
        return typeMap.get(type);
      } else if (type === "role") {
        // 役割の場合役割の名前にする
        return this.post.commenter.role
      }
      return "?不明なタイプ?"
    },
    switchForm() {
      this.showsForm = !this.showsForm
    },
    beforeEnter(el) {
      el.style.height = '0';
    },
    enter(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    afterEnter(el) {
      el.style.height = 'auto';
    },
    beforeLeave(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    leave(el) {
      el.style.height = '0';
    },
    afterLeave(el) {
      el.style.height = 'auto';
    },
  }
}
</script>

<style scoped>
  .post {
    margin: 1rem auto;
  }

  .commenter-name-link {
    position: relative;
    z-index: 2;
  }

  .switch-reply {
    z-index: 1;
  }

  li {
    list-style-type: none;
    position: relative;
  }

  li::before {
    position: absolute;
    content: "";
    border-left: solid 0.1rem black;
    width: 10px;
    height: calc(100% + .25em + 1rem);
    top: -1rem;
    left: -1em;
  }

  li:last-child::before {
    height: 3rem;
  }

  li::after {
    position: absolute;
    content: "";
    border-top: solid 0.1rem black;
    width: 1em;
    height: 10px;
    top: 2em;
    left: -1em;
  }

  .v-enter-from, .v-leave-to {
    opacity: 0;
  }
  .v-enter-to, .v-leave-from {
    opacity: 1;
  }
  .v-enter-active{
    transition: height .4s ease-in-out, opacity .4s ease-in-out;
  }
  .v-leave-active{
    transition: height .4s ease-in-out, opacity .2s ease-in-out;
  }

  /*タイプ*/
  .type, .choice {
    border: solid 0.1rem;
    border-radius: 15%;
    font-size: 0.9rem;
    padding: 0.2rem;
    margin-right: 0.7em;

  }
  .choice::after {
    content: "🗳"
  }
  .agree, .conditional-agree {
    color: orangered;
  }

  .agree::before, .conditional-agree::before {
    content: "〇";
  }

  .disagree, .conditional-disagree {
    color: mediumblue;
  }

  .disagree::before, .conditional-disagree::before {
    content: "✖";
  }

  .counter::before {
    content: "💥";
  }

  .comment-type::before {
    content: "💬"
  }

  .report::before {
    content: "ℹ"
  }

  .question::before {
    content: "Q."
  }

  .answer::before {
    content: "A."
  }
  .vote::before {
    content: "🗳"
  }

  .judge {
    content: "‍⚖️"
  }

  .close {
    color: green;
  }
  .close::before {
    content: "✓"
  }
</style>